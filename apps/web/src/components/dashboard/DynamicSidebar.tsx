import React from 'react';
import {
  ShieldAlert,
  BarChart3,
  CloudRain,
  Route,
  Bell,
  PlusCircle,
  X,
  ChevronRight,
  MapPin,
  ArrowLeft,
  Home
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useUIStore, SidebarTab } from '../../stores/uiStore';
import { useMapStore } from '../../stores/mapStore';
import { RiskScorePanel } from './RiskScorePanel';
import { ProbabilityBreakdown } from './ProbabilityBreakdown';
import { WeatherPanel } from './WeatherPanel';
import { RoadStatusPanel } from './RoadStatusPanel';
import { AlertHistory } from './AlertHistory';
import { SendAlertButton } from '../alerts/SendAlertButton';
import { LanguageSelector } from '../common/LanguageSelector';
import { OfflineIndicator } from '../common/OfflineIndicator';

interface DynamicSidebarProps {
  onBackToLanding?: () => void;
}

export const DynamicSidebar: React.FC<DynamicSidebarProps> = ({ onBackToLanding }) => {
  const { t } = useTranslation();
  const { activeTab, setActiveTab, setReportModalOpen, isSidebarOpen, toggleSidebar } = useUIStore();
  const { selectedEntity, setSelectedEntity } = useMapStore();

  const tabs: { id: SidebarTab; label: string; icon: React.ReactNode }[] = [
    { id: 'risk', label: t('risk_hud'), icon: <ShieldAlert size={14} /> },
    { id: 'weather', label: t('weather_tab'), icon: <CloudRain size={14} /> },
    { id: 'roads', label: t('highways_tab'), icon: <Route size={14} /> },
    { id: 'alerts', label: t('alerts_tab'), icon: <Bell size={14} /> },
  ];

  if (!isSidebarOpen) {
    return (
      <div className="fixed top-4 left-4 z-[1000] flex items-center space-x-2">
        <button
          onClick={toggleSidebar}
          className="glass-panel rounded-xl p-3 text-slate-100 flex items-center space-x-2 shadow-2xl hover:border-ner-accent transition-all cursor-pointer"
        >
          <ShieldAlert size={18} className="text-ner-accent animate-pulse" />
          <span className="font-bold text-xs">{t('app_title')} HUD</span>
          <ChevronRight size={16} />
        </button>
        {onBackToLanding && (
          <button
            onClick={onBackToLanding}
            className="glass-panel rounded-xl px-3 py-3 text-slate-200 flex items-center space-x-1.5 shadow-2xl hover:text-ner-accent hover:border-ner-accent transition-all text-xs font-bold cursor-pointer"
            title={t('back_to_landing')}
          >
            <ArrowLeft size={16} />
            <span>{t('back_to_landing')}</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <aside className="fixed top-4 left-4 bottom-4 z-[1000] w-96 glass-panel rounded-2xl p-4 flex flex-col shadow-2xl overflow-hidden border border-slate-700/60">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-700/60">
        <div className="flex items-center space-x-2">
          {onBackToLanding && (
            <button
              onClick={onBackToLanding}
              className="p-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition-all cursor-pointer"
              title={t('back_to_landing')}
            >
              <ArrowLeft size={16} />
            </button>
          )}
          <div>
            <div className="flex items-center space-x-2">
              <ShieldAlert size={20} className="text-red-500 animate-pulse" />
              <h1 className="font-black text-sm tracking-tight text-slate-100 uppercase">
                {t('app_title')}
              </h1>
            </div>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">
              {t('app_subtitle')}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          <OfflineIndicator />
          <button
            onClick={toggleSidebar}
            className="text-slate-400 hover:text-slate-100 p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Selected Entity Banner if clicked on map */}
      {selectedEntity && (
        <div className="mt-2 bg-slate-900/90 border border-ner-accent/40 rounded-xl p-2.5 flex items-center justify-between text-xs animate-fade-in">
          <div className="flex items-center space-x-2 truncate">
            <MapPin size={14} className="text-ner-accent shrink-0" />
            <div className="truncate">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                {t('selected')} {selectedEntity.type}
              </span>
              <span className="font-bold text-slate-100 truncate">{selectedEntity.name}</span>
            </div>
          </div>
          <button
            onClick={() => setSelectedEntity(null)}
            className="text-slate-400 hover:text-slate-200 text-[10px] underline ml-2 shrink-0 cursor-pointer"
          >
            {t('reset')}
          </button>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex space-x-1 my-3 bg-slate-900/60 p-1 rounded-xl border border-slate-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-1.5 flex items-center justify-center space-x-1 text-[11px] font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-ner-accent text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Scrollable Tab Content */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {activeTab === 'risk' && (
          <>
            <RiskScorePanel />
            <ProbabilityBreakdown />
          </>
        )}

        {activeTab === 'weather' && (
          <>
            <WeatherPanel />
          </>
        )}

        {activeTab === 'roads' && (
          <>
            <RoadStatusPanel />
          </>
        )}

        {activeTab === 'alerts' && (
          <>
            <AlertHistory />
          </>
        )}
      </div>

      {/* Bottom Sticky Action Panel */}
      <div className="pt-3 mt-2 border-t border-slate-700/60 space-y-2.5">
        <SendAlertButton />

        <div className="flex items-center justify-between">
          <button
            onClick={() => setReportModalOpen(true)}
            className="flex items-center space-x-1.5 text-xs text-ner-accent hover:text-sky-300 font-semibold px-2 py-1 rounded-lg hover:bg-slate-900/60 transition-all cursor-pointer"
          >
            <PlusCircle size={14} />
            <span>{t('report_hazard')}</span>
          </button>
          <LanguageSelector />
        </div>
      </div>
    </aside>
  );
};
