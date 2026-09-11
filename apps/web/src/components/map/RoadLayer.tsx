import React from 'react';
import { GeoJSON } from 'react-leaflet';
import roadsGeoJson from '../../data/ner_roads.json';
import { useMapStore } from '../../stores/mapStore';
import { useRiskStore } from '../../stores/riskStore';

export const RoadLayer: React.FC = () => {
  const { setSelectedEntity } = useMapStore();
  const { setRiskData } = useRiskStore();

  const getStyle = () => ({
    color: '#06b6d4',
    weight: 3.5,
    opacity: 0.85,
    dashArray: '6, 6'
  });

  const onEachFeature = (feature: any, layer: any) => {
    const props = feature.properties;
    layer.on({
      click: () => {
        setSelectedEntity({
          type: 'road',
          id: props.name,
          name: props.name,
          details: props
        });

        setRiskData({
          area_name: props.name,
          risk_score: 0.77,
          risk_level: "High",
          color: "#dc2626",
          factors: {
            landslide_history: 0.85,
            rainfall: 0.80,
            soil_moisture: 0.72,
            elevation: 0.78,
            soil_type: 0.65
          },
          recommendation: `Transit vulnerability high along highway ${props.name}. Heavy vehicle caution advised.`,
          timestamp: new Date().toISOString()
        });
      }
    });
  };

  return <GeoJSON data={roadsGeoJson as any} style={getStyle} onEachFeature={onEachFeature} />;
};
