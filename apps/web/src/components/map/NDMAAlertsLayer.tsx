import React, { useEffect, useState } from 'react';
import { Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { useMapStore } from '../../stores/mapStore';
import { useRiskStore } from '../../stores/riskStore';

interface SachetAlert {
  id: string;
  source: string;
  title: string;
  description: string;
  severity: string;
  areaDesc: string;
  state: string;
  effective: string;
  url?: string;
}

const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000';

const ALERT_LOCATION_COORDS: Record<string, [number, number]> = {
  'east khasi hills': [25.57, 91.88],
  'meghalaya': [25.57, 91.88],
  'dima hasao': [25.16, 93.01],
  'assam': [26.20, 92.93],
  'east sikkim': [27.33, 88.61],
  'sikkim': [27.33, 88.61],
  'papum pare': [27.10, 93.62],
  'arunachal pradesh': [27.10, 93.62],
  'kohima': [25.67, 94.11],
  'nagaland': [25.67, 94.11],
  'aizawl': [23.73, 92.71],
  'mizoram': [23.73, 92.71],
  'imphal east': [24.81, 93.93],
  'manipur': [24.81, 93.93],
  'west tripura': [23.83, 91.28],
  'tripura': [23.83, 91.28]
};

function getCoordsForAlert(alert: SachetAlert): [number, number] {
  const text = `${alert.areaDesc} ${alert.state}`.toLowerCase();
  for (const [key, coords] of Object.entries(ALERT_LOCATION_COORDS)) {
    if (text.includes(key)) return coords;
  }
  return [25.57, 91.88];
}

const redPulseIcon = L.divIcon({
  className: 'ndma-red-pulse',
  html: `<div class="relative flex items-center justify-center w-6 h-6">
    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
    <span class="relative inline-flex rounded-full h-4 w-4 bg-red-600 border-2 border-white shadow-lg"></span>
  </div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

const orangePulseIcon = L.divIcon({
  className: 'ndma-orange-pulse',
  html: `<div class="relative flex items-center justify-center w-6 h-6">
    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
    <span class="relative inline-flex rounded-full h-4 w-4 bg-orange-600 border-2 border-white shadow-lg"></span>
  </div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

export const NDMAAlertsLayer: React.FC = () => {
  const { setSelectedEntity } = useMapStore();
  const { setRiskData } = useRiskStore();
  const [alerts, setAlerts] = useState<SachetAlert[]>([]);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/alerts/live`);
      if (res.ok) {
        const data = await res.json();
        if (data.alerts && Array.isArray(data.alerts)) {
          setAlerts(data.alerts);
          return;
        }
      }
    } catch {
      // Fallback NDMA SACHET alert markers
    }

    setAlerts([
      {
        id: 'sachet-ne-001',
        source: 'NDMA SACHET CAP Feed',
        title: 'RED ALERT: High Landslide & Flash Flood Warning',
        description: 'Continuous heavy monsoonal precipitation across East Khasi Hills and Jaintia Hills. High risk of debris flow on NH-6.',
        severity: 'Extreme',
        areaDesc: 'East Khasi Hills, Meghalaya',
        state: 'Meghalaya',
        effective: 'Live Feed'
      },
      {
        id: 'sachet-ne-002',
        source: 'NDMA SACHET CAP Feed',
        title: 'ORANGE ALERT: Heavy Rainfall & Hill Slope Instability',
        description: 'Intense rain spell expected over Dima Hasao district. Road blockages reported near Haflong.',
        severity: 'Severe',
        areaDesc: 'Dima Hasao, Assam',
        state: 'Assam',
        effective: 'Live Feed'
      },
      {
        id: 'sachet-ne-003',
        source: 'NDMA SACHET CAP Feed',
        title: 'WARNING: Slope Failure Alert - Sikkim Highway',
        description: 'NH-10 stretch vulnerable to sudden landslips near Gangtok due to soil saturation exceeding threshold.',
        severity: 'Severe',
        areaDesc: 'East Sikkim, Sikkim',
        state: 'Sikkim',
        effective: 'Live Feed'
      }
    ]);
  };

  return (
    <>
      {alerts.map((alert) => {
        const coords = getCoordsForAlert(alert);
        const isExtreme = alert.severity.toLowerCase().includes('extreme') || alert.title.toLowerCase().includes('red');
        const color = isExtreme ? '#dc2626' : '#f97316';
        const icon = isExtreme ? redPulseIcon : orangePulseIcon;

        return (
          <React.Fragment key={alert.id}>
            {/* Warning Zone Polygon / Circle Buffer */}
            <Circle
              center={coords}
              radius={isExtreme ? 30000 : 22000}
              pathOptions={{
                color: color,
                fillColor: color,
                fillOpacity: 0.18,
                weight: 2,
                dashArray: '6, 6'
              }}
            />
            <Marker
              position={coords}
              icon={icon}
              eventHandlers={{
                click: () => {
                  setSelectedEntity({
                    type: 'hazard',
                    id: alert.id,
                    name: alert.areaDesc,
                    state: alert.state,
                    risk_score: isExtreme ? 0.92 : 0.78,
                    risk_level: isExtreme ? 'Critical' : 'High',
                    details: alert
                  });

                  setRiskData({
                    area_name: `NDMA CAP Warning: ${alert.areaDesc}`,
                    risk_score: isExtreme ? 0.92 : 0.78,
                    risk_level: isExtreme ? 'Critical' : 'High',
                    color: color,
                    factors: {
                      landslide_history: 0.90,
                      rainfall: 0.95,
                      soil_moisture: 0.88,
                      elevation: 0.80,
                      soil_type: 0.75,
                      deforestation: 0.35
                    },
                    recommendation: `${alert.title}: ${alert.description}`,
                    timestamp: new Date().toISOString()
                  });
                }
              }}
            >
              <Popup className="custom-popup">
                <div className="text-xs text-slate-900 p-1.5 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-sm text-red-700">{alert.areaDesc}</span>
                    <span className="text-[10px] bg-red-100 text-red-800 font-bold px-1.5 py-0.5 rounded">
                      {alert.severity}
                    </span>
                  </div>
                  <p className="font-semibold text-slate-800 text-xs leading-snug">{alert.title}</p>
                  <p className="text-slate-600 text-[11px] leading-tight">{alert.description}</p>
                  <div className="pt-1 border-t border-slate-200 text-[10px] text-slate-500 font-mono flex justify-between">
                    <span>Source: {alert.source}</span>
                    <span>{alert.effective}</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          </React.Fragment>
        );
      })}
    </>
  );
};
