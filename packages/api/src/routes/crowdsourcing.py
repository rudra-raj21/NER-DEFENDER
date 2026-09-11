from fastapi import APIRouter
from datetime import datetime, timezone
import uuid
from typing import List
from ..models.schemas import IncidentReportCreate, IncidentReportResponse

router = APIRouter(prefix="/api/reports", tags=["crowdsourcing"])

reports_db: List[dict] = []

@router.post("", response_model=IncidentReportResponse)
def create_report(payload: IncidentReportCreate):
    record = payload.model_dump()
    record["id"] = str(uuid.uuid4())
    record["timestamp"] = datetime.now(timezone.utc).isoformat()
    record["status"] = "verified"
    reports_db.append(record)
    return IncidentReportResponse(**record)

@router.get("", response_model=List[IncidentReportResponse])
def get_reports():
    return reports_db
