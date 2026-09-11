import React from 'react';
import { Layers, Eye, EyeOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useMapStore } from '../../stores/mapStore';

export const MapControls: React.FC = () => {
  const { t } = useTranslation();
  const { layers, toggleLayer } = useMapStore();

  const layerItems = [
    { key: 'states' as const, label: t('layer_states') },
    { key: 'districts' as const, label: t('layer_districts') },
    { key: 'roads' as const, label: t('layer_highways') },
    { key: 'villages' as const, label: t('layer_settlements') },
    { key: 'hazardZones' as const, label: t('layer_hazard_zones') },
    { key: 'incidents' as const, label: t('layer_nesac_events') },
  ];

  return (
    <div className="absolute top-20 right-4 z-[1000] glass-panel rounded-xl p-3 shadow-2xl text-slate-100 max-w-xs">
      <div className="flex items-center space-x-2 pb-2 mb-2 border-b border-slate-700/60 font-semibold text-xs text-ner-accent">
        <Layers size={14} />
        <span>{t('map_overlay_control')}</span>
      </div>
      <div className="space-y-1.5 text-xs">
        {layerItems.map((item) => {
          const active = layers[item.key];
          return (
            <button
              key={item.key}
              onClick={() => toggleLayer(item.key)}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
                active
                  ? 'bg-slate-800/80 border-slate-600 text-slate-100'
                  : 'bg-slate-900/40 border-slate-800 text-slate-400 opacity-60'
              }`}
            >
              <span>{item.label}</span>
              {active ? <Eye size={12} className="text-ner-accent" /> : <EyeOff size={12} />}
            </button>
          );
        })}
      </div>
    </div>
  );
};
