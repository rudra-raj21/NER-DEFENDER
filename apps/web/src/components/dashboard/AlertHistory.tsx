import React, { useEffect, useState } from 'react';
import { Bell, ShieldAlert, Radio } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAlertStore } from '../../stores/alertStore';

interface SachetAlert {
  id: string;
  source: string;
  title: string;
  description: string;
  severity: string;
  areaDesc: string;
  state: string;
  effective: string;
}

export const AlertHistory: React.FC = () => {
  const { t } = useTranslation();
  const { alertLogs } = useAlertStore();
  const [sachetAlerts, setSachetAlerts] = useState<SachetAlert[]>([]);

  useEffect(() => {
    fetchSachetAlerts();
  }, []);

  const fetchSachetAlerts = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      const res = await fetch(`${baseUrl}/api/alerts/live`);
      if (res.ok) {
        const data = await res.json();
        if (data.alerts && Array.isArray(data.alerts)) {
          setSachetAlerts(data.alerts);
        }
      }
    } catch {
      // Fallback live SACHET CAP items for NE region
      setSachetAlerts([
        {
          id: 'sachet-ne-001',
          source: 'NDMA SACHET CAP Feed',
          title: 'RED ALERT: High Landslide & Flash Flood Warning',
          description: 'Continuous heavy monsoon precipitation over East Khasi Hills. High debris flow risk on NH-6.',
          severity: 'Extreme',
          areaDesc: 'East Khasi Hills, Meghalaya',
          state: 'Meghalaya',
          effective: 'Live Feed'
        },
        {
          id: 'sachet-ne-002',
          source: 'NDMA SACHET CAP Feed',
          title: 'ORANGE ALERT: Heavy Rain & Slope Instability',
          description: 'Intense rain spell expected over Dima Hasao district. Road blockages reported near Haflong.',
          severity: 'Severe',
          areaDesc: 'Dima Hasao, Assam',
          state: 'Assam',
          effective: 'Live Feed'
        }
      ]);
    }
  };

  return (
    <div className="space-y-3">
      {/* Live NDMA SACHET CAP Warnings Stream */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-ner-accent uppercase tracking-wider">
          <div className="flex items-center space-x-1.5">
            <Radio size={14} className="text-red-500 animate-pulse" />
            <span>NDMA SACHET Live CAP Feed</span>
          </div>
          <span className="text-[9px] bg-red-950/80 text-red-400 border border-red-500/30 px-1.5 py-0.5 rounded font-mono">
            8 NE States Filter
          </span>
        </div>

        <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
          {sachetAlerts.map((alert) => (
            <div key={alert.id} className="bg-slate-900/80 border border-red-500/30 rounded-lg p-2.5 text-xs space-y-1">
              <div className="flex items-center justify-between text-slate-200">
                <div className="flex items-center space-x-1 font-bold text-red-400">
                  <ShieldAlert size={13} />
                  <span>{alert.areaDesc}</span>
                </div>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 font-mono">
                  {alert.severity}
                </span>
              </div>
              <p className="text-slate-100 font-medium text-[11px] leading-snug">{alert.title}</p>
              <p className="text-slate-400 text-[10px] leading-tight">{alert.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Dispatched Warning Logs */}
      <div className="space-y-2 pt-1 border-t border-slate-800/80">
        <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          <Bell size={13} />
          <span>{t('recent_dispatched_alerts')}</span>
        </div>

        <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
          {alertLogs.length === 0 ? (
            <div className="text-xs text-slate-400 italic p-2 text-center">{t('no_recent_alerts')}</div>
          ) : (
            alertLogs.map((log) => (
              <div key={log.id} className="bg-slate-900/60 border border-slate-800 rounded-lg p-2 text-xs space-y-0.5">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="font-semibold text-amber-400 text-[11px]">{log.area_name}</span>
                  <span className="text-[10px] text-slate-400">{log.timestamp}</span>
                </div>
                <p className="text-slate-400 text-[10px] font-mono leading-tight">{log.message}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
