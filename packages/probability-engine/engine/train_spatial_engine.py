import csv
import math
import os
import json

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(BASE_DIR, "..", "..", ".."))

HISTORY_CSV = os.path.join(PROJECT_ROOT, "data", "extracted", "ner_landslide_history.csv")
RAINFALL_CSV = os.path.join(PROJECT_ROOT, "data", "raw", "rainfall_data.csv")
MOISTURE_CSV = os.path.join(PROJECT_ROOT, "data", "raw", "soil_moisture.csv")
ELEVATION_CSV = os.path.join(PROJECT_ROOT, "data", "raw", "elevation", "ner_elevation_slopes.csv")
SOIL_CSV = os.path.join(PROJECT_ROOT, "data", "raw", "soil_types", "ner_soil_composition.csv")

MODEL_OUTPUT_PATH = os.path.join(BASE_DIR, "spatial_ml_stats.json")

print("[+] Building Spatial Probability Engine from extracted NESAC & Open Datasets...")

events = []
district_counts = {}

with open(HISTORY_CSV, "r", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for r in reader:
        try:
            lat = float(r["latitude"])
            lng = float(r["longitude"])
            if lat == 0.0 or lng == 0.0:
                continue
            events.append([lat, lng])
            dist = r.get("district", "").strip().lower()
            if dist:
                district_counts[dist] = district_counts.get(dist, 0) + 1
        except ValueError:
            continue

# Compute environmental averages from downloaded raw datasets
rain_vals = []
if os.path.exists(RAINFALL_CSV):
    with open(RAINFALL_CSV, "r", encoding="utf-8") as f:
        for r in csv.DictReader(f):
            if r.get("rainfall_mm"):
                rain_vals.append(float(r["rainfall_mm"]))

moist_vals = []
if os.path.exists(MOISTURE_CSV):
    with open(MOISTURE_CSV, "r", encoding="utf-8") as f:
        for r in csv.DictReader(f):
            if r.get("soil_moisture_percent"):
                moist_vals.append(float(r["soil_moisture_percent"]))

slope_vals = []
if os.path.exists(ELEVATION_CSV):
    with open(ELEVATION_CSV, "r", encoding="utf-8") as f:
        for r in csv.DictReader(f):
            if r.get("slope_degrees"):
                slope_vals.append(float(r["slope_degrees"]))

stats_payload = {
    "total_historical_events": len(events),
    "district_counts": district_counts,
    "mean_rain": sum(rain_vals) / len(rain_vals) if rain_vals else 85.0,
    "max_rain": max(rain_vals) if rain_vals else 250.0,
    "mean_moist": sum(moist_vals) / len(moist_vals) if moist_vals else 65.0,
    "mean_slope": sum(slope_vals) / len(slope_vals) if slope_vals else 35.0,
    "all_points": events
}

with open(MODEL_OUTPUT_PATH, "w") as f:
    json.dump(stats_payload, f, indent=2)

print(f"[✓] Spatial ML Engine statistics compiled on {len(events)} real NESAC events. Saved to {MODEL_OUTPUT_PATH}")
