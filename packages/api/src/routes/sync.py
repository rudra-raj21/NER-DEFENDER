from fastapi import APIRouter
from datetime import datetime, timezone
from typing import List, Dict, Any

router = APIRouter(prefix="/api/sync", tags=["sync"])

@router.post("/batch")
def sync_batch(items: List[Dict[str, Any]]):
    return {
        "synced_count": len(items),
        "status": "success",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

@router.get("/status")
def sync_status():
    return {
        "status": "online",
        "last_sync": datetime.now(timezone.utc).isoformat()
    }
