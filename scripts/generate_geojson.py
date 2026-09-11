import json
import os

os.makedirs("data/geojson", exist_ok=True)
os.makedirs("apps/web/src/data", exist_ok=True)

# 8 NER States coordinates approximated realistic boundary polygons
states_data = [
    {
        "id": "AS",
        "name": "Assam",
        "capital": "Dispur",
        "risk_level": "Medium",
        "risk_score": 0.52,
        "center": [26.2006, 92.9376],
        "coords": [
            [[89.7, 26.5], [90.5, 27.0], [92.0, 27.0], [93.5, 27.2], [95.5, 27.8], [96.0, 27.3], [95.0, 26.5], [93.8, 25.5], [92.5, 24.8], [90.0, 25.5], [89.7, 26.5]]
        ]
    },
    {
        "id": "AR",
        "name": "Arunachal Pradesh",
        "capital": "Itanagar",
        "risk_level": "High",
        "risk_score": 0.74,
        "center": [28.2180, 94.7278],
        "coords": [
            [[91.5, 27.3], [92.0, 28.0], [94.0, 29.0], [96.5, 28.5], [97.3, 28.0], [96.2, 27.2], [95.5, 27.8], [93.5, 27.2], [91.5, 27.3]]
        ]
    },
    {
        "id": "ML",
        "name": "Meghalaya",
        "capital": "Shillong",
        "risk_level": "Critical",
        "risk_score": 0.86,
        "center": [25.4670, 91.3662],
        "coords": [
            [[89.8, 25.2], [90.5, 25.9], [92.5, 25.8], [92.8, 25.1], [91.0, 25.1], [89.8, 25.2]]
        ]
    },
    {
        "id": "MN",
        "name": "Manipur",
        "capital": "Imphal",
        "risk_level": "High",
        "risk_score": 0.68,
        "center": [24.6637, 93.9063],
        "coords": [
            [[93.0, 24.0], [93.2, 25.7], [94.7, 25.7], [94.5, 24.2], [93.8, 23.8], [93.0, 24.0]]
        ]
    },
    {
        "id": "MZ",
        "name": "Mizoram",
        "capital": "Aizawl",
        "risk_level": "High",
        "risk_score": 0.71,
        "center": [23.1645, 92.9376],
        "coords": [
            [[92.3, 21.9], [92.2, 24.5], [93.4, 24.3], [93.2, 22.2], [92.3, 21.9]]
        ]
    },
    {
        "id": "NL",
        "name": "Nagaland",
        "capital": "Kohima",
        "risk_level": "Critical",
        "risk_score": 0.81,
        "center": [26.1584, 94.5624],
        "coords": [
            [[93.3, 25.6], [94.0, 27.0], [95.2, 27.0], [94.8, 25.6], [93.3, 25.6]]
        ]
    },
    {
        "id": "TR",
        "name": "Tripura",
        "capital": "Agartala",
        "risk_level": "Low",
        "risk_score": 0.35,
        "center": [23.9408, 91.9882],
        "coords": [
            [[91.1, 23.0], [91.2, 24.5], [92.3, 24.4], [92.2, 23.0], [91.1, 23.0]]
        ]
    },
    {
        "id": "SK",
        "name": "Sikkim",
        "capital": "Gangtok",
        "risk_level": "Critical",
        "risk_score": 0.89,
        "center": [27.5330, 88.5122],
        "coords": [
            [[88.0, 27.1], [88.1, 28.1], [88.9, 28.1], [88.8, 27.1], [88.0, 27.1]]
        ]
    }
]

ner_states_geojson = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {
                "id": s["id"],
                "name": s["name"],
                "capital": s["capital"],
                "risk_level": s["risk_level"],
                "risk_score": s["risk_score"],
                "center": s["center"]
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": s["coords"]
            }
        }
        for s in states_data
    ]
}

districts_data = [
    {"name": "East Khasi Hills", "state": "Meghalaya", "risk_score": 0.88, "risk_level": "Critical", "coords": [[[91.5, 25.2], [91.5, 25.7], [92.1, 25.7], [92.1, 25.2], [91.5, 25.2]]]},
    {"name": "Dima Hasao", "state": "Assam", "risk_score": 0.82, "risk_level": "Critical", "coords": [[[92.6, 24.9], [92.6, 25.5], [93.3, 25.5], [93.3, 24.9], [92.6, 24.9]]]},
    {"name": "East Sikkim", "state": "Sikkim", "risk_score": 0.91, "risk_level": "Critical", "coords": [[[88.4, 27.1], [88.4, 27.5], [88.8, 27.5], [88.8, 27.1], [88.4, 27.1]]]},
    {"name": "Kohima District", "state": "Nagaland", "risk_score": 0.79, "risk_level": "High", "coords": [[[93.8, 25.5], [93.8, 26.0], [94.4, 26.0], [94.4, 25.5], [93.8, 25.5]]]},
    {"name": "Papum Pare", "state": "Arunachal Pradesh", "risk_score": 0.73, "risk_level": "High", "coords": [[[93.1, 26.9], [93.1, 27.5], [93.8, 27.5], [93.8, 26.9], [93.1, 26.9]]]},
    {"name": "Aizawl District", "state": "Mizoram", "risk_score": 0.75, "risk_level": "High", "coords": [[[92.5, 23.5], [92.5, 24.0], [93.0, 24.0], [93.0, 23.5], [92.5, 23.5]]]},
    {"name": "Imphal East", "state": "Manipur", "risk_score": 0.65, "risk_level": "High", "coords": [[[93.8, 24.6], [93.8, 25.1], [94.2, 25.1], [94.2, 24.6], [93.8, 24.6]]]},
    {"name": "West Tripura", "state": "Tripura", "risk_score": 0.32, "risk_level": "Low", "coords": [[[91.2, 23.7], [91.2, 24.1], [91.6, 24.1], [91.6, 23.7], [91.2, 23.7]]]}
]

