from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Enum
from sqlalchemy.sql import func
import enum
from ..core.database import Base


class BuchungStatus(str, enum.Enum):
    RESERVIERT = "reserviert"
    CHECKED_IN = "checked_in"
    CHECKED_OUT = "checked_out"
    STORNIERT = "storniert"


class Buchung(Base):
    __tablename__ = "buchungen"

    id = Column(Integer, primary_key=True, index=True)
    stellplatz_id = Column(Integer, ForeignKey("stellplaetze.id"), nullable=False)
    gast_name = Column(String, nullable=False)
    gast_email = Column(String, default="")
    gast_telefon = Column(String, default="")
    check_in = Column(DateTime(timezone=True), nullable=False)
    check_out = Column(DateTime(timezone=True), nullable=False)
    status = Column(Enum(BuchungStatus), default=BuchungStatus.RESERVIERT)
    gesamtpreis = Column(Float, default=0.0)
    strom_zaehler_start = Column(Float, nullable=True)
    strom_zaehler_ende = Column(Float, nullable=True)
    wasser_zaehler_start = Column(Float, nullable=True)
    wasser_zaehler_ende = Column(Float, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
