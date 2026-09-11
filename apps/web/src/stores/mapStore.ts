import { create } from 'zustand';

export type EntityType = 'state' | 'district' | 'road' | 'village' | 'hazard' | 'point';

export interface SelectedEntity {
  type: EntityType;
  id: string;
  name: string;
  state?: string;
  district?: string;
  risk_score?: number;
  risk_level?: string;
  details?: Record<string, any>;
  latLng?: [number, number];
}

interface MapState {
  center: [number, number];
  zoom: number;
  selectedEntity: SelectedEntity | null;
  layers: {
    states: boolean;
    districts: boolean;
    roads: boolean;
    villages: boolean;
    hazardZones: boolean;
    incidents: boolean;
  };
  setCenterZoom: (center: [number, number], zoom: number) => void;
  setSelectedEntity: (entity: SelectedEntity | null) => void;
  toggleLayer: (layerKey: keyof MapState['layers']) => void;
}

export const useMapStore = create<MapState>((set) => ({
  center: [26.0, 92.5], // NER region center
  zoom: 7,
  selectedEntity: null,
  layers: {
    states: true,
    districts: true,
    roads: true,
    villages: true,
    hazardZones: true,
    incidents: true,
  },
  setCenterZoom: (center, zoom) => set({ center, zoom }),
  setSelectedEntity: (entity) => set({ selectedEntity: entity }),
  toggleLayer: (layerKey) =>
    set((state) => ({
      layers: { ...state.layers, [layerKey]: !state.layers[layerKey] },
    })),
}));
