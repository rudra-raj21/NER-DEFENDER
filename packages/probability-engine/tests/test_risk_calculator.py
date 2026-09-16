import pytest
from packages.probability_engine.engine import RiskCalculator, FactorInputs, FactorWeights

def test_weight_validation():
    weights = FactorWeights()
    assert weights.validate() is True

def test_50km_proximity_boost():
    calc = RiskCalculator()
    dist_km, mult = calc.compute_50km_proximity_boost(25.57, 91.88)
    assert dist_km <= 5.0
    assert mult > 1.40

    dist_far, mult_far = calc.compute_50km_proximity_boost(10.0, 75.0)
    assert dist_far > 50.0
    assert mult_far == 1.0

def test_nonlinear_rainfall_sigmoid():
    calc = RiskCalculator()
    f_light = calc.calculate_nonlinear_rainfall_factor(current_rain_mm=10.0, antecedent_rain_mm=0.0)
    f_heavy = calc.calculate_nonlinear_rainfall_factor(current_rain_mm=120.0, antecedent_rain_mm=0.0)
    f_antecedent = calc.calculate_nonlinear_rainfall_factor(current_rain_mm=40.0, antecedent_rain_mm=150.0)

    assert f_light < 0.15
    assert f_heavy > 0.70
    assert f_antecedent > 0.60

def test_caine_id_threshold_ratio():
    calc = RiskCalculator()
    ratio_low = calc.calculate_caine_intensity_duration_ratio(20.0)
    ratio_cloudburst = calc.calculate_caine_intensity_duration_ratio(150.0)

    assert ratio_low < 0.30
    assert ratio_cloudburst >= 1.40

def test_physical_soil_saturation():
    calc = RiskCalculator()
    sat_dry = calc.calculate_physical_soil_saturation(sm_0_7=0.10, sm_7_28=0.12, soil_class=3)
    sat_saturated = calc.calculate_physical_soil_saturation(sm_0_7=0.42, sm_7_28=0.45, soil_class=3)

    assert sat_dry <= 0.10
    assert sat_saturated >= 0.95

def test_aspect_adjusted_slope():
    calc = RiskCalculator()
    f_north = calc.calculate_aspect_adjusted_slope_factor(slope_deg=35.0, aspect_deg=0.0)
    f_south = calc.calculate_aspect_adjusted_slope_factor(slope_deg=35.0, aspect_deg=180.0)

    assert f_north > f_south

def test_temporal_decay_weighting():
    calc = RiskCalculator()
    kde_density = calc.compute_temporal_kde_density(25.57, 91.88)
    assert kde_density > 0.30

def test_deforestation_zero_weight_isolation():
    calc = RiskCalculator()
    base_inputs = FactorInputs(
        latitude=25.57,
        longitude=91.88,
        rainfall_mm=120.0,
        soil_moisture_percent=70.0,
        slope_degrees=35.0,
        soil_risk_class=3.5,
        deforestation_pct=0.0
    )
    res0 = calc.calculate(base_inputs, add_dynamic_fluctuation=False)

    high_deforest_inputs = FactorInputs(
        latitude=25.57,
        longitude=91.88,
        rainfall_mm=120.0,
        soil_moisture_percent=70.0,
        slope_degrees=35.0,
        soil_risk_class=3.5,
        deforestation_pct=95.0
    )
    res100 = calc.calculate(high_deforest_inputs, add_dynamic_fluctuation=False)

    assert res0.risk_score == res100.risk_score
    assert res100.factors["deforestation"] == 0.95

def test_invalid_deforestation_weight():
    bad_weights = FactorWeights(deforestation=0.05, landslide_history=0.25)
    assert bad_weights.validate() is False

def test_risk_calculation_critical():
    calc = RiskCalculator()
    inputs = FactorInputs(
        latitude=25.57,
        longitude=91.88,
        landslide_incidents_5yr=14.0,
        rainfall_mm=220.0,
        soil_moisture_percent=90.0,
        slope_degrees=55.0,
        soil_risk_class=5.0
    )
    res = calc.calculate(inputs, add_dynamic_fluctuation=False)
    assert res.risk_score >= 0.8
    assert res.risk_level == "Critical"
    assert res.color == "#991b1b"

def test_risk_calculation_very_low():
    calc = RiskCalculator()
    inputs = FactorInputs(
        latitude=10.0,
        longitude=75.0,
        landslide_incidents_5yr=0.0,
        rainfall_mm=5.0,
        soil_moisture_percent=10.0,
        slope_degrees=2.0,
        soil_risk_class=1.0
    )
    res = calc.calculate(inputs, add_dynamic_fluctuation=False)
    assert res.risk_score <= 0.2
    assert res.risk_level in ["Very Low", "Low"]
