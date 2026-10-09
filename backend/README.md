# Campingpilot

Reservierungs- und Verwaltungssystem für Wohnmobilparks/Campingplätze.

## Quick Start

```bash
# Backend
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# Frontend (neues Terminal)
cd frontend
npm install
npm run dev
```

→ http://localhost:3000

## Tests

```bash
cd backend && pytest tests/ -v
```
