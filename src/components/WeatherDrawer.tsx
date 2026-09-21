"use client";

import React from "react";
import {
  X,
  Calendar,
  CloudRain,
  Thermometer,
  Smile,
  Umbrella,
  Shirt,
  Wind,
  Droplets,
  Sun,
  Navigation,
} from "lucide-react";
import { CountyWeather, StationWeather } from "@/types/weather";
import {
  getWeatherStatus,
  getTempColor,
  getRainColor,
} from "@/utils/weatherIcons";

interface WeatherDrawerProps {
  selectedCounty: CountyWeather | null;
  selectedStation: StationWeather | null;
  onClose: () => void;
}

export const WeatherDrawer: React.FC<WeatherDrawerProps> = ({
  selectedCounty,
  selectedStation,
  onClose,
}) => {
  if (!selectedCounty && !selectedStation) return null;

  // Render Station View
  if (selectedStation) {
    const tempColor =
      selectedStation.temp !== null
        ? getTempColor(selectedStation.temp)
        : { color: "#38bdf8", textColor: "text-sky-400" };

    return (
      <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 glass-panel border-l border-white/10 p-5 shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
        <div>
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-xs font-semibold rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  即時測站
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {selectedStation.stationId}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white mt-1">
                {selectedStation.stationName}
              </h2>
              <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                <Navigation className="w-3 h-3 text-sky-400" />
                {selectedStation.county} ({selectedStation.lat.toFixed(3)}°N,{" "}
                {selectedStation.lng.toFixed(3)}°E)
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Real-time Metrics */}
          <div className="my-6 text-center">
            <div className="text-xs text-slate-400 mb-1">即時觀測氣溫</div>
            <div className="text-5xl font-extrabold tracking-tight text-white flex items-center justify-center gap-1">
              <span className={tempColor.textColor}>
                {selectedStation.temp !== null
                  ? `${selectedStation.temp}°`
                  : "--"}
              </span>
              <span className="text-2xl text-slate-400 font-normal">C</span>
            </div>
          </div>

          {/* Grid Indicators */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="glass-card rounded-xl p-3 border border-white/5">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                <Droplets className="w-4 h-4 text-sky-400" />
                <span>相對濕度</span>
              </div>
              <div className="text-lg font-bold text-slate-200">
                {selectedStation.hum !== null ? `${selectedStation.hum}%` : "--"}
              </div>
            </div>

            <div className="glass-card rounded-xl p-3 border border-white/5">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                <CloudRain className="w-4 h-4 text-blue-400" />
                <span>時雨量</span>
              </div>
              <div className="text-lg font-bold text-slate-200">
                {selectedStation.rain !== null
                  ? `${selectedStation.rain} mm`
                  : "0.0 mm"}
              </div>
            </div>

            <div className="glass-card rounded-xl p-3 border border-white/5">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                <Wind className="w-4 h-4 text-teal-400" />
                <span>風速</span>
              </div>
              <div className="text-lg font-bold text-slate-200">
                {selectedStation.windSpeed !== null
                  ? `${selectedStation.windSpeed} m/s`
                  : "--"}
              </div>
            </div>

            <div className="glass-card rounded-xl p-3 border border-white/5">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                <Navigation className="w-4 h-4 text-indigo-400" />
                <span>風向</span>
              </div>
              <div className="text-lg font-bold text-slate-200">
                {selectedStation.windDir !== null
                  ? `${selectedStation.windDir}°`
                  : "--"}
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 font-mono text-center">
            觀測時間：{selectedStation.obsTime}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-sky-500/20 text-sky-300 border border-sky-500/30 font-semibold hover:bg-sky-500/30 transition-all text-sm mt-4"
        >
          關閉測站資訊
        </button>
      </div>
    );
  }

  // Render County View
  const current = selectedCounty!.currentForecast;
  const statusInfo = getWeatherStatus(current.weather);
  const tempMax = parseFloat(current.maxTemp) || 28;
  const tempMin = parseFloat(current.minTemp) || 22;
  const rainProb = parseFloat(current.rainProb) || 0;
  const rainInfo = getRainColor(rainProb);

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] glass-panel border-l border-white/10 p-5 shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
      <div>
        {/* Top bar */}
        <div className="flex items-start justify-between pb-3 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-xs font-semibold rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                縣市天氣預報
              </span>
              <span className="text-xs text-slate-400 font-mono">
                CWA F-C0032-001
              </span>
            </div>
            <h2 className="text-3xl font-extrabold text-white mt-1">
              {selectedCounty!.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Period Card */}
        <div className="my-4 glass-card rounded-2xl p-4 border border-white/10 bg-gradient-to-br from-slate-800/80 to-slate-900/80">
          <div className="flex items-center justify-between mb-3">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold border ${statusInfo.tagColor}">
              {current.weather}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              12小時預報
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-4xl font-extrabold text-white">
                {tempMin}° ~ {tempMax}°
                <span className="text-lg text-slate-400 font-normal">C</span>
              </div>
              <div className="text-xs text-slate-300 mt-1 flex items-center gap-1.5">
                <Smile className="w-3.5 h-3.5 text-amber-400" />
                <span>舒適度：{current.comfort}</span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs text-slate-400 mb-0.5 flex items-center justify-end gap-1">
                <CloudRain className="w-3.5 h-3.5 text-sky-400" />
                降雨機率
              </div>
              <div className="text-2xl font-bold text-sky-300">{rainProb}%</div>
            </div>
          </div>
        </div>

        {/* Actionable Advice Badges */}
        <div className="grid grid-cols-2 gap-2.5 mb-5">
          <div className="glass-card rounded-xl p-2.5 border border-white/5 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
              <Umbrella className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] text-slate-400">雨具攜帶</div>
              <div className="text-xs font-bold text-slate-200 truncate">
                {rainProb >= 40 ? "建議攜帶雨具" : "降雨機率低"}
              </div>
            </div>
          </div>

          <div className="glass-card rounded-xl p-2.5 border border-white/5 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Shirt className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] text-slate-400">穿著指南</div>
              <div className="text-xs font-bold text-slate-200 truncate">
                {tempMax >= 30 ? "清涼透氣短袖" : "舒適長袖薄外套"}
              </div>
            </div>
          </div>
        </div>

        {/* 36-Hour Period Forecasts */}
        <div>
          <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-sky-400" />
            未來 36 小時預報趨勢
          </h3>

          <div className="space-y-2">
            {selectedCounty!.forecasts.map((fc, idx) => {
              const pStatus = getWeatherStatus(fc.weather);
              const pRain = parseFloat(fc.rainProb) || 0;

              // Format date
              const start = new Date(fc.startTime);
              const timeLabel = !isNaN(start.getTime())
                ? `${start.getMonth() + 1}/${start.getDate()} ${start.getHours()}:00`
                : `時段 ${idx + 1}`;

              return (
                <div
                  key={idx}
                  className="glass-card rounded-xl p-3 border border-white/5 hover:border-sky-500/30 transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 text-xs font-bold">
                      +{idx * 12}h
                    </div>
                    <div>
                      <div className="text-xs font-medium text-slate-300">
                        {timeLabel}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {fc.weather}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <div className="text-xs font-bold text-slate-200">
                        {fc.minTemp}° ~ {fc.maxTemp}°C
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {fc.comfort}
                      </div>
                    </div>

                    <div className="w-12">
                      <div className="text-xs font-semibold text-sky-300">
                        {pRain}%
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-1.5 mt-1 overflow-hidden">
                        <div
                          className="bg-sky-500 h-full rounded-full"
                          style={{ width: `${Math.min(pRain, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <button
        onClick={onClose}
        className="w-full py-2.5 rounded-xl bg-sky-500/20 text-sky-300 border border-sky-500/30 font-semibold hover:bg-sky-500/30 transition-all text-sm mt-4"
      >
        關閉詳細氣象
      </button>
    </div>
  );
};
