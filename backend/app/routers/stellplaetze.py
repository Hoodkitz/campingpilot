from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date
from ..core.database import get_db
from ..models.stellplatz import Stellplatz, StellplatzTyp
from ..schemas.stellplatz import StellplatzCreate, StellplatzUpdate, StellplatzResponse
from .auth import get_current_active_user

router = APIRouter()


@router.get("/", response_model=List[StellplatzResponse])
def list_stellplaetze(
    skip: int = 0,
    limit: int = 100,
    typ: Optional[StellplatzTyp] = None,
    verfuegbar: Optional[bool] = None,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    query = db.query(Stellplatz)
    if typ:
        query = query.filter(Stellplatz.typ == typ)
    if verfuegbar is not None:
        query = query.filter(Stellplatz.ist_aktiv == verfuegbar)
    return query.offset(skip).limit(limit).all()


@router.get("/{stellplatz_id}", response_model=StellplatzResponse)
def get_stellplatz(
    stellplatz_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    stellplatz = db.query(Stellplatz).filter(Stellplatz.id == stellplatz_id).first()
    if not stellplatz:
        raise HTTPException(status_code=404, detail="Stellplatz nicht gefunden")
    return stellplatz


@router.post("/", response_model=StellplatzResponse, status_code=status.HTTP_201_CREATED)
def create_stellplatz(
    stellplatz: StellplatzCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    if db.query(Stellplatz).filter(Stellplatz.nummer == stellplatz.nummer).first():
        raise HTTPException(status_code=400, detail="Stellplatznummer bereits vergeben")
    db_stellplatz = Stellplatz(**stellplatz.model_dump())
    db.add(db_stellplatz)
    db.commit()
    db.refresh(db_stellplatz)
    return db_stellplatz


@router.put("/{stellplatz_id}", response_model=StellplatzResponse)
def update_stellplatz(
    stellplatz_id: int,
    stellplatz_update: StellplatzUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    db_stellplatz = db.query(Stellplatz).filter(Stellplatz.id == stellplatz_id).first()
    if not db_stellplatz:
        raise HTTPException(status_code=404, detail="Stellplatz nicht gefunden")
    update_data = stellplatz_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_stellplatz, field, value)
    db.commit()
    db.refresh(db_stellplatz)
    return db_stellplatz


@router.delete("/{stellplatz_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_stellplatz(
    stellplatz_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    db_stellplatz = db.query(Stellplatz).filter(Stellplatz.id == stellplatz_id).first()
    if not db_stellplatz:
        raise HTTPException(status_code=404, detail="Stellplatz nicht gefunden")
    db.delete(db_stellplatz)
    db.commit()
    return None
