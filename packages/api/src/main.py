from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import risk, alerts, weather, crowdsourcing, sync

app = FastAPI(
    title="NER DEFENDER API",
    description="AI-Based Early Warning & Landslide Risk Monitoring API for North Eastern Region India",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(risk.router)
app.include_router(alerts.router)
app.include_router(weather.router)
app.include_router(crowdsourcing.router)
app.include_router(sync.router)

@app.get("/")
def root():
    return {
        "service": "NER DEFENDER API",
        "region": "North Eastern Region (NER), India",
        "status": "active"
    }
