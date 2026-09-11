import pytest
from packages.probability_engine.engine import RiskCalculator, FactorInputs, FactorWeights

def test_weight_validation():
    weights = FactorWeights()
    assert weights.validate() is True

def test_risk_calculation_critical():
    calc = RiskCalculator()
    inputs = FactorInputs(
        landslide_incidents_5yr=14.0,
        rainfall_mm=220.0,
        soil_moisture_percent=90.0,
        slope_degrees=55.0,
        soil_risk_class=5.0
    )
    res = calc.calculate(inputs)
    assert res.risk_score >= 0.8
    assert res.risk_level == "Critical"
    assert res.color == "#991b1b"

def test_risk_calculation_very_low():
    calc = RiskCalculator()
    inputs = FactorInputs(
        landslide_incidents_5yr=0.0,
        rainfall_mm=5.0,
        soil_moisture_percent=10.0,
        slope_degrees=2.0,
        soil_risk_class=1.0
    )
    res = calc.calculate(inputs)
    assert res.risk_score <= 0.2
    assert res.risk_level == "Very Low"
    assert res.color == "#22c55e"
