"use client";

import React from "react";
import {
  ThermometerSun,
  ThermometerSnowflake,
  CloudRain,
  Activity,
  Droplets,
  Wind,
} from "lucide-react";

interface WeatherStatsBarProps {
  stats?: {
    maxTemp: { county: string; value: number };
    minTemp: { county: string; value: number };
    maxRainProb: { county: string; value: number };
    avgTemp: number;
  };
  selectedCountyName?: string;
}

export const WeatherStatsBar: React.FC<WeatherStatsBarProps> = ({
  stats,
  selectedCountyName,
}) => {
  if (!stats) return null;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 lg:px-6 py-2">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        {/* Max Temp */}
        <div className="glass-card rounded-xl p-2.5 flex items-center gap-3 border border-rose-500/20 bg-gradient-to-r from-rose-950/30 to-transparent">
          <div className="w-9 h-9 rounded-lg bg-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
            <ThermometerSun className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] text-slate-400 font-medium truncate">
              全台最高溫
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-rose-300">
                {stats.maxTemp.value}°C
              </span>
              <span className="text-xs text-slate-400 truncate">
                {stats.maxTemp.county}
              </span>
            </div>
          </div>
        </div>

        {/* Min Temp */}
        <div className="glass-card rounded-xl p-2.5 flex items-center gap-3 border border-cyan-500/20 bg-gradient-to-r from-cyan-950/30 to-transparent">
          <div className="w-9 h-9 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
            <ThermometerSnowflake className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] text-slate-400 font-medium truncate">
              全台最低溫
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-cyan-300">
                {stats.minTemp.value}°C
              </span>
              <span className="text-xs text-slate-400 truncate">
                {stats.minTemp.county}
              </span>
            </div>
          </div>
        </div>

        {/* Max Rain Probability */}
        <div className="glass-card rounded-xl p-2.5 flex items-center gap-3 border border-sky-500/20 bg-gradient-to-r from-sky-950/30 to-transparent">
          <div className="w-9 h-9 rounded-lg bg-sky-500/20 flex items-center justify-center text-sky-400 shrink-0">
            <CloudRain className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] text-slate-400 font-medium truncate">
              最高降雨率
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-sky-300">
                {stats.maxRainProb.value}%
              </span>
              <span className="text-xs text-slate-400 truncate">
                {stats.maxRainProb.county}
              </span>
            </div>
          </div>
        </div>

        {/* Average Temperature */}
        <div className="glass-card rounded-xl p-2.5 flex items-center gap-3 border border-emerald-500/20 bg-gradient-to-r from-emerald-950/30 to-transparent">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] text-slate-400 font-medium truncate">
              全台平均氣溫
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-emerald-300">
                {stats.avgTemp}°C
              </span>
              <span className="text-xs text-slate-400">舒適適中</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
