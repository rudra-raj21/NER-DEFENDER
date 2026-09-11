import React from 'react';
import { ShieldCheck, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAlertStore } from '../../stores/alertStore';

export const AlertModal: React.FC = () => {
  const { t } = useTranslation();
  const { activeModalMessage, clearModal } = useAlertStore();

  if (!activeModalMessage) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="glass-panel border-2 border-red-500/50 max-w-md w-full rounded-2xl p-6 shadow-2xl relative text-center space-y-4">
        <button
          onClick={clearModal}
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-100 p-1 cursor-pointer"
        >
          <X size={18} />
        </button>

        <div className="w-14 h-14 bg-red-950/80 border-2 border-red-500 rounded-full flex items-center justify-center mx-auto text-red-400 shadow-lg">
          <ShieldCheck size={32} />
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-extrabold text-slate-100 tracking-tight uppercase">
            {t('dispatched_official_alert')}
          </h3>
          <div className="bg-slate-900/90 border border-red-500/30 rounded-xl p-3.5 text-xs text-red-300 font-mono font-bold leading-relaxed">
            {activeModalMessage}
          </div>
        </div>

        <button
          onClick={clearModal}
          className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-bold rounded-lg transition-colors cursor-pointer"
        >
          {t('acknowledge_close')}
        </button>
      </div>
    </div>
  );
};
