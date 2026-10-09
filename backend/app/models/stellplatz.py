from sqlalchemy import Column, Integer, String, Float, Boolean, Enum, DateTime
from sqlalchemy.sql import func
import enum
from ..core.database import Base


class StellplatzTyp(str, enum.Enum):
    WOHNMOBIL = "wohnmobil"
    ZELT = "zelt"
    WOHNWAGEN = "wohnwagen"


class Stellplatz(Base):
    __tablename__ = "stellplaetze"

    id = Column(Integer, primary_key=True, index=True)
    nummer = Column(String, unique=True, index=True, nullable=False)
    typ = Column(Enum(StellplatzTyp), nullable=False)
    beschreibung = Column(String, default="")
    preis_pro_nacht = Column(Float, nullable=False, default=0.0)
    hat_strom = Column(Boolean, default=False)
    hat_wasser = Column(Boolean, default=False)
    ist_aktiv = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
