from fastapi import APIRouter
from datetime import datetime, timezone
from typing import List
from ..models.schemas import AlertRequest, AlertResponse

router = APIRouter(prefix="/api/alerts", tags=["alerts"])

alert_history_db: List[dict] = []

@router.post("/send", response_model=AlertResponse)
@router.post("/test", response_model=AlertResponse)
def send_alert(payload: AlertRequest):
    message = f"Alert sent to relevant authorities regarding {payload.area_name}"
    alert_record = {
        "success": True,
        "message": message,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "area_name": payload.area_name
    }
    alert_history_db.append(alert_record)
    return AlertResponse(**alert_record)

@router.get("/history")
def get_alert_history():
    return alert_history_db
