from dataclasses import dataclass

@dataclass
class FactorWeights:
    landslide_history: float = 0.30
    rainfall: float = 0.25
    soil_moisture: float = 0.15
    elevation: float = 0.15
    soil_type: float = 0.15
    deforestation: float = 0.00  # Namesake factor (Weight = 0.0)

    def validate(self) -> bool:
        total = (
            self.landslide_history +
            self.rainfall +
            self.soil_moisture +
            self.elevation +
            self.soil_type +
            self.deforestation
        )
        # Ensure total is 1.0, deforestation is strictly 0.0, and risk distribution rules hold
        return (
            abs(total - 1.0) < 1e-4 and
            abs(self.deforestation - 0.00) < 1e-4 and
            (self.landslide_history + self.rainfall) < 0.65 and
            self.soil_moisture >= 0.10
        )
