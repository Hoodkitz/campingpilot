from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.database import engine, Base
from .models import User, Stellplatz, Buchung, Saisonpreis
from .routers import auth, stellplaetze, buchungen, saisonpreise, dashboard

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Campingpilot API",
    description="Reservierungs- und Verwaltungssystem für Wohnmobilparks/Campingplätze",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(stellplaetze.router, prefix="/api/stellplaetze", tags=["Stellplätze"])
app.include_router(buchungen.router, prefix="/api/buchungen", tags=["Buchungen"])
app.include_router(saisonpreise.router, prefix="/api/saisonpreise", tags=["Saisonpreise"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])


@app.get("/")
def root():
    return {"message": "Campingpilot API", "version": "1.0.0"}


@app.get("/health")
def health():
    return {"status": "ok"}
