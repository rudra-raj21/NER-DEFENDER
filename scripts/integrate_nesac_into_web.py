import csv
import json
import os

csv_file = "data/extracted/ner_landslide_history.csv"
web_json_file = "apps/web/src/data/nesac_landslides.json"
data_geojson_file = "data/geojson/nesac_landslides.geojson"

features = []

with open(csv_file, "r", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for r in reader:
        try:
            lat = float(r["latitude"])
            lng = float(r["longitude"])
            if lat == 0.0 or lng == 0.0:
                continue
            
            features.append({
                "type": "Feature",
                "properties": {
                    "event_name": r["event_name"],
                    "date": r["date"],
                    "time": r["time"],
                    "state": r["state"],
                    "district": r["district"],
                    "source": "NESAC/NERDRR"
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [lng, lat]
                }
            })
        except ValueError:
            continue

geojson_payload = {
    "type": "FeatureCollection",
    "metadata": {
        "title": "NESAC Historical Landslides (2020-2026)",
        "count": len(features)
    },
    "features": features
}

os.makedirs(os.path.dirname(web_json_file), exist_ok=True)
with open(web_json_file, "w", encoding="utf-8") as f:
    json.dump(geojson_payload, f, indent=2)

with open(data_geojson_file, "w", encoding="utf-8") as f:
    json.dump(geojson_payload, f, indent=2)

print(f"Successfully integrated {len(features)} real NESAC landslide points into web app datasets.")
