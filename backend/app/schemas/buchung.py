from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional
from enum import Enum


class BuchungStatus(str, Enum):
    RESERVIERT = "reserviert"
    CHECKED_IN = "checked_in"
    CHECKED_OUT = "checked_out"
    STORNIERT = "storniert"


class BuchungBase(BaseModel):
    stellplatz_id: int
    gast_name: str = Field(..., min_length=1, max_length=200)
    gast_email: str = ""
    gast_telefon: str = ""
    check_in: datetime
    check_out: datetime


class BuchungCreate(BuchungBase):
    pass


class BuchungUpdate(BaseModel):
    gast_name: Optional[str] = None
    gast_email: Optional[str] = None
    gast_telefon: Optional[str] = None
    check_in: Optional[datetime] = None
    check_out: Optional[datetime] = None
    status: Optional[BuchungStatus] = None


class ZaehlerUpdate(BaseModel):
    strom_zaehler_start: Optional[float] = None
    strom_zaehler_ende: Optional[float] = None
    wasser_zaehler_start: Optional[float] = None
    wasser_zaehler_ende: Optional[float] = None


class BuchungResponse(BuchungBase):
    id: int
    status: BuchungStatus
    gesamtpreis: float
    strom_zaehler_start: Optional[float] = None
    strom_zaehler_ende: Optional[float] = None
    wasser_zaehler_start: Optional[float] = None
    wasser_zaehler_ende: Optional[float] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
