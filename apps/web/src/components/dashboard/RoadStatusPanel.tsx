import React from 'react';
import { Route, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const highways = [
  { name: 'NH-27 (Guwahati - Lumding - Silchar)', status: 'High Risk', clear: false, delay: '2-3 hrs expected' },
  { name: 'NH-10 (Siliguri - Gangtok)', status: 'Blocked (Teesta Slide)', clear: false, delay: 'Indefinite' },
  { name: 'NH-6 (Shillong - Jowai - Silchar)', status: 'Restricted Heavy Vehicles', clear: false, delay: '1 hr slowdown' },
  { name: 'NH-2 (Kohima - Imphal)', status: 'Passable', clear: true, delay: 'None' },
  { name: 'NH-415 (Itanagar Highway)', status: 'Passable (Single Lane)', clear: true, delay: '15 mins' }
];

export const RoadStatusPanel: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-2.5">
      <div className="flex items-center space-x-1.5 text-xs font-semibold text-ner-accent uppercase tracking-wider">
        <Route size={14} />
        <span>{t('strategic_highway_corridors')}</span>
      </div>

      <div className="space-y-2 text-xs">
        {highways.map((h) => (
          <div key={h.name} className="bg-slate-900/60 border border-slate-800 rounded-lg p-2.5 flex items-start justify-between">
            <div>
              <div className="font-medium text-slate-200">{h.name}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Est. Delay: {h.delay}</div>
            </div>
            <div className="flex items-center space-x-1 shrink-0 ml-2">
              {h.clear ? (
                <span className="inline-flex items-center space-x-1 bg-emerald-950/70 text-emerald-400 border border-emerald-500/30 text-[10px] px-2 py-0.5 rounded-full">
                  <CheckCircle2 size={10} />
                  <span>Open</span>
                </span>
              ) : (
                <span className="inline-flex items-center space-x-1 bg-rose-950/70 text-rose-400 border border-rose-500/30 text-[10px] px-2 py-0.5 rounded-full">
                  <AlertTriangle size={10} />
                  <span>{h.status}</span>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
