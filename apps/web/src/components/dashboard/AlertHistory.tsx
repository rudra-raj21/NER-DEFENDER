import React from 'react';
import { Bell, ShieldAlert } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAlertStore } from '../../stores/alertStore';

export const AlertHistory: React.FC = () => {
  const { t } = useTranslation();
  const { alertLogs } = useAlertStore();

  return (
    <div className="space-y-2.5">
      <div className="flex items-center space-x-1.5 text-xs font-semibold text-ner-accent uppercase tracking-wider">
        <Bell size={14} />
        <span>{t('recent_dispatched_alerts')}</span>
      </div>

      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
        {alertLogs.length === 0 ? (
          <div className="text-xs text-slate-400 italic p-3 text-center">{t('no_recent_alerts')}</div>
        ) : (
          alertLogs.map((log) => (
            <div key={log.id} className="bg-slate-900/70 border border-red-500/20 rounded-lg p-2.5 text-xs space-y-1">
              <div className="flex items-center justify-between text-slate-300">
                <div className="flex items-center space-x-1 font-semibold text-red-400">
                  <ShieldAlert size={12} />
                  <span>{log.area_name}</span>
                </div>
                <span className="text-[10px] text-slate-400">{log.timestamp}</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-tight font-mono">{log.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
