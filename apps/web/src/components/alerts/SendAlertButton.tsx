import React from 'react';
import { Send } from 'lucide-react';
import { useRiskStore } from '../../stores/riskStore';
import { useAlertStore } from '../../stores/alertStore';

export const SendAlertButton: React.FC = () => {
  const { currentRisk } = useRiskStore();
  const { triggerAlert } = useAlertStore();

  const handleSendAlert = async () => {
    const areaName = currentRisk.area_name;

    // Trigger local state notification & log
    triggerAlert(areaName);

    // Send to backend API
    try {
      await fetch('http://localhost:8000/api/alerts/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ area_name: areaName })
      });
    } catch {
      // Backend optional/offline
    }
  };

  return (
    <button
      onClick={handleSendAlert}
      className="w-full py-3 px-4 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-black text-sm uppercase tracking-widest rounded-xl shadow-lg shadow-red-950/60 border border-red-400/40 flex items-center justify-center space-x-2 transition-all active:scale-[0.98] cursor-pointer"
    >
      <Send size={16} className="animate-pulse" />
      <span>SEND ALERT</span>
    </button>
  );
};
