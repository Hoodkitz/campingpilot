from pydantic import BaseModel
from typing import Optional


class DashboardStats(BaseModel):
    gesamt_stellplaetze: int
    belegte_stellplaetze: int
    freie_stellplaetze: int
    aktive_buchungen: int
    umsatz_monat: float
    umsatz_jahr: float
    durchschnittliche_belegung: float
    stellplaetze_nach_typ: dict
    buchungen_nach_status: dict
