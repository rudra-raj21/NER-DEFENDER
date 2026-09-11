# 🛡️ NER DEFENDER

**NER DEFENDER** is a real-time landslide hazard forecasting and risk assessment system designed specifically for the 8 states of the North Eastern Region (NER) of India: **Arunachal Pradesh, Assam, Manipur, Meghalaya, Mizoram, Nagaland, Sikkim, and Tripura**. 

By coupling high-resolution satellite remote sensing inputs, historical disaster records, real-time meteorological models, and geospatial infrastructure data, NER DEFENDER produces dynamically calibrated landslide risk predictions at the district and village level.

---

## 🏗️ System Architecture & Data Flow

NER DEFENDER utilizes an event-driven monorepo architecture divided into multi-stage data processing and UI dynamic visualization pipelines:

```
[ Data Ingestion ] ──────> [ Python Probability Engine ] ──────> [ FastAPI REST Services ] ──────> [ React Web Dashboard ]
 • NetCDF IMD Rain          • Gaussian KDE Historical             • District & Village Risk        • Interactive Leaflet Canvas
 • ISRO Soil Moisture       • Multi-Factor Weighting              • Real-time GeoJSON Feeds        • Glassmorphism HUD
 • Copernicus DEM 30m       • Dynamic Thresholding                • Emergency Alert Dispatch       • Multi-language i18n
```

1. **Data Ingestion & Preprocessing**: Processes meteorological NetCDF grids, satellite raster datasets, and static vector layers into unified spatial grids.
2. **Python Probability Engine**: Computes spatial probability density and dynamic multi-factor risk scores combining landslide history, precipitation, soil saturation, slope steepness, and soil plasticity.
3. **FastAPI Backend Services**: Exposes high-performance asynchronous REST endpoints for spatial queries, risk assessments, and alert payloads.
4. **React Web Dashboard**: Renders full-screen interactive Leaflet visual maps with custom layers, real-time risk gauges, glassmorphism HUD overlays, multi-language internationalization (i18n), and emergency notification triggers.

---

## 🧰 Technology Stack

| Domain | Technologies / Libraries |
| :--- | :--- |
| **Frontend** | React 18, Vite, TypeScript, Leaflet, Tailwind CSS, Zustand, i18next |
| **Backend** | FastAPI, Uvicorn, Python 3.14, Pydantic, Asyncio |
| **Data Engine** | NumPy, SciPy, NetCDF4, GeoPandas, Shapely |
| **Build & Tooling** | npm workspaces, Pytest |

---

## 📊 Sourced Datasets

NER DEFENDER integrates 6 core spatial and non-spatial data sources:

1. **NESAC / NERDRR Historical Landslides**: 1,365 verified historic landslide occurrences across the 8 NER states spanning 2020–2026.
2. **IMD 2025 Gridded Daily Rainfall**: High-resolution daily precipitation matrices derived from India Meteorological Department NetCDF datasets (`Rainfalldata2025.nc`).
3. **ISRO MOSDAC Soil Moisture Saturation**: Satellite-derived volumetric moisture content monitoring antecedent wetness.
4. **Copernicus DEM 30m / Open-Elevation**: High-precision Digital Elevation Model (DEM) utilized for terrain slope steepness calculation ($0^\circ - 90^\circ$).
5. **ISRIC SoilGrids & NESAC `NER_Soil_250K`**: Soil classification taxonomy and Plasticity Index mapping for structural soil stability analysis.
6. **GIS Infrastructure Vectors**: Custom administrative boundary GeoJSON datasets covering 8 states (`ner_states.json`), districts (`ner_districts.json`), highway networks (`ner_roads.json`), settlement locations (`ner_villages.json`), and spatial hazard zones (`hazard_zones.json`).

---

## 📐 Core Algorithms & Mathematical Formulations

### 1. Historical Hazard Density via Spatial Gaussian Kernel Density Estimation (KDE)
The spatial historical risk contribution $f_{\text{history}}(x, y)$ at spatial coordinate $(x, y)$ is calculated using a Gaussian KDE over historical incident points $p_i$:

$$f_{\text{history}}(x, y) = \min\left(1.0, \frac{1}{M} \sum_{i=1}^N \exp\left(-\frac{1}{2} \left(\frac{d_i}{h}\right)^2\right)\right)$$

Where:
- $d_i$: Euclidean spatial distance between point $(x, y)$ and historical event $p_i$.
- $h$: Bandwidth parameter governing spatial influence radius.
- $M$: Normalization scaling constant.

### 2. Multi-Factor Calibrated Risk Score Weighting
The total dynamic Landslide Risk Index $R(x, y) \in [0.0, 1.0]$ is computed via a weighted linear combination of 5 normalized domain factors:

$$R(x, y) = 0.30 \cdot S_{\text{history}} + 0.25 \cdot S_{\text{rainfall}} + 0.15 \cdot S_{\text{moisture}} + 0.15 \cdot S_{\text{slope}} + 0.15 \cdot S_{\text{soil}}$$

### 3. Risk Level Classification

| Risk Level | Score Range | Description & Response Protocol |
| :--- | :--- | :--- |
| **Very Low** | $0.0 - 0.2$ | Minimal landslide likelihood under standard conditions. |
| **Low** | $0.2 - 0.4$ | Minor localized susceptibility; routine monitoring active. |
| **Medium** | $0.4 - 0.6$ | Moderate hazard potential; alert watch emitted for steep corridors. |
| **High** | $0.6 - 0.8$ | Severe threat level; infrastructure movement warnings issued. |
| **Critical** | $0.8 - 1.0$ | Immediate disaster risk; triggers automated emergency alert dispatch. |

---

## 🔥 Key System Features & Localhost Links

- 🗺️ **Interactive GeoJSON Map Canvas**: Full-screen spatial dashboard powered by Leaflet (`http://localhost:3000`).
- ⚡ **FastAPI REST API**: High-throughput async geospatial endpoints (`http://localhost:8000`).
- 🌐 **6-Language i18n Switcher**: Built-in support for English, Hindi, Assamese, Bengali, Manipuri, and Mizo.
- 🚨 **Emergency Authority Alert Protocol**: Single-click "SEND ALERT" broadcast trigger connecting local disaster response teams.

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- Python >= 3.10
