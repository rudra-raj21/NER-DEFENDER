from pydantic import BaseModel, Field
from typing import Dict, List, Optional

class RiskFactorBreakdown(BaseModel):
    landslide_history: float
    rainfall: float
    soil_moisture: float
    elevation: float
    soil_type: float

class RiskScoreResponse(BaseModel):
    area_name: str
    risk_score: float
    risk_level: str
    color: str
    factors: RiskFactorBreakdown
    recommendation: str
    timestamp: str

class AlertRequest(BaseModel):
    area_name: str
    district: Optional[str] = None
    state: Optional[str] = None

class AlertResponse(BaseModel):
    success: bool
    message: str
    timestamp: str
    area_name: str

class IncidentReportCreate(BaseModel):
    reporter_name: str
    location_name: str
    latitude: float
    longitude: float
    severity: str
    description: str

class IncidentReportResponse(IncidentReportCreate):
    id: str
    timestamp: str
    status: str

class WeatherDataResponse(BaseModel):
    location: str
    latitude: float
    longitude: float
    temp_c: float
    humidity_percent: float
    rainfall_24h_mm: float
    rainfall_72h_mm: float
    wind_speed_kmh: float
    condition: str
