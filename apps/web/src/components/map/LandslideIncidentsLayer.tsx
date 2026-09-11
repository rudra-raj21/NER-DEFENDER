import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import nesacLandslides from '../../data/nesac_landslides.json';
import { useMapStore } from '../../stores/mapStore';
import { useRiskStore } from '../../stores/riskStore';

// Red pulsating marker for actual historical NESAC landslide events
const incidentIcon = new L.DivIcon({
  className: 'custom-nesac-icon',
  html: `<div class="w-3.5 h-3.5 bg-red-600 border-2 border-white rounded-full shadow-md hover:scale-125 transition-all cursor-pointer"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7]
});

export const LandslideIncidentsLayer: React.FC = () => {
  const { setSelectedEntity } = useMapStore();
  const { setRiskData } = useRiskStore();

  // Render first 200 incidents for performance or all
  const features = nesacLandslides.features.slice(0, 300);

  return (
    <>
      {features.map((feature: any, idx: number) => {
        const [lng, lat] = feature.geometry.coordinates;
        const props = feature.properties;

        return (
          <Marker
            key={idx}
            position={[lat, lng]}
            icon={incidentIcon}
            eventHandlers={{
              click: () => {
                setSelectedEntity({
                  type: 'hazard',
                  id: `${props.event_name}-${idx}`,
                  name: props.event_name,
                  state: props.state,
                  district: props.district,
                  risk_score: 0.88,
                  risk_level: 'Critical',
                  details: props
                });

                setRiskData({
                  area_name: `${props.event_name} (${props.district}, ${props.state})`,
                  risk_score: 0.88,
                  risk_level: 'Critical',
                  color: '#991b1b',
                  factors: {
                    landslide_history: 0.95,
                    rainfall: 0.88,
                    soil_moisture: 0.82,
                    elevation: 0.85,
                    soil_type: 0.78
                  },
                  recommendation: `NESAC VERIFIED INCIDENT RECORD: ${props.event_name} recorded on ${props.date}. Extreme slope vulnerability area.`,
                  timestamp: new Date().toISOString()
                });
              }
            }}
          >
            <Popup className="custom-popup">
              <div className="text-xs text-slate-900 font-semibold p-1">
                <p className="text-sm font-bold text-red-700">{props.event_name}</p>
                <p className="text-slate-700">State: {props.state}</p>
                <p className="text-slate-700">District: {props.district}</p>
                <p className="text-slate-700">Date: {props.date} {props.time}</p>
                <p className="text-xs text-slate-500 font-mono mt-1">Source: NESAC / NERDRR</p>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
};
