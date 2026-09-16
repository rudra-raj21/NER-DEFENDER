# 🛡️ NER DEFENDER

**NER DEFENDER** is a real-time landslide hazard forecasting and risk assessment system designed specifically for the 8 states of the North Eastern Region (NER) of India: **Arunachal Pradesh, Assam, Manipur, Meghalaya, Mizoram, Nagaland, Sikkim, and Tripura**.

By coupling high-resolution satellite remote sensing inputs, historical disaster records, real-time meteorological models, and geospatial infrastructure data, NER DEFENDER produces dynamically calibrated landslide risk predictions at the district and village level.

The platform brings environmental monitoring, historical landslide information, geospatial infrastructure, emergency alerts, and field-level incident reporting together through a single interactive dashboard.

---

## 🏗️ System Architecture & Data Flow

NER DEFENDER utilizes an event-driven monorepo architecture divided into multi-stage data processing and UI dynamic visualization pipelines:

```text
[ Data Ingestion ] ──────> [ Python Probability Engine ] ──────> [ FastAPI REST Services ] ──────> [ React Web Dashboard ]
 • NetCDF IMD Rain          • Gaussian KDE Historical             • District & Village Risk        • Interactive Leaflet Canvas
 • ISRO Soil Moisture       • Multi-Factor Weighting              • Real-time GeoJSON Feeds        • Glassmorphism HUD
 • Copernicus DEM 30m       • Dynamic Thresholding                • Emergency Alert Dispatch       • Multi-language i18n
````

1. **Data Ingestion & Preprocessing**: Processes meteorological NetCDF grids, satellite raster datasets, and static vector layers into unified spatial grids.
2. **Python Probability Engine**: Computes spatial probability density and dynamic multi-factor risk scores combining landslide history, precipitation, soil saturation, slope steepness, and soil plasticity.
3. **FastAPI Backend Services**: Exposes high-performance asynchronous REST endpoints for spatial queries, risk assessments, and alert payloads.
4. **React Web Dashboard**: Renders full-screen interactive Leaflet visual maps with custom layers, real-time risk gauges, glassmorphism HUD overlays, multi-language internationalization (i18n), and emergency notification triggers.

---

## 🧰 Technology Stack

| Domain              | Technologies / Libraries                                            |
| :------------------ | :------------------------------------------------------------------ |
| **Frontend**        | React 18, Vite, TypeScript, Leaflet, Tailwind CSS, Zustand, i18next |
| **Backend**         | FastAPI, Uvicorn, Python 3.14, Pydantic, Asyncio                    |
| **Data Engine**     | NumPy, SciPy, NetCDF4, GeoPandas, Shapely                           |
| **Build & Tooling** | npm workspaces, Pytest                                              |

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

$$
f_{\text{history}}(x, y) =
\min\left(
1.0,
\frac{1}{M}
\sum_{i=1}^{N}
\exp\left(
-\frac{1}{2}
\left(\frac{d_i}{h}\right)^2
\right)
\right)
$$

Where:

* $d_i$: Euclidean spatial distance between point $(x, y)$ and historical event $p_i$.
* $h$: Bandwidth parameter governing spatial influence radius.
* $M$: Normalization scaling constant.

### 2. Multi-Factor Calibrated Risk Score Weighting

The total dynamic Landslide Risk Index `R(x, y)` is calculated using 5 normalized domain factors:

<div align="center">

<strong>R(x, y) = 0.30 × S<sub>history</sub> + 0.25 × S<sub>rainfall</sub> + 0.15 × S<sub>moisture</sub> + 0.15 × S<sub>slope</sub> + 0.15 × S<sub>soil</sub></strong>

</div>

Where:

* `S_history`: Historical landslide hazard density score.
* `S_rainfall`: Normalized rainfall intensity score.
* `S_moisture`: Normalized soil moisture score.
* `S_slope`: Normalized terrain slope score.
* `S_soil`: Normalized soil susceptibility score.
* The weights sum to `1.00`, producing a normalized risk score in the range `[0,1]`.

### 3. Risk Level Classification

| Risk Level   | Score Range | Description & Response Protocol                                       |
| :----------- | :---------- | :-------------------------------------------------------------------- |
| **Very Low** | $0.0 - 0.2$ | Minimal landslide likelihood under standard conditions.               |
| **Low**      | $0.2 - 0.4$ | Minor localized susceptibility; routine monitoring active.            |
| **Medium**   | $0.4 - 0.6$ | Moderate hazard potential; alert watch emitted for steep corridors.   |
| **High**     | $0.6 - 0.8$ | Severe threat level; infrastructure movement warnings issued.         |
| **Critical** | $0.8 - 1.0$ | Immediate disaster risk; triggers automated emergency alert dispatch. |

> **Note:** Deforestation & Tree Loss (GFW) is displayed as an additional environmental indicator in the dashboard and is not added as a separate weighted factor to the five-factor risk formula above.

---

## 🌐 Regional Language Accessibility

NER DEFENDER is designed for the linguistically diverse North Eastern Region of India.

The dashboard provides a multi-language interface with language options suitable for users across the region.

Supported language options include:

* 🇬🇧 English
* অসমীয়া Assamese
* Khasi
* Mizo
* Bodo
* মেইতেই / Meitei (Manipuri)

The language selector is integrated directly into the dashboard, allowing users to switch the interface language while using the monitoring system.

This improves accessibility for users from different states and communities across North Eastern India.

---

## 🔥 Key System Features & Localhost Links

* 🗺️ **Interactive GeoJSON Map Canvas**: Full-screen spatial dashboard powered by Leaflet (`http://localhost:3000`).
* ⚡ **FastAPI REST API**: High-throughput async geospatial endpoints (`http://localhost:8000`).
* 🌐 **6-Language i18n Switcher**: Built-in support for English, Hindi, Assamese, Bengali, Manipuri, and Mizo.
* 🚨 **Emergency Authority Alert Protocol**: Single-click "SEND ALERT" broadcast trigger connecting local disaster response teams.
* 🎯 **Real-Time Risk HUD**: Displays current risk status and important environmental indicators.
* 🌧️ **Weather Monitoring**: Displays rainfall and weather-related information relevant to landslide risk assessment.
* 🛣️ **Highway Visualization**: Displays highways and transportation corridors on the interactive map.
* 🏘️ **Settlement Mapping**: Displays settlement locations in relation to hazard-prone areas.
* ⚠️ **Hazard Zone Visualization**: Displays mapped hazard zones on the interactive map.
* 📍 **NESAC Historical Events**: Displays historical landslide events directly on the map.
* 📡 **NDMA Live CAP Alerts**: Displays available NDMA Common Alerting Protocol alerts spatially.
* 🌳 **Deforestation & Tree Loss (GFW)**: Provides additional tree-loss information as an environmental indicator.
* 📊 **Probability Engine Weights**: Displays the contribution of the core weighted risk factors.
* 📢 **Crowdsourced Hazard Reporting**: Allows users to report newly observed landslides and road hazards.
* 📸 **Geo-Tagged Photo / Media Upload**: Allows field users to attach supporting media to incident reports.
* 📝 **Field Notes**: Allows users to provide descriptions and observations about reported incidents.
* 🚦 **Observed Severity**: Allows users to specify the observed severity of a reported hazard.

