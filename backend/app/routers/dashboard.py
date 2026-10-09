from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, date
from ..core.database import get_db
from ..models.stellplatz import Stellplatz, StellplatzTyp
from ..models.buchung import Buchung, BuchungStatus
from ..schemas.dashboard import DashboardStats
from .auth import get_current_active_user

router = APIRouter()


@router.get("/", response_model=DashboardStats)
def get_dashboard(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    gesamt = db.query(Stellplatz).filter(Stellplatz.ist_aktiv == True).count()
    belegte = db.query(Buchung).filter(
        Buchung.status == BuchungStatus.CHECKED_IN
    ).count()
    freie = gesamt - belegte
    aktive = db.query(Buchung).filter(
        Buchung.status.in_([BuchungStatus.RESERVIERT, BuchungStatus.CHECKED_IN])
    ).count()

    now = datetime.now()
    monat_start = datetime(now.year, now.month, 1)
    jahr_start = datetime(now.year, 1, 1)

    umsatz_monat_row = db.query(func.coalesce(func.sum(Buchung.gesamtpreis), 0)).filter(
        Buchung.status != BuchungStatus.STORNIERT,
        Buchung.check_in >= monat_start,
    ).scalar()
    umsatz_jahr_row = db.query(func.coalesce(func.sum(Buchung.gesamtpreis), 0)).filter(
        Buchung.status != BuchungStatus.STORNIERT,
        Buchung.check_in >= jahr_start,
    ).scalar()

    # Stellplaetze nach Typ
    typ_counts = {}
    for typ in StellplatzTyp:
        count = db.query(Stellplatz).filter(
            Stellplatz.typ == typ,
            Stellplatz.ist_aktiv == True
        ).count()
        typ_counts[typ.value] = count

    # Buchungen nach Status
    status_counts = {}
    for s in BuchungStatus:
        count = db.query(Buchung).filter(Buchung.status == s).count()
        status_counts[s.value] = count

    durchschnitt = 0.0
    if gesamt > 0:
        durchschnitt = round((belegte / gesamt) * 100, 1)

    return DashboardStats(
        gesamt_stellplaetze=gesamt,
        belegte_stellplaetze=belegte,
        freie_stellplaetze=freie,
        aktive_buchungen=aktive,
        umsatz_monat=round(umsatz_monat_row or 0, 2),
        umsatz_jahr=round(umsatz_jahr_row or 0, 2),
        durchschnittliche_belegung=durchschnitt,
        stellplaetze_nach_typ=typ_counts,
        buchungen_nach_status=status_counts,
    )
