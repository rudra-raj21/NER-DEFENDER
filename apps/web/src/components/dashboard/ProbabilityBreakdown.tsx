import React from 'react';
import { BarChart3 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useRiskStore } from '../../stores/riskStore';

export const ProbabilityBreakdown: React.FC = () => {
  const { t } = useTranslation();
  const { currentRisk } = useRiskStore();
  const f = currentRisk.factors;

  const factorsList = [
    { label: t('landslide_history'), weight: '30%', value: f.landslide_history, color: 'bg-rose-500' },
    { label: t('rainfall_intensity'), weight: '25%', value: f.rainfall, color: 'bg-sky-500' },
    { label: t('soil_moisture_sat'), weight: '15%', value: f.soil_moisture, color: 'bg-emerald-500' },
    { label: t('terrain_slope'), weight: '15%', value: f.elevation, color: 'bg-amber-500' },
    { label: t('geological_structure'), weight: '15%', value: f.soil_type, color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-2.5">
      <div className="flex items-center space-x-2 text-xs font-semibold text-ner-accent uppercase tracking-wider">
        <BarChart3 size={14} />
        <span>{t('probability_weights')}</span>
      </div>

      <div className="space-y-2 text-xs">
        {factorsList.map((item) => (
          <div key={item.label} className="bg-slate-900/60 border border-slate-800 rounded-lg p-2">
            <div className="flex justify-between items-center mb-1 text-slate-300">
              <span className="font-medium">{item.label}</span>
              <span className="text-[10px] text-slate-400">
                W: <strong className="text-slate-200">{item.weight}</strong> | Val: {(item.value * 100).toFixed(0)}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full ${item.color} transition-all duration-300`}
                style={{ width: `${Math.round(item.value * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