---

## 🗺️ Interactive Map Layer Control

NER DEFENDER provides an interactive map layer control that allows users to toggle different spatial datasets directly from the dashboard.

Available map layers include:

| Layer                    | Description                                                |
| :----------------------- | :--------------------------------------------------------- |
| **NER States**           | Displays the boundaries of the eight North Eastern states. |
| **Districts**            | Displays district-level administrative boundaries.         |
| **Highways**             | Displays highway and road networks.                        |
| **Settlements**          | Displays settlement locations.                             |
| **Hazard Zones**         | Displays mapped hazard-prone areas.                        |
| **NESAC Events**         | Displays historical landslide events.                      |
| **NDMA Live CAP Alerts** | Displays available emergency alert information.            |

The layer controls allow users to customize the map and examine different relationships between environmental hazards, infrastructure, settlements, historical events, and administrative boundaries.

---

## 🎯 Real-Time Risk HUD

The Risk HUD provides a centralized view of important risk-related information for the monitored area.

It can display:

* Current risk status
* Recent rainfall
* Antecedent rainfall
* Soil moisture conditions
* Environmental indicators
* GFW tree-loss information
* Risk factor contributions
* High-risk warnings

This provides users with a quick overview of the conditions contributing to the current risk assessment.

---

## 🌧️ Weather & Environmental Monitoring

Rainfall and soil moisture are important environmental factors in landslide assessment.

NER DEFENDER incorporates meteorological and satellite-derived information into its monitoring workflow.

The dashboard can provide information related to:

* Recent rainfall
* Antecedent rainfall
* Rainfall intensity
* Soil moisture saturation
* Terrain conditions
* Deforestation & Tree Loss (GFW)

These indicators are considered alongside historical landslide information, terrain characteristics, and soil properties.

