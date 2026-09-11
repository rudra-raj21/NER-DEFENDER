import { create } from 'zustand';

export interface FactorBreakdown {
  landslide_history: number;
  rainfall: number;
  soil_moisture: number;
  elevation: number;
  soil_type: number;
}

export interface RiskData {
  area_name: string;
  risk_score: number;
  risk_level: 'Very Low' | 'Low' | 'Medium' | 'High' | 'Critical';
  color: string;
  factors: FactorBreakdown;
  recommendation: string;
  timestamp: string;
}

interface RiskStoreState {
  currentRisk: RiskData;
  isLoading: boolean;
  setRiskData: (data: RiskData) => void;
  setLoading: (loading: boolean) => void;
}

const defaultRisk: RiskData = {
  area_name: "North Eastern Region (NER)",
  risk_score: 0.72,
  risk_level: "High",
  color: "#dc2626",
  factors: {
    landslide_history: 0.78,
    rainfall: 0.82,
    soil_moisture: 0.65,
    elevation: 0.70,
    soil_type: 0.60
  },
  recommendation: "High landslide threat active in steep corridor slopes across East Khasi Hills and Sikkim.",
  timestamp: new Date().toISOString()
};

export const useRiskStore = create<RiskStoreState>((set) => ({
  currentRisk: defaultRisk,
  isLoading: false,
  setRiskData: (data) => set({ currentRisk: data }),
  setLoading: (loading) => set({ isLoading: loading })
}));
