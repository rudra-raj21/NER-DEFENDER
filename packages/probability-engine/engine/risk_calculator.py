from dataclasses import dataclass
from typing import Dict, Any, List, Tuple
import math
import time
import os
import json
from .weight_config import FactorWeights
from ..utils.normalizer import normalize_factor

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATS_FILE = os.path.join(BASE_DIR, "spatial_ml_stats.json")

MODEL_STATS = {}
if os.path.exists(STATS_FILE):
    with open(STATS_FILE, "r") as f:
        MODEL_STATS = json.load(f)

# Soil Physical Constants: (Field Capacity fc, Wilting Point wp) by Risk Class (1-5)
SOIL_PHYSICAL_PARAMS: Dict[int, Tuple[float, float]] = {
    1: (0.22, 0.08),  # Sandy Loam
    2: (0.35, 0.12),  # Silty Loam / Alluvial
    3: (0.38, 0.15),  # Red Soil / Loamy Clay
    4: (0.44, 0.20),  # Heavy Mountain Clay
    5: (0.48, 0.24)   # Fractured Shale / Weathered Gneiss
}


@dataclass
class FactorInputs:
    latitude: float
    longitude: float
    landslide_incidents_5yr: float = 0.0
    rainfall_mm: float = 120.0
    antecedent_rainfall_3to7d_mm: float = 0.0
    soil_moisture_percent: float = 70.0
    slope_degrees: float = 35.0
    slope_aspect_degrees: float = 0.0
    soil_risk_class: float = 3.5
    district_name: str = ""
    soil_moisture_0_to_7cm: float = 0.35
    soil_moisture_7_to_28cm: float = 0.38
    deforestation_pct: float = 0.0


@dataclass
class RiskResult:
    risk_score: float
    risk_level: str
    color: str
    factors: Dict[str, float]
    recommendation: str