---

## 🌳 Deforestation & Tree Loss (GFW)

NER DEFENDER includes **Deforestation & Tree Loss (GFW)** as an additional environmental indicator.

Tree-loss information provides additional land-cover context when examining potentially vulnerable locations.

It is displayed separately in the dashboard and does not change the existing five-factor mathematical risk formula.

The existing risk formula remains:

\(R(x, y) = 0.30 \cdot S_{\text{history}} + 0.25 \cdot S_{\text{rainfall}} + 0.15 \cdot S_{\text{moisture}} + 0.15 \cdot S_{\text{slope}} + 0.15 \cdot S_{\text{soil}}\)

---

## 🚨 Alert & Emergency Monitoring

NER DEFENDER provides an alert-oriented interface for monitoring significant hazard conditions.

### Risk Alerts

High-risk conditions can be highlighted through the Risk HUD and dashboard alert interface.

### Emergency Authority Alert Protocol

The dashboard provides a **SEND ALERT** workflow for initiating an emergency notification process.

### NDMA Live CAP Alerts

The dashboard also provides a dedicated map layer for available **NDMA Common Alerting Protocol (CAP)** alerts.

These alerts can be viewed together with:

* Hazard zones
* Highways
* Settlements
* District boundaries
* Historical landslide events
* Current risk information

---

## 📢 Crowdsourced Landslide & Road Hazard Reporting

NER DEFENDER includes a crowdsourced incident reporting workflow that allows field users to submit observations of newly identified landslides and road hazards.

The reporting interface includes:

### Reporter Name / Agency

Identifies the individual, organization, or agency submitting the report.

### Incident Location

Allows the location of the observed hazard to be specified.

### Observed Severity

Allows the reporter to select the observed severity of the incident.

### Hazard Description & Field Notes

Users can provide details about the observed incident, including:

* Landslide or slope movement
* Road blockage
* Slump observations
* Rainfall conditions
* Other relevant field observations

### Geo-Tagged Photo / Media

Users can attach geo-tagged JPG/PNG photos or supported media as field evidence.

### Submit Crowdsourced Incident Report

After entering the relevant information, users can submit the incident report through the dashboard.

This creates an additional field-information channel that complements the existing environmental, historical, and geospatial datasets.

---

## 📸 Geo-Tagged Field Evidence

The hazard-reporting system supports the submission of field media along with incident information.

Geo-tagged photographs can provide visual evidence of:

* Landslides
* Road blockages
* Slumps
* Slope movement
* Other observed hazards

This allows field observations to be documented alongside the incident location and description.

---

## 📝 Field Incident Information

Each crowdsourced report can contain important contextual information such as:

* Reporter or agency
* Incident location
* Observed severity
* Hazard description
* Field notes
* Supporting photographs or media

This information can provide additional context for incidents that may not yet appear in historical datasets.

---

## 🔄 End-to-End Monitoring Workflow

```text
        Historical Landslide Data
                  +
          Rainfall Data
                  +
         Soil Moisture Data
                  +
       Terrain / Elevation Data
                  +
        Geological Soil Data
                  +
       GIS Infrastructure Data
                  ↓
        ┌─────────────────────┐
        │ Data Preprocessing  │
        └──────────┬──────────┘
                   ↓
        ┌─────────────────────┐
        │ Probability Engine  │
        └──────────┬──────────┘
                   ↓
        ┌─────────────────────┐
        │ Risk Score & Levels │
        └──────────┬──────────┘
                   ↓
        ┌─────────────────────┐
        │ Interactive Map HUD │
        └──────────┬──────────┘
                   ↓
       ┌───────────┼────────────┐
       ↓           ↓            ↓
    Weather     Highways      Alerts
       ↓           ↓            ↓
       └───────────┼────────────┘
                   ↓
       Crowdsourced Field Reports
                   ↓
          Geo-Tagged Media
                   ↓
          Field Information
```

---

## 👥 Intended Users

NER DEFENDER can support different groups involved in landslide monitoring and emergency response:

| User Group                                  | Possible Use                                               |
| :------------------------------------------ | :--------------------------------------------------------- |
| 🏛️ **Disaster Management Authorities**     | Monitor regional hazard conditions and available alerts.   |
| 🚧 **Highway / Infrastructure Authorities** | View transportation corridors in relation to hazard areas. |
| 🚨 **Emergency Response Teams**             | Access risk information and reported incidents.            |
| 🛰️ **GIS & Monitoring Teams**              | Analyze spatial layers and historical events.              |
| 👷 **Field Officers / Agencies**            | Submit field observations and hazard reports.              |
| 👥 **Local Volunteers / Communities**       | Report observed landslides and road hazards.               |

