from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional
from enum import Enum


class StellplatzTyp(str, Enum):
    WOHNMOBIL = "wohnmobil"
    ZELT = "zelt"
    WOHNWAGEN = "wohnwagen"


class StellplatzBase(BaseModel):
    nummer: str = Field(..., min_length=1, max_length=50)
    typ: StellplatzTyp
    beschreibung: str = ""
    preis_pro_nacht: float = Field(..., ge=0)
    hat_strom: bool = False
    hat_wasser: bool = False
    ist_aktiv: bool = True


class StellplatzCreate(StellplatzBase):
    pass


class StellplatzUpdate(BaseModel):
    nummer: Optional[str] = None
    typ: Optional[StellplatzTyp] = None
    beschreibung: Optional[str] = None
    preis_pro_nacht: Optional[float] = Field(None, ge=0)
    hat_strom: Optional[bool] = None
    hat_wasser: Optional[bool] = None
    ist_aktiv: Optional[bool] = None


class StellplatzResponse(StellplatzBase):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
