from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, date
from ..core.database import get_db
from ..models.buchung import Buchung, BuchungStatus
from ..models.stellplatz import Stellplatz
from ..schemas.buchung import BuchungCreate, BuchungUpdate, BuchungResponse, ZaehlerUpdate
from .auth import get_current_active_user

router = APIRouter()


def _check_overlap(db: Session, stellplatz_id: int, check_in: datetime, check_out: datetime, exclude_id: Optional[int] = None):
    query = db.query(Buchung).filter(
        Buchung.stellplatz_id == stellplatz_id,
        Buchung.status != BuchungStatus.STORNIERT,
        Buchung.check_in < check_out,
        Buchung.check_out > check_in,
    )
    if exclude_id:
        query = query.filter(Buchung.id != exclude_id)
    return query.first()


def _calculate_price(db: Session, stellplatz_id: int, check_in: datetime, check_out: datetime) -> float:
    stellplatz = db.query(Stellplatz).filter(Stellplatz.id == stellplatz_id).first()
    if not stellplatz:
        return 0.0
    nights = (check_out - check_in).days
    if nights <= 0:
        nights = 1
    return round(nights * stellplatz.preis_pro_nacht, 2)


@router.get("/", response_model=List[BuchungResponse])
def list_buchungen(
    skip: int = 0,
    limit: int = 100,
    status: Optional[BuchungStatus] = None,
    stellplatz_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    query = db.query(Buchung)
    if status:
        query = query.filter(Buchung.status == status)
    if stellplatz_id:
        query = query.filter(Buchung.stellplatz_id == stellplatz_id)
    return query.offset(skip).limit(limit).all()


@router.get("/{buchung_id}", response_model=BuchungResponse)
def get_buchung(
    buchung_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    buchung = db.query(Buchung).filter(Buchung.id == buchung_id).first()
    if not buchung:
        raise HTTPException(status_code=404, detail="Buchung nicht gefunden")
    return buchung


@router.post("/", response_model=BuchungResponse, status_code=status.HTTP_201_CREATED)
def create_buchung(
    buchung: BuchungCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    if buchung.check_out <= buchung.check_in:
        raise HTTPException(status_code=400, detail="Check-out muss nach Check-in liegen")
    stellplatz = db.query(Stellplatz).filter(Stellplatz.id == buchung.stellplatz_id).first()
    if not stellplatz:
        raise HTTPException(status_code=404, detail="Stellplatz nicht gefunden")
    if not stellplatz.ist_aktiv:
        raise HTTPException(status_code=400, detail="Stellplatz ist nicht aktiv")
    overlap = _check_overlap(db, buchung.stellplatz_id, buchung.check_in, buchung.check_out)
    if overlap:
        raise HTTPException(status_code=400, detail="Stellplatz ist in diesem Zeitraum bereits belegt")
    gesamtpreis = _calculate_price(db, buchung.stellplatz_id, buchung.check_in, buchung.check_out)
    db_buchung = Buchung(
        **buchung.model_dump(),
        status=BuchungStatus.RESERVIERT,
        gesamtpreis=gesamtpreis,
    )
    db.add(db_buchung)
    db.commit()
    db.refresh(db_buchung)
    return db_buchung


@router.put("/{buchung_id}", response_model=BuchungResponse)
def update_buchung(
    buchung_id: int,
    buchung_update: BuchungUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    db_buchung = db.query(Buchung).filter(Buchung.id == buchung_id).first()
    if not db_buchung:
        raise HTTPException(status_code=404, detail="Buchung nicht gefunden")
    update_data = buchung_update.model_dump(exclude_unset=True)
    if "check_in" in update_data or "check_out" in update_data:
        new_check_in = update_data.get("check_in", db_buchung.check_in)
        new_check_out = update_data.get("check_out", db_buchung.check_out)
        if new_check_out <= new_check_in:
            raise HTTPException(status_code=400, detail="Check-out muss nach Check-in liegen")
        overlap = _check_overlap(db, db_buchung.stellplatz_id, new_check_in, new_check_out, exclude_id=buchung_id)
        if overlap:
            raise HTTPException(status_code=400, detail="Stellplatz ist in diesem Zeitraum bereits belegt")
        update_data["gesamtpreis"] = _calculate_price(db, db_buchung.stellplatz_id, new_check_in, new_check_out)
    for field, value in update_data.items():
        setattr(db_buchung, field, value)
    db.commit()
    db.refresh(db_buchung)
    return db_buchung


@router.post("/{buchung_id}/checkin", response_model=BuchungResponse)
def checkin(
    buchung_id: int,
    zaehler: Optional[ZaehlerUpdate] = None,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    db_buchung = db.query(Buchung).filter(Buchung.id == buchung_id).first()
    if not db_buchung:
        raise HTTPException(status_code=404, detail="Buchung nicht gefunden")
    if db_buchung.status == BuchungStatus.CHECKED_IN:
        raise HTTPException(status_code=400, detail="Buchung ist bereits eingecheckt")
    if db_buchung.status == BuchungStatus.STORNIERT:
        raise HTTPException(status_code=400, detail="Buchung ist storniert")
    if db_buchung.status == BuchungStatus.CHECKED_OUT:
        raise HTTPException(status_code=400, detail="Buchung ist bereits ausgecheckt")
    db_buchung.status = BuchungStatus.CHECKED_IN
    if zaehler:
        if zaehler.strom_zaehler_start is not None:
            db_buchung.strom_zaehler_start = zaehler.strom_zaehler_start
        if zaehler.wasser_zaehler_start is not None:
            db_buchung.wasser_zaehler_start = zaehler.wasser_zaehler_start
    db.commit()
    db.refresh(db_buchung)
    return db_buchung


@router.post("/{buchung_id}/checkout", response_model=BuchungResponse)
def checkout(
    buchung_id: int,
    zaehler: Optional[ZaehlerUpdate] = None,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    db_buchung = db.query(Buchung).filter(Buchung.id == buchung_id).first()
    if not db_buchung:
        raise HTTPException(status_code=404, detail="Buchung nicht gefunden")
    if db_buchung.status != BuchungStatus.CHECKED_IN:
        raise HTTPException(status_code=400, detail="Buchung ist nicht eingecheckt")
    db_buchung.status = BuchungStatus.CHECKED_OUT
    if zaehler:
        if zaehler.strom_zaehler_ende is not None:
            db_buchung.strom_zaehler_ende = zaehler.strom_zaehler_ende
        if zaehler.wasser_zaehler_ende is not None:
            db_buchung.wasser_zaehler_ende = zaehler.wasser_zaehler_ende
    db.commit()
    db.refresh(db_buchung)
    return db_buchung


@router.post("/{buchung_id}/stornieren", response_model=BuchungResponse)
def stornieren(
    buchung_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    db_buchung = db.query(Buchung).filter(Buchung.id == buchung_id).first()
    if not db_buchung:
        raise HTTPException(status_code=404, detail="Buchung nicht gefunden")
    if db_buchung.status == BuchungStatus.CHECKED_OUT:
        raise HTTPException(status_code=400, detail="Ausgecheckte Buchungen können nicht storniert werden")
    if db_buchung.status == BuchungStatus.STORNIERT:
        raise HTTPException(status_code=400, detail="Buchung ist bereits storniert")
    db_buchung.status = BuchungStatus.STORNIERT
    db.commit()
    db.refresh(db_buchung)
    return db_buchung


@router.delete("/{buchung_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_buchung(
    buchung_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    db_buchung = db.query(Buchung).filter(Buchung.id == buchung_id).first()
    if not db_buchung:
        raise HTTPException(status_code=404, detail="Buchung nicht gefunden")
    db.delete(db_buchung)
    db.commit()
    return None
