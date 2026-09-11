import React from 'react';
import { GeoJSON } from 'react-leaflet';
import statesGeoJson from '../../data/ner_states.json';
import { useMapStore } from '../../stores/mapStore';
import { useRiskStore } from '../../stores/riskStore';

export const NERBoundaryLayer: React.FC = () => {
  const { setSelectedEntity } = useMapStore();
  const { setRiskData } = useRiskStore();

  const getStyle = (feature: any) => {
    const level = feature?.properties?.risk_level;
    let color = '#38bdf8';
    if (level === 'Critical') color = '#991b1b';
    else if (level === 'High') color = '#dc2626';
    else if (level === 'Medium') color = '#f97316';
    else if (level === 'Low') color = '#eab308';
    else if (level === 'Very Low') color = '#22c55e';

    return {
      fillColor: color,
      weight: 2,
      opacity: 0.85,
      color: '#e2e8f0',
      dashArray: '3',
      fillOpacity: 0.18
    };
  };

  const onEachFeature = (feature: any, layer: any) => {
    const props = feature.properties;
    layer.on({
      mouseover: (e: any) => {
        const l = e.target;
        l.setStyle({
          weight: 3,
          fillOpacity: 0.35,
          color: '#ffffff'
        });
      },
      mouseout: (e: any) => {
        const l = e.target;
        l.setStyle(getStyle(feature));
      },
      click: () => {
        setSelectedEntity({
          type: 'state',
          id: props.id,
          name: props.name,
          risk_score: props.risk_score,
          risk_level: props.risk_level,
          latLng: props.center,
          details: props
        });

        // Update risk score store dynamically
        setRiskData({
          area_name: props.name,
          risk_score: props.risk_score,
          risk_level: props.risk_level,
          color: props.risk_level === 'Critical' ? '#991b1b' : props.risk_level === 'High' ? '#dc2626' : '#f97316',
          factors: {
            landslide_history: round(props.risk_score * 0.95),
            rainfall: round(props.risk_score * 0.9),
            soil_moisture: round(props.risk_score * 0.8),
            elevation: round(props.risk_score * 0.85),
            soil_type: round(props.risk_score * 0.75)
          },
          recommendation: `Regional monitoring active for ${props.name}. State capital ${props.capital} in watch zone.`,
          timestamp: new Date().toISOString()
        });
      }
    });
  };

  function round(val: number) {
    return Math.min(1.0, Math.max(0.05, Math.round(val * 100) / 100));
  }

  return <GeoJSON data={statesGeoJson as any} style={getStyle} onEachFeature={onEachFeature} />;
};
