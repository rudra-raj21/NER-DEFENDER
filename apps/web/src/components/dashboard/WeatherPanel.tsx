import React, { useEffect, useState } from 'react';
import { CloudRain, Thermometer, Droplets, Wind, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useMapStore } from '../../stores/mapStore';

export const WeatherPanel: React.FC = () => {
  const { t } = useTranslation();
  const { selectedEntity } = useMapStore();
  const [weather, setWeather] = useState({
    temp: 22.8,
    humidity: 86,
    rain24h: 68.5,
    wind: 14,
    condition: 'Heavy Rain'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchWeather();
  }, [selectedEntity]);

  const fetchWeather = async () => {
    setLoading(true);
    try {
      const lat = selectedEntity?.latLng ? selectedEntity.latLng[0] : 25.57;
      const lng = selectedEntity?.latLng ? selectedEntity.latLng[1] : 91.88;

      const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,rain,wind_speed_10m`);
      if (res.ok) {
        const data = await res.json();
        const current = data.current;
        setWeather({
          temp: current.temperature_2m ?? 23.2,
          humidity: current.relative_humidity_2m ?? 85,
          rain24h: (current.rain ?? 8.5) * 6,
          wind: current.wind_speed_10m ?? 12,
          condition: current.rain > 0 ? 'Monsoon Downpour' : 'Cloudy / Humid'
        });
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs font-semibold text-ner-accent uppercase tracking-wider">
        <div className="flex items-center space-x-1.5">
          <CloudRain size={14} />
          <span>{t('weather_forecast')}</span>
        </div>
        <button
          onClick={fetchWeather}
          className="text-slate-400 hover:text-slate-100 transition-colors p-1 cursor-pointer"
          title="Refresh weather"
        >
          <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-2.5 flex items-center space-x-2">
          <Thermometer size={18} className="text-amber-400 shrink-0" />
          <div>
            <div className="text-[10px] text-slate-400">{t('temperature')}</div>
            <div className="font-bold text-slate-100">{weather.temp}°C</div>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-2.5 flex items-center space-x-2">
          <Droplets size={18} className="text-blue-400 shrink-0" />
          <div>
            <div className="text-[10px] text-slate-400">{t('humidity')}</div>
            <div className="font-bold text-slate-100">{weather.humidity}%</div>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-2.5 flex items-center space-x-2">
          <CloudRain size={18} className="text-sky-400 shrink-0" />
          <div>
            <div className="text-[10px] text-slate-400">{t('rainfall_24h')}</div>
            <div className="font-bold text-sky-400">{weather.rain24h.toFixed(1)} mm</div>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-2.5 flex items-center space-x-2">
          <Wind size={18} className="text-teal-400 shrink-0" />
          <div>
            <div className="text-[10px] text-slate-400">{t('wind_speed')}</div>
            <div className="font-bold text-slate-100">{weather.wind} km/h</div>
          </div>
        </div>
      </div>
    </div>
  );
};
