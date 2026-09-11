import React from 'react';
import {
  ShieldAlert,
  Activity,
  CloudRain,
  Layers,
  ArrowRight,
  Database,
  Satellite,
  Globe,
  Radio
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from '../common/LanguageSelector';

interface LandingPageProps {
  onLaunchMap: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunchMap }) => {
  const { t } = useTranslation();

  const stats = [
    { label: t('stat_nesac'), value: '1,365+', icon: <Database size={20} className="text-ner-accent" /> },
    { label: t('stat_states'), value: '8 States', icon: <Globe size={20} className="text-amber-400" /> },
    { label: t('stat_imd'), value: '365 Days', icon: <CloudRain size={20} className="text-blue-400" /> },
    { label: t('stat_mosdac'), value: 'Live VWC', icon: <Satellite size={20} className="text-emerald-400" /> },
  ];

  const features = [
    {
      title: t('feature_kde_title'),
      desc: t('feature_kde_desc'),
      icon: <Activity size={24} className="text-ner-accent" />
    },
    {
      title: t('feature_imd_title'),
      desc: t('feature_imd_desc'),
      icon: <CloudRain size={24} className="text-sky-400" />
    },
    {
      title: t('feature_mosdac_title'),
      desc: t('feature_mosdac_desc'),
      icon: <Satellite size={24} className="text-emerald-400" />
    },
    {
      title: t('feature_i18n_title'),
      desc: t('feature_i18n_desc'),
      icon: <Globe size={24} className="text-purple-400" />
    },
    {
      title: t('feature_highways_title'),
      desc: t('feature_highways_desc'),
      icon: <Layers size={24} className="text-amber-400" />
    },
    {
      title: t('feature_alerts_title'),
      desc: t('feature_alerts_desc'),
      icon: <ShieldAlert size={24} className="text-red-500" />
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between overflow-x-hidden font-sans relative">
      {/* Glow Background Gradient Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Navbar */}
      <header className="w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between z-10 border-b border-slate-800/80">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-red-950/80 border border-red-500/40 rounded-xl flex items-center justify-center text-red-500 shadow-lg shadow-red-950/50">
            <ShieldAlert size={22} className="animate-pulse" />
          </div>
          <div>
            <h1 className="text-base font-black tracking-tight text-slate-100 uppercase">
              {t('app_title')}
            </h1>
            <p className="text-[10px] text-slate-400 font-mono tracking-wide">
              {t('app_subtitle')}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <LanguageSelector />
          <button
            onClick={onLaunchMap}
            className="px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-sky-950/50 flex items-center space-x-2 transition-all active:scale-95 cursor-pointer"
          >
            <span>{t('launch_map')}</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="w-full max-w-7xl mx-auto px-6 py-12 md:py-20 z-10 flex-1 flex flex-col justify-center">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/80 text-xs text-ner-accent font-mono shadow-inner">
            <Radio size={14} className="text-emerald-400 animate-pulse" />
            <span>{t('landing_live_engine')}</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight text-slate-100">
            {t('landing_hero_title_1')}{' '}
            <span className="bg-gradient-to-r from-sky-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent block mt-1">
              {t('landing_hero_title_2')}
            </span>
          </h1>

          <p className="text-sm md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {t('landing_hero_desc')}
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onLaunchMap}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-sm uppercase tracking-wider rounded-2xl shadow-xl shadow-red-950/70 border border-red-400/40 flex items-center justify-center space-x-3 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <ShieldAlert size={20} className="animate-pulse" />
              <span>{t('enter_map')}</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* Live Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-5xl mx-auto w-full">
          {stats.map((s, idx) => (
            <div key={idx} className="glass-panel rounded-2xl p-5 border border-slate-800 flex items-center space-x-4">
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 shrink-0">
                {s.icon}
              </div>
              <div>
                <div className="text-xl font-black text-slate-100">{s.value}</div>
                <div className="text-xs text-slate-400">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Feature Grid */}
        <div className="mt-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-extrabold text-slate-100 uppercase tracking-tight">
              {t('capabilities_title')}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {t('capabilities_subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f, idx) => (
              <div key={idx} className="glass-panel rounded-2xl p-6 border border-slate-800 hover:border-slate-700 transition-all space-y-3">
                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 w-fit">
                  {f.icon}
                </div>
                <h3 className="text-base font-bold text-slate-100">{f.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-6 border-t border-slate-800/80 text-xs text-slate-500 flex flex-col md:flex-row items-center justify-between gap-4 z-10">
        <div>
          {t('footer_copyright')}
        </div>
        <div className="flex items-center space-x-6 text-[11px] text-slate-400">
          <span>Assam</span> • <span>Arunachal Pradesh</span> • <span>Meghalaya</span> • <span>Manipur</span> • <span>Mizoram</span> • <span>Nagaland</span> • <span>Tripura</span> • <span>Sikkim</span>
        </div>
      </footer>
    </div>
  );
};