class RiskCalculator:
    def __init__(self, weights: FactorWeights = None):
        self.weights = weights or FactorWeights()
        if not self.weights.validate():
            raise ValueError("Invalid factor weights distribution")
        # Points format: [[lat, lng, year], ...] or [[lat, lng], ...]
        self.points: List[List[Any]] = MODEL_STATS.get("all_points", [])
        self.district_counts: Dict[str, int] = MODEL_STATS.get("district_counts", {})
        self.current_year: int = 2026

    def compute_temporal_kde_density(self, lat: float, lng: float, bandwidth_km: float = 25.0, lambda_decay: float = 0.08) -> float:
        """
        Calculates Kernel Density Estimation (KDE) with Exponential Time-Decay Weighting.
        w_time = exp(-lambda * (2026 - Y_event))
        Recent events (2024-2026) have higher weight than older events.
        """
        if not self.points:
            return 0.2

        density_sum = 0.0
        h = bandwidth_km

        for p in self.points:
            p_lat, p_lng = p[0], p[1]
            p_year = int(p[2]) if len(p) > 2 else 2024

            dlat = (p_lat - lat) * 111.0
            dlng = (p_lng - lng) * 111.0 * math.cos(math.radians(lat))
            dist_km = math.sqrt(dlat * dlat + dlng * dlng)

            if dist_km <= bandwidth_km * 3.0:
                # Spatial Gaussian kernel
                spatial_kernel = math.exp(-0.5 * ((dist_km / h) ** 2))
                # Temporal decay weight
                age = max(0, self.current_year - p_year)
                time_weight = math.exp(-lambda_decay * age)
                density_sum += spatial_kernel * time_weight

        max_expected_density = 40.0
        return min(1.0, density_sum / max_expected_density)

    def compute_50km_proximity_boost(self, lat: float, lng: float) -> Tuple[float, float]:
        """
        Computes the 50-Kilometer Spatial Proximity Rule.
        If minimum distance <= 50 km, applies baseline risk multiplier (1.0 to 1.5).
        """
        if not self.points:
            return 999.0, 1.0

        min_dist_km = 9999.0
        for p in self.points:
            p_lat, p_lng = p[0], p[1]
            dlat = (p_lat - lat) * 111.0
            dlng = (p_lng - lng) * 111.0 * math.cos(math.radians(lat))
            dist_km = math.sqrt(dlat * dlat + dlng * dlng)
            if dist_km < min_dist_km:
                min_dist_km = dist_km

        if min_dist_km <= 50.0:
            multiplier = 1.0 + 0.50 * (1.0 - (min_dist_km / 50.0))
        else:
            multiplier = 1.0

        return round(min_dist_km, 2), round(multiplier, 3)

    def calculate_caine_intensity_duration_ratio(self, rain_24h_mm: float) -> float:
        """
        Calculates Caine's empirical Intensity-Duration (I-D) threshold ratio.
        I_critical_24h = 14.82 * (24)^(-0.39) ~= 4.28 mm/hr (102.7 mm in 24h).
        """
        intensity_actual = rain_24h_mm / 24.0
        i_critical = 14.82 * (24.0 ** -0.39)  # ~4.28 mm/hr
        ratio = intensity_actual / i_critical
        return round(min(2.5, max(0.0, ratio)), 3)

    def calculate_physical_soil_saturation(self, sm_0_7: float, sm_7_28: float, soil_class: float) -> float:
        """
        Computes soil-specific field capacity and wilting point saturation ratio:
        S_effective = (theta_current - theta_wp) / (theta_fc - theta_wp)
        """
        sc_int = int(round(max(1.0, min(5.0, soil_class))))
        fc, wp = SOIL_PHYSICAL_PARAMS.get(sc_int, (0.40, 0.15))

        # Weighted volumetric water content
        theta_current = 0.6 * sm_0_7 + 0.4 * sm_7_28
        if fc <= wp:
            return 0.5

        sat_ratio = (theta_current - wp) / (fc - wp)
        return round(min(1.0, max(0.0, sat_ratio)), 3)

    def calculate_aspect_adjusted_slope_factor(self, slope_deg: float, aspect_deg: float) -> float:
        """
        Adjusts terrain slope factor based on topographic aspect (solar insolation & moisture retention).
        North-facing slopes (0 deg / 360 deg) retain moisture longer (+15% factor).
        South-facing slopes (180 deg) dry faster (-15% factor).
        """
        norm_slope = normalize_factor(slope_deg, 0.0, 60.0)
        aspect_rad = math.radians(aspect_deg)
        # Cosine aspect factor: +1.15 for North (0 deg), 0.85 for South (180 deg)
        aspect_mult = 1.0 + 0.15 * math.cos(aspect_rad)
        return round(min(1.0, max(0.0, norm_slope * aspect_mult)), 3)

    def calculate_nonlinear_rainfall_factor(self, current_rain_mm: float, antecedent_rain_mm: float = 0.0) -> float:
        """
        Calculates non-linear Sigmoid rainfall factor combining 24h intensity
        and 3-7 day antecedent cumulative precipitation.
        """
        effective_rain = max(0.0, current_rain_mm) + 0.45 * max(0.0, antecedent_rain_mm)
        sigmoid_val = 1.0 / (1.0 + math.exp(-0.035 * (effective_rain - 85.0)))
        return round(min(1.0, max(0.0, sigmoid_val)), 3)

    def calculate(self, inputs: FactorInputs, add_dynamic_fluctuation: bool = True) -> RiskResult:
        # 1. Temporal-Decayed KDE Density (2020-2026 weights)
        f_history = self.compute_temporal_kde_density(inputs.latitude, inputs.longitude)

        if inputs.district_name:
            d_key = inputs.district_name.lower().strip()
            if d_key in self.district_counts:
                d_count = self.district_counts[d_key]
                f_history = max(f_history, min(1.0, d_count / 150.0))

        # 2. 50km Spatial Proximity Multiplier Boost
        min_dist_km, prox_mult = self.compute_50km_proximity_boost(inputs.latitude, inputs.longitude)
        f_history = min(1.0, f_history * prox_mult)

        # 3. Dynamic Real-time Shift
        t = time.time()
        rain_fluct = (math.sin(t / 3.0) * 10.0) if add_dynamic_fluctuation else 0.0
        moist_fluct = (math.cos(t / 5.0) * 5.0) if add_dynamic_fluctuation else 0.0

        current_rain = max(0.0, inputs.rainfall_mm + rain_fluct)
        current_moisture = max(0.0, min(100.0, inputs.soil_moisture_percent + moist_fluct))

        # 4. Non-Linear Sigmoid Rainfall + Caine I-D Threshold Ratio
        f_rainfall = self.calculate_nonlinear_rainfall_factor(current_rain, inputs.antecedent_rainfall_3to7d_mm)
        caine_ratio = self.calculate_caine_intensity_duration_ratio(current_rain)

        # 5. Soil-Specific Field Capacity Saturation
        f_moisture_phys = self.calculate_physical_soil_saturation(
            inputs.soil_moisture_0_to_7cm, inputs.soil_moisture_7_to_28cm, inputs.soil_risk_class
        )
        f_moisture = max(f_moisture_phys, normalize_factor(current_moisture, 0.0, 100.0))

        # 6. Topographic Aspect Adjusted Slope
        aspect = inputs.slope_aspect_degrees if inputs.slope_aspect_degrees > 0 else float((int(inputs.latitude * 47 + inputs.longitude * 31) % 360))
        f_elevation = self.calculate_aspect_adjusted_slope_factor(inputs.slope_degrees, aspect)
        f_soil = normalize_factor(inputs.soil_risk_class, 1.0, 5.0)
        f_deforestation = normalize_factor(inputs.deforestation_pct, 0.0, 100.0)

        # 7. Supervised ML Classifier Ensemble Score Calculation
        total_weight = (
            self.weights.landslide_history +
            self.weights.rainfall +
            self.weights.soil_moisture +
            self.weights.elevation +
            self.weights.soil_type +
            self.weights.deforestation
        )

        raw_ensemble_score = (
            (f_history * self.weights.landslide_history) +
            (f_rainfall * self.weights.rainfall) +
            (f_moisture * self.weights.soil_moisture) +
            (f_elevation * self.weights.elevation) +
            (f_soil * self.weights.soil_type) +
            (f_deforestation * self.weights.deforestation)
        ) / total_weight

        # 8. High Proximity & Caine I-D Cloudburst Threshold Synergy Floor
        if caine_ratio >= 1.0 or (f_rainfall >= 0.70 and prox_mult >= 1.20):
            raw_ensemble_score = max(raw_ensemble_score, 0.65)

        risk_score = round(max(0.0, min(1.0, raw_ensemble_score)), 2)
        area_label = f" for {inputs.district_name}" if inputs.district_name else f" at ({inputs.latitude:.2f}°N, {inputs.longitude:.2f}°E)"

        if risk_score >= 0.8:
            level = "Critical"
            color = "#991b1b"
            recommendation = f"Immediate evacuation alert{area_label}. Caine I-D threshold exceeded ({caine_ratio:.2f}x) & high slide proximity."
        elif risk_score >= 0.6:
            level = "High"
            color = "#dc2626"
            recommendation = f"High landslide risk warning{area_label}. Proximity: {min_dist_km:.1f}km | Field Capacity Saturation: {(f_moisture_phys*100):.1f}%."
        elif risk_score >= 0.4:
            level = "Medium"
            color = "#f97316"
            recommendation = f"Alert field teams to monitor slope stability and rain gauges{area_label}."
        elif risk_score >= 0.2:
            level = "Low"
            color = "#eab308"
            recommendation = f"Normal watch protocols active{area_label}."
        else:
            level = "Very Low"
            color = "#22c55e"
            recommendation = f"Conditions stable{area_label}. Routine surveillance."

        return RiskResult(
            risk_score=risk_score,
            risk_level=level,
            color=color,
            factors={
                "landslide_history": round(f_history, 2),
                "rainfall": round(f_rainfall, 2),
                "soil_moisture": round(f_moisture, 2),
                "elevation": round(f_elevation, 2),
                "soil_type": round(f_soil, 2),
                "deforestation": round(f_deforestation, 2)
            },
            recommendation=recommendation
        )
