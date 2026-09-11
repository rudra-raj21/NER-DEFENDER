export type RiskLevel = 'Very Low' | 'Low' | 'Medium' | 'High' | 'Critical';

export interface FactorBreakdown {
  landslide_history: number; // 0.30 weight
  rainfall: number;          // 0.25 weight
  soil_moisture: number;     // 0.15 weight
  elevation: number;         // 0.15 weight
  soil_type: number;         // 0.15 weight
}

export interface RiskScoreResponse {
  area_name: string;
  risk_score: number; // 0.0 to 1.0
  risk_level: RiskLevel;
  color: string; // hex or CSS color
  factors: FactorBreakdown;
  recommendation: string;
  timestamp: string;
}

export interface WeatherData {
  location: string;
  latitude: number;
  longitude: number;
  temp_c: number;
  humidity_percent: number;
  rainfall_24h_mm: number;
  rainfall_72h_mm: number;
  wind_speed_kmh: number;
  condition: string;
}

export interface IncidentReport {
  id: string;
  reporter_name: string;
  location_name: string;
  latitude: number;
  longitude: number;
  severity: RiskLevel;
  description: string;
  timestamp: string;
  status: 'verified' | 'pending' | 'rejected';
}

export interface AlertRequest {
  area_name: string;
  district?: string;
  state?: string;
  risk_level?: RiskLevel;
  custom_message?: string;
}

export interface AlertResponse {
  success: boolean;
  message: string;
  timestamp: string;
  area_name: string;
}
