import React from 'react';
import { GeoJSON } from 'react-leaflet';
import hazardGeoJson from '../../data/hazard_zones.json';
import { useMapStore } from '../../stores/mapStore';
import { useRiskStore } from '../../stores/riskStore';

export const HazardZones: React.FC = () => {
  const { setSelectedEntity } = useMapStore();
  const { setRiskData } = useRiskStore();

  const getStyle = (feature: any) => {
    const severity = feature?.properties?.severity;
    const color = severity === 'Critical' ? '#991b1b' : '#dc2626';

    return {
      fillColor: color,
      weight: 2.5,
      opacity: 0.9,
      color: '#ef4444',
      dashArray: '4, 4',
      fillOpacity: 0.45
    };
  };

  const onEachFeature = (feature: any, layer: any) => {
    const props = feature.properties;
    layer.on({
      click: () => {
        setSelectedEntity({
          type: 'hazard',
          id: props.name,
          name: props.name,
          state: props.state,
          risk_score: props.risk_score,
          risk_level: props.severity,
          details: props
        });

        setRiskData({
          area_name: props.name,
          risk_score: props.risk_score,
          risk_level: props.severity,
          color: props.severity === 'Critical' ? '#991b1b' : '#dc2626',
          factors: {
            landslide_history: 0.95,
            rainfall: 0.90,
            soil_moisture: 0.85,
            elevation: 0.88,
            soil_type: 0.82
          },
          recommendation: `ACTIVE HAZARD ZONE: ${props.name}. Extreme caution. High probability of debris flow during continuous rainfall.`,
          timestamp: new Date().toISOString()
        });
      }
    });
  };

  return <GeoJSON data={hazardGeoJson as any} style={getStyle} onEachFeature={onEachFeature} />;
};
