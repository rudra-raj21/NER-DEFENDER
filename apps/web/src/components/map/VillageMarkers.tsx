import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import villagesGeoJson from '../../data/ner_villages.json';
import { useMapStore } from '../../stores/mapStore';
import { useRiskStore } from '../../stores/riskStore';

// Custom village marker icon using Leaflet DivIcon
const villageIcon = new L.DivIcon({
  className: 'custom-village-icon',
  html: `<div class="w-3.5 h-3.5 bg-amber-400 border-2 border-slate-900 rounded-full shadow-lg pulse"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7]
});

export const VillageMarkers: React.FC = () => {
  const { setSelectedEntity } = useMapStore();
  const { setRiskData } = useRiskStore();

  return (
    <>
      {villagesGeoJson.features.map((feature: any, idx: number) => {
        const [lng, lat] = feature.geometry.coordinates;
        const props = feature.properties;

        return (
          <Marker
            key={idx}
            position={[lat, lng]}
            icon={villageIcon}
            eventHandlers={{
              click: () => {
                setSelectedEntity({
                  type: 'village',
                  id: props.name,
                  name: `${props.name} Village`,
                  state: props.state,
                  details: props
                });

                setRiskData({
                  area_name: `${props.name}, ${props.state}`,
                  risk_score: props.risk === 'Critical' ? 0.86 : 0.68,
                  risk_level: props.risk === 'Critical' ? 'Critical' : 'High',
                  color: props.risk === 'Critical' ? '#991b1b' : '#dc2626',
                  factors: {
                    landslide_history: 0.88,
                    rainfall: 0.84,
                    soil_moisture: 0.75,
                    elevation: 0.80,
                    soil_type: 0.70
                  },
                  recommendation: `Settlement alert for ${props.name} (Pop. ${props.population}). Check local drainage and slope movement.`,
                  timestamp: new Date().toISOString()
                });
              }
            }}
          >
            <Popup className="custom-popup">
              <div className="text-xs text-slate-900 font-semibold p-1">
                <p className="text-sm font-bold text-slate-950">{props.name}</p>
                <p className="text-slate-700">State: {props.state}</p>
                <p className="text-slate-700">Population: {props.population.toLocaleString()}</p>
                <p className="text-amber-800 font-bold mt-1">Risk: {props.risk}</p>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
};
