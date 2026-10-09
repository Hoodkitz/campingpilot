from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date
from ..core.database import get_db
from ..models.saison import Saisonpreis
from ..schemas.saison import SaisonpreisCreate, SaisonpreisUpdate, SaisonpreisResponse
from .auth import get_current_active_user

router = APIRouter()


@router.get("/", response_model=List[SaisonpreisResponse])
def list_saisonpreise(
    skip: int = 0,
    limit: int = 100,
    stellplatz_typ: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    query = db.query(Saisonpreis)
    if stellplatz_typ:
        query = query.filter(Saisonpreis.stellplatz_typ == stellplatz_typ)
    return query.offset(skip).limit(limit).all()


@router.get("/{preis_id}", response_model=SaisonpreisResponse)
def get_saisonpreis(
    preis_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    preis = db.query(Saisonpreis).filter(Saisonpreis.id == preis_id).first()
    if not preis:
        raise HTTPException(status_code=404, detail="Saisonpreis nicht gefunden")
    return preis


@router.post("/", response_model=SaisonpreisResponse, status_code=status.HTTP_201_CREATED)
def create_saisonpreis(
    preis: SaisonpreisCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    if preis.end_datum <= preis.start_datum:
        raise HTTPException(status_code=400, detail="Enddatum muss nach Startdatum liegen")
    db_preis = Saisonpreis(**preis.model_dump())
    db.add(db_preis)
    db.commit()
    db.refresh(db_preis)
    return db_preis


@router.put("/{preis_id}", response_model=SaisonpreisResponse)
def update_saisonpreis(
    preis_id: int,
    preis_update: SaisonpreisUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    db_preis = db.query(Saisonpreis).filter(Saisonpreis.id == preis_id).first()
    if not db_preis:
        raise HTTPException(status_code=404, detail="Saisonpreis nicht gefunden")
    update_data = preis_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_preis, field, value)
    if db_preis.end_datum <= db_preis.start_datum:
        raise HTTPException(status_code=400, detail="Enddatum muss nach Startdatum liegen")
    db.commit()
    db.refresh(db_preis)
    return db_preis


@router.delete("/{preis_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_saisonpreis(
    preis_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    db_preis = db.query(Saisonpreis).filter(Saisonpreis.id == preis_id).first()
    if not db_preis:
        raise HTTPException(status_code=404, detail="Saisonpreis nicht gefunden")
    db.delete(db_preis)
    db.commit()
    return None
