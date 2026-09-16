import React from 'react';
import { BarChart3, TreeDeciduous } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useRiskStore } from '../../stores/riskStore';

export const ProbabilityBreakdown: React.FC = () => {
  const { t } = useTranslation();
  const { currentRisk } = useRiskStore();
  const f = currentRisk.factors;
  const isNoData = currentRisk.risk_level === ('No Data' as any);

  const factorsList = [
    { label: t('landslide_history'), weight: '30%', value: f.landslide_history, color: 'bg-rose-500' },
    { label: t('rainfall_intensity'), weight: '25%', value: f.rainfall, color: 'bg-sky-500' },
    { label: t('soil_moisture_sat'), weight: '15%', value: f.soil_moisture, color: 'bg-emerald-500' },
    { label: t('terrain_slope'), weight: '15%', value: f.elevation, color: 'bg-amber-500' },
    { label: t('geological_structure'), weight: '15%', value: f.soil_type, color: 'bg-purple-500' },
    {
      label: 'Deforestation & Tree Loss (GFW)',
      weight: null,
      value: f.deforestation ?? 0.35,
      color: 'bg-teal-500',
      isDeforestation: true
    },
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
              <span className="font-medium flex items-center gap-1">
                {item.isDeforestation && <TreeDeciduous size={12} className="text-teal-400" />}
                {item.label}
              </span>
              <span className="text-[10px] text-slate-400">
                {item.weight ? (
                  <>W: <strong className="text-slate-200">{item.weight}</strong> | </>
                ) : null}
                Val: {isNoData ? 'N/A' : `${(item.value * 100).toFixed(0)}%`}
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full ${item.color} transition-all duration-300`}
                style={{ width: isNoData ? '0%' : `${Math.round(item.value * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
