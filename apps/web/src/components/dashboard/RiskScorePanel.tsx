import React, { useEffect } from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle, Info, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useRiskStore } from '../../stores/riskStore';
import { useMapStore } from '../../stores/mapStore';
import { fetchLiveEngineRisk, getDistrictCoords } from '../../utils/probabilityEngine';

const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000';

export const RiskScorePanel: React.FC = () => {
  const { t } = useTranslation();
  const { currentRisk, isLoading, setRiskData, setLoading } = useRiskStore();
  const { selectedEntity } = useMapStore();

  const updateRiskForEntity = async () => {
    setLoading(true);
    let lat = 25.57;
    let lng = 91.88;

    if (selectedEntity) {
      if (selectedEntity.latLng) {
        [lat, lng] = selectedEntity.latLng;
      } else {
        [lat, lng] = getDistrictCoords(selectedEntity.name);
      }
    }

    try {
      // 1. Query live API endpoint first if reachable (provides live Open-Meteo metrics)
      let endpoint = `${API_BASE}/api/risk/district/East Khasi Hills`;
      if (selectedEntity) {
        if (selectedEntity.latLng) {
          const [eLat, eLng] = selectedEntity.latLng;
          endpoint = `${API_BASE}/api/risk/area/${eLat}/${eLng}`;
        } else {
          endpoint = `${API_BASE}/api/risk/district/${encodeURIComponent(selectedEntity.name)}`;
        }
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const res = await fetch(endpoint, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        setRiskData(data);
        return;
      }
    } catch {
      // Fallback to client-side live Open-Meteo query
    }

    try {
      // 2. Client-side Live Open-Meteo Engine query
      const engineRisk = await fetchLiveEngineRisk(lat, lng, selectedEntity ? selectedEntity.name : 'East Khasi Hills');
      setRiskData(engineRisk);
    } catch {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  // Ensure loading is unset when API response finishes
  useEffect(() => {
    updateRiskForEntity().finally(() => setLoading(false));
  }, [selectedEntity]);

  const getBadgeIcon = (level: string) => {
    switch (level) {
      case 'Critical':
        return <ShieldAlert size={16} className="text-red-400" />;
      case 'High':
        return <AlertTriangle size={16} className="text-rose-400" />;
      case 'Medium':
        return <AlertTriangle size={16} className="text-orange-400" />;
      default:
        return <CheckCircle size={16} className="text-emerald-400" />;
    }
  };

  const scorePercentage = Math.round(currentRisk.risk_score * 100);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs uppercase font-semibold tracking-wider text-slate-400">
          {t('target_area')}
        </h3>
        <button
          onClick={() => updateRiskForEntity().finally(() => setLoading(false))}
          className="flex items-center space-x-1.5 text-xs text-ner-accent hover:text-sky-300 transition-colors font-mono cursor-pointer"
        >
          <RefreshCw size={12} className={isLoading ? 'animate-spin text-ner-accent' : 'text-emerald-400'} />
          <span>{isLoading ? 'Fetching Live Data...' : 'Live Real-Time Model'}</span>
        </button>
      </div>

      <div className="bg-slate-900/70 border border-slate-700/50 rounded-xl p-3.5 flex items-center justify-between relative overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center text-xs text-ner-accent font-mono font-bold animate-pulse z-10">
            Querying Live Open-Meteo & Hydrostatic Saturation...
          </div>
        )}
        <div>
          <h2 className="text-base font-bold text-slate-100">{currentRisk.area_name}</h2>
          <div className="flex items-center space-x-1.5 mt-1">
            {getBadgeIcon(currentRisk.risk_level)}
            <span className="text-xs font-semibold" style={{ color: currentRisk.color }}>
              {currentRisk.risk_level} {t('risk_hud')}
            </span>
          </div>
        </div>

        <div className="text-right">
          <div className="text-2xl font-black tracking-tight transition-all duration-500" style={{ color: currentRisk.color }}>
            {scorePercentage}%
          </div>
          <div className="text-[10px] text-slate-400">Risk Score</div>
        </div>
      </div>

      {/* Progress Bar Gauge */}
      <div>
        <div className="flex justify-between text-[11px] text-slate-400 mb-1">
          <span>0% (Safe)</span>
          <span>50%</span>
          <span>100% (Critical)</span>
        </div>
        <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${scorePercentage}%`,
              backgroundColor: currentRisk.color
            }}
          />
        </div>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-300 flex items-start space-x-2">
        <Info size={14} className="text-ner-accent shrink-0 mt-0.5" />
        <p>{currentRisk.recommendation}</p>
      </div>
    </div>
  );
};
