from fastapi import APIRouter, HTTPException
import os
import json

router = APIRouter(prefix="/api/deforestation", tags=["deforestation"])

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATS_FILE = os.path.abspath(os.path.join(BASE_DIR, "..", "data", "ner_deforestation_stats.json"))

def load_stats():
    if os.path.exists(STATS_FILE):
        with open(STATS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"states": {}, "districts": {}}

@router.get("/all")
def get_all_deforestation_stats():
    return load_stats()

@router.get("/summary/{entity_name}")
def get_deforestation_summary(entity_name: str):
    data = load_stats()
    clean_name = entity_name.strip().lower()

    # Search in states first
    for name, stat in data.get("states", {}).items():
        if name.lower() == clean_name:
            return stat

    # Search in districts
    for name, stat in data.get("districts", {}).items():
        if name.lower() == clean_name:
            return stat

    # Partial match fallback
    for name, stat in data.get("districts", {}).items():
        if clean_name in name.lower() or name.lower() in clean_name:
            return stat

    for name, stat in data.get("states", {}).items():
        if clean_name in name.lower() or name.lower() in clean_name:
            return stat

    # Return default zero fallback if not found
    return {
        "name": entity_name,
        "type": "unknown",
        "area_ha": 0.0,
        "extent_2000_ha": 0.0,
        "cumulative_loss_ha": 0.0,
        "forest_loss_pct": 0.0,
        "annual_loss": {}
    }
