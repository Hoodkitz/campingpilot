from pydantic import BaseModel, Field
from datetime import date
from typing import Optional


class SaisonpreisBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    start_datum: date
    end_datum: date
    preis_pro_nacht: float = Field(..., ge=0)
    stellplatz_typ: str = Field(..., min_length=1, max_length=50)


class SaisonpreisCreate(SaisonpreisBase):
    pass


class SaisonpreisUpdate(BaseModel):
    name: Optional[str] = None
    start_datum: Optional[date] = None
    end_datum: Optional[date] = None
    preis_pro_nacht: Optional[float] = Field(None, ge=0)
    stellplatz_typ: Optional[str] = None


class SaisonpreisResponse(SaisonpreisBase):
    id: int

    class Config:
        from_attributes = True
