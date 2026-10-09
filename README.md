# Campingpilot

Reservierungs- und Verwaltungssystem für Wohnmobilparks/Campingplätze.

## Stack

- **Backend:** FastAPI + SQLite + SQLAlchemy + JWT-Auth
- **Frontend:** Next.js 14 + React 18 + TypeScript

## Features

- **Stellplatz-Verwaltung:** Typen (Wohnmobil, Zelt, Wohnwagen), Preise, Strom/Wasser
- **Buchungssystem:** Reservierung, Check-in/Check-out, Stornierung
- **Saisonpreise:** Saisonale Preisgestaltung pro Stellplatztyp
- **Strom/Wasser-Zähler:** Zählerstände bei Check-in/Check-out erfassen
- **Dashboard:** Auslastung, Umsatz, Statistiken
- **JWT-Auth:** Sichere Authentifizierung

## Setup

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

API läuft auf http://localhost:8000
API-Docs: http://localhost:8000/docs

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend läuft auf http://localhost:3000

## Tests

```bash
cd backend
pytest tests/ -v
```

## API-Endpunkte

| Methode | Endpoint | Beschreibung |
|---------|----------|--------------|
| POST | /api/auth/register | Registrierung |
| POST | /api/auth/token | Login (JWT) |
| GET | /api/auth/me | Aktueller Benutzer |
| GET/POST | /api/stellplaetze/ | Stellplätze |
| GET/PUT/DELETE | /api/stellplaetze/{id} | Stellplatz-Details |
| GET/POST | /api/buchungen/ | Buchungen |
| GET/PUT/DELETE | /api/buchungen/{id} | Buchungs-Details |
| POST | /api/buchungen/{id}/checkin | Check-in |
| POST | /api/buchungen/{id}/checkout | Check-out |
| POST | /api/buchungen/{id}/stornieren | Stornieren |
| GET/POST | /api/saisonpreise/ | Saisonpreise |
| GET/PUT/DELETE | /api/saisonpreise/{id} | Saisonpreis-Details |
| GET | /api/dashboard/ | Dashboard-Statistiken |

## Umgebungsvariablen

| Variable | Standard | Beschreibung |
|----------|----------|--------------|
| DATABASE_URL | sqlite:///./campingpilot.db | Datenbank-URL |
| SECRET_KEY | dev-secret-key-change-in-production | JWT-Secret |
| ACCESS_TOKEN_EXPIRE_MINUTES | 1440 | Token-Gültigkeit (Minuten) |
| NEXT_PUBLIC_API_URL | http://localhost:8000/api | API-Basis-URL (Frontend) |