---

## 🔗 Integrated Monitoring Capabilities

NER DEFENDER brings multiple types of information into one interactive geospatial dashboard:

```text
Historical Landslide Events
          +
Rainfall & Weather
          +
Soil Moisture
          +
Terrain & Elevation
          +
Geological Soil Information
          +
Highways & Settlements
          +
Hazard Zones
          +
Emergency Alerts
          +
NDMA CAP Alerts
          +
Crowdsourced Field Reports
          +
Geo-Tagged Media
          ↓
Unified Landslide Risk Monitoring Interface
```

---

## 🌟 What Makes NER DEFENDER Different?

NER DEFENDER combines multiple landslide-monitoring capabilities into a single geospatial platform.

The system brings together:

* 📍 Historical landslide events
* 🌧️ Rainfall and weather information
* 💧 Soil moisture conditions
* 🏔️ Terrain and elevation information
* 🪨 Geological soil information
* 🌳 Deforestation & Tree Loss (GFW)
* 🛣️ Highway visualization
* 🏘️ Settlement mapping
* ⚠️ Hazard zones
* 📡 NDMA CAP alerts
* 🚨 Emergency alert workflow
* 📢 Crowdsourced hazard reporting
* 📸 Geo-tagged field media
* 🌐 Regional language accessibility

Rather than presenting these datasets through separate interfaces, NER DEFENDER provides a unified map-based environment where users can examine risk, infrastructure, environmental conditions, alerts, and field reports together.

---

## 🌐 Multi-Language Interface for North Eastern India

The North Eastern Region contains communities with diverse linguistic backgrounds.

NER DEFENDER therefore provides a multi-language interface to improve accessibility across the region.

The dashboard includes language options covering:

* English
* Assamese
* Khasi
* Mizo
* Bodo
* Meitei / Manipuri

The language selector is available directly within the application interface.

---

## 📌 Project Scope

NER DEFENDER focuses on the eight states of the North Eastern Region:

| State             |     |
| :---------------- | :-- |
| Arunachal Pradesh | 🏔️ |
| Assam             | 🌧️ |
| Manipur           | ⛰️  |
| Meghalaya         | 🌿  |
| Mizoram           | 🏞️ |
| Nagaland          | 🌄  |
| Sikkim            | 🏔️ |
| Tripura           | 🌳  |

The platform uses spatial information at district and village levels where corresponding data is available.

---

## 🚀 Getting Started

### Prerequisites

* Node.js >= 18
* Python >= 3.10

### Clone the Repository

```bash
git clone https://github.com/your-username/NER-DEFENDER.git
cd NER-DEFENDER
```

### Install Frontend Dependencies

```bash
npm install
```

### Install Backend Dependencies

```bash
pip install -r requirements.txt
```

### Start the Backend

```bash
uvicorn main:app --reload --port 8000
```

### Start the Frontend

```bash
npm run dev
```

The frontend and backend will run on their respective local development ports configured in the project.

---

## 🌐 Live Demo

**NER DEFENDER:**
[https://nerdefender.vercel.app/](https://nerdefender.vercel.app/)

---

## 📁 Project Structure

```text
NER-DEFENDER/
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   └── ...
│
├── backend/
│   ├── main.py
│   ├── services/
│   └── ...
│
├── data/
│   ├── historical/
│   ├── rainfall/
│   ├── soil/
│   └── geospatial/
│
├── requirements.txt
├── package.json
└── README.md
```

---

## 🔮 Future Scope

Potential future improvements include:

* Higher-resolution satellite imagery integration
* More frequent real-time rainfall updates
* Additional machine-learning approaches for landslide risk modelling
* Mobile application for field responders
* Automated SMS and emergency notification integration
* Integration with additional disaster-management systems
* More detailed road-level risk analysis
* Historical risk trend visualization
* Improved crowdsourced incident verification
* Expanded regional language support
* Additional environmental indicators

---

## 🛡️ Project Vision

NER DEFENDER aims to provide a unified digital platform for landslide-risk monitoring across the North Eastern Region of India.

By combining historical disaster information, environmental indicators, geospatial infrastructure, weather information, emergency alerts, and crowdsourced field reports, the system provides a centralized interface for monitoring potentially hazardous areas and supporting disaster-response workflows.

---

# 🛡️ NER DEFENDER

### *Monitor. Assess. Alert. Report.*

**AI-Powered Landslide Risk Monitoring for North Eastern India**

```
```
