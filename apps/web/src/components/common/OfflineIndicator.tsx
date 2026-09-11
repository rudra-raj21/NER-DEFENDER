import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { t } = useTranslation();

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div
      className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium border backdrop-blur-md transition-colors ${
        isOnline
          ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-400'
          : 'bg-amber-950/60 border-amber-500/40 text-amber-400'
      }`}
    >
      {isOnline ? (
        <>
          <Wifi size={12} />
          <span>{t('online')}</span>
        </>
      ) : (
        <>
          <WifiOff size={12} />
          <span>{t('offline')}</span>
        </>
      )}
    </div>
  );
};
