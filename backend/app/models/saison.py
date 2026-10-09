from sqlalchemy import Column, Integer, String, Float, Date
from ..core.database import Base


class Saisonpreis(Base):
    __tablename__ = "saisonpreise"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    start_datum = Column(Date, nullable=False)
    end_datum = Column(Date, nullable=False)
    preis_pro_nacht = Column(Float, nullable=False)
    stellplatz_typ = Column(String, nullable=False)  # wohnmobil, zelt, wohnwagen
