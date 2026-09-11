import React, { useEffect } from 'react';
import { MapContainer as ReactLeafletMap, TileLayer, useMapEvents, useMap } from 'react-leaflet';
import { useMapStore } from '../../stores/mapStore';
import { useRiskStore } from '../../stores/riskStore';
import { useUIStore } from '../../stores/uiStore';
import { NERBoundaryLayer } from './NERBoundaryLayer';
import { DistrictLayer } from './DistrictLayer';
import { RoadLayer } from './RoadLayer';
import { VillageMarkers } from './VillageMarkers';
import { HazardZones } from './HazardZones';
import { LandslideIncidentsLayer } from './LandslideIncidentsLayer';
import { MapControls } from './MapControls';
import { computePythonEngineRisk } from '../../utils/probabilityEngine';

const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000';

const MapResizer: React.FC = () => {
  const map = useMap();
  const { isSidebarOpen } = useUIStore();

  useEffect(() => {
    const resizeMap = () => {
      map.invalidateSize();
    };

    resizeMap();
    const t1 = setTimeout(resizeMap, 100);
    const t2 = setTimeout(resizeMap, 300);

    window.addEventListener('resize', resizeMap);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener('resize', resizeMap);
    };
  }, [map, isSidebarOpen]);

  return null;
};

const MapClickHandler = () => {
  const { setSelectedEntity } = useMapStore();
  const { setRiskData, setLoading } = useRiskStore();

  useMapEvents({
    async click(e) {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;

      setSelectedEntity({
        type: 'point',
        id: `${lat.toFixed(3)},${lng.toFixed(3)}`,
        name: `Location (${lat.toFixed(3)}°N, ${lng.toFixed(3)}°E)`,
        latLng: [lat, lng]
      });

      // 1. Compute instant calculation with identical Python Risk Engine math
      const instantRisk = computePythonEngineRisk(lat, lng);
      setRiskData(instantRisk);

      // 2. Query live API if reachable
      setLoading(true);
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1200);

        const res = await fetch(`${API_BASE}/api/risk/area/${lat}/${lng}`, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          setRiskData(data);
        }
      } catch {
        // Backend optional/unreachable; client calculation remains
      } finally {
        setLoading(false);
      }
    }
  });
  return null;
};

export const MapContainer: React.FC = () => {
  const { center, zoom, layers } = useMapStore();

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-slate-900 z-0">
      <ReactLeafletMap
        center={center}
        zoom={zoom}
        zoomControl={true}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        <MapResizer />
        <MapClickHandler />

        {layers.states && <NERBoundaryLayer />}
        {layers.districts && <DistrictLayer />}
        {layers.roads && <RoadLayer />}
        {layers.villages && <VillageMarkers />}
        {layers.hazardZones && <HazardZones />}
        {layers.incidents && <LandslideIncidentsLayer />}
      </ReactLeafletMap>
      <MapControls />
    </div>
  );
};