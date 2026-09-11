import React from 'react';
import { GeoJSON } from 'react-leaflet';
import districtsGeoJson from '../../data/ner_districts.json';
import { useMapStore } from '../../stores/mapStore';
import { useRiskStore } from '../../stores/riskStore';

export const DistrictLayer: React.FC = () => {
  const { setSelectedEntity } = useMapStore();
  const { setRiskData } = useRiskStore();

  const getStyle = (feature: any) => {
    const level = feature?.properties?.risk_level;
    let color = '#fbbf24';
    if (level === 'Critical') color = '#b91c1c';
    else if (level === 'High') color = '#ef4444';
    else if (level === 'Medium') color = '#f97316';
    else if (level === 'Low') color = '#eab308';

    return {
      fillColor: color,
      weight: 1.5,
      opacity: 0.7,
      color: '#cbd5e1',
      fillOpacity: 0.25
    };
  };

  const onEachFeature = (feature: any, layer: any) => {
    const props = feature.properties;
    layer.on({
      click: () => {
        setSelectedEntity({
          type: 'district',
          id: props.name,
          name: `${props.name} (${props.state})`,
          state: props.state,
          risk_score: props.risk_score,
          risk_level: props.risk_level,
          details: props
        });

        setRiskData({
          area_name: `${props.name}, ${props.state}`,
          risk_score: props.risk_score,
          risk_level: props.risk_level,
          color: props.risk_level === 'Critical' ? '#991b1b' : props.risk_level === 'High' ? '#dc2626' : '#f97316',
          factors: {
            landslide_history: Math.min(1.0, props.risk_score * 1.05),
            rainfall: Math.min(1.0, props.risk_score * 0.98),
            soil_moisture: Math.min(1.0, props.risk_score * 0.88),
            elevation: Math.min(1.0, props.risk_score * 0.92),
            soil_type: Math.min(1.0, props.risk_score * 0.82)
          },
          recommendation: `District level alert for ${props.name}. Monitor slope stability along key transit points.`,
          timestamp: new Date().toISOString()
        });
      }
    });
  };

  return <GeoJSON data={districtsGeoJson as any} style={getStyle} onEachFeature={onEachFeature} />;
};