ner_districts_geojson = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {
                "name": d["name"],
                "state": d["state"],
                "risk_score": d["risk_score"],
                "risk_level": d["risk_level"]
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": d["coords"]
            }
        }
        for d in districts_data
    ]
}

roads_data = [
    {"name": "NH-27 (Guwahati - Lumding - Silchar)", "type": "National Highway", "coords": [[91.75, 26.18], [92.90, 25.75], [92.80, 24.82]]},
    {"name": "NH-10 (Siliguri - Gangtok Corridor)", "type": "Strategic Route", "coords": [[88.43, 26.72], [88.58, 27.08], [88.61, 27.33]]},
    {"name": "NH-6 (Shillong - Silchar Highway)", "type": "High Risk Corridor", "coords": [[91.88, 25.57], [92.20, 25.35], [92.70, 25.15], [92.80, 24.82]]},
    {"name": "NH-2 (Kohima - Imphal Road)", "type": "Mountain Highway", "coords": [[94.11, 25.67], [93.93, 24.81]]},
    {"name": "NH-415 (Itanagar Connecting Highway)", "type": "Hill Route", "coords": [[93.62, 27.10], [93.80, 27.20]]}
]

ner_roads_geojson = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {
                "name": r["name"],
                "classification": r["type"]
            },
            "geometry": {
                "type": "LineString",
                "coordinates": r["coords"]
            }
        }
        for r in roads_data
    ]
}

villages_data = [
    {"name": "Cherrapunji (Sohra)", "state": "Meghalaya", "coords": [91.7324, 25.2702], "population": 14829, "risk": "Critical"},
    {"name": "Mawlynnong", "state": "Meghalaya", "coords": [91.9161, 25.2014], "population": 950, "risk": "High"},
    {"name": "Haflong", "state": "Assam", "coords": [93.0169, 25.1667], "population": 43756, "risk": "Critical"},
    {"name": "Singtam", "state": "Sikkim", "coords": [88.5000, 27.1500], "population": 5868, "risk": "Critical"},
    {"name": "Chungthang", "state": "Sikkim", "coords": [88.6167, 27.6000], "population": 3964, "risk": "Critical"},
    {"name": "Tawang", "state": "Arunachal Pradesh", "coords": [91.8667, 27.5833], "population": 11263, "risk": "High"},
    {"name": "Lunglei", "state": "Mizoram", "coords": [92.7333, 22.8833], "population": 57011, "risk": "High"},
    {"name": "Mokokchung", "state": "Nagaland", "coords": [94.5333, 26.3167], "population": 35913, "risk": "High"}
]

ner_villages_geojson = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {
                "name": v["name"],
                "state": v["state"],
                "population": v["population"],
                "risk": v["risk"]
            },
            "geometry": {
                "type": "Point",
                "coordinates": v["coords"]
            }
        }
        for v in villages_data
    ]
}

hazard_zones_data = [
    {"name": "Sonapur Active Slide Area", "state": "Meghalaya", "severity": "Critical", "score": 0.94, "coords": [[[92.20, 25.10], [92.26, 25.10], [92.26, 25.16], [92.20, 25.16], [92.20, 25.10]]]},
    {"name": "NH-10 Teesta River Basin Slide", "state": "Sikkim", "severity": "Critical", "score": 0.92, "coords": [[[88.48, 27.10], [88.55, 27.10], [88.55, 27.18], [88.48, 27.18], [88.48, 27.10]]]},
    {"name": "Jatinga Slope Instability Zone", "state": "Assam", "severity": "High", "score": 0.85, "coords": [[[93.00, 25.10], [93.08, 25.10], [93.08, 25.18], [93.00, 25.18], [93.00, 25.10]]]},
    {"name": "Kohima Ridge Creep Zone", "state": "Nagaland", "severity": "High", "score": 0.83, "coords": [[[94.08, 25.64], [94.15, 25.64], [94.15, 25.70], [94.08, 25.70], [94.08, 25.64]]]},
    {"name": "Hunli-Anini Corridor", "state": "Arunachal Pradesh", "severity": "Critical", "score": 0.88, "coords": [[[95.80, 28.20], [95.95, 28.20], [95.95, 28.35], [95.80, 28.35], [95.80, 28.20]]]}
]

hazard_zones_geojson = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {
                "name": h["name"],
                "state": h["state"],
                "severity": h["severity"],
                "risk_score": h["score"]
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": h["coords"]
            }
        }
        for h in hazard_zones_data
    ]
}

files = {
    "ner_states": ner_states_geojson,
    "ner_districts": ner_districts_geojson,
    "ner_roads": ner_roads_geojson,
    "ner_villages": ner_villages_geojson,
    "hazard_zones": hazard_zones_geojson,
}

for name, content in files.items():
    with open(f"data/geojson/{name}.geojson", "w") as f:
        json.dump(content, f, indent=2)
    with open(f"apps/web/src/data/{name}.json", "w") as f:
        json.dump(content, f, indent=2)

print("GeoJSON & JSON files regenerated successfully.")
