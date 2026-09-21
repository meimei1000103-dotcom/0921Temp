"use client";

import dynamic from "next/dynamic";
import React from "react";
import { Loader2 } from "lucide-react";
import { CountyWeather, StationWeather } from "@/types/weather";

interface WeatherMapProps {
  counties: CountyWeather[];
  stations: StationWeather[];
  selectedCounty: CountyWeather | null;
  selectedStation: StationWeather | null;
  onSelectCounty: (county: CountyWeather) => void;
  onSelectStation: (station: StationWeather) => void;
  activeTab: "counties" | "stations" | "radar";
  searchQuery: string;
}

const DynamicWeatherMap = dynamic<WeatherMapProps>(
  () => import("./WeatherMap").then((mod) => mod.WeatherMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[calc(100vh-140px)] min-h-[500px] rounded-2xl glass-panel flex flex-col items-center justify-center gap-3 border border-white/10">
        <Loader2 className="w-10 h-10 text-sky-400 animate-spin" />
        <span className="text-sm font-medium text-slate-300">
          載入台灣氣象 GIS 互動地圖中...
        </span>
      </div>
    ),
  }
);

export const MapWrapper: React.FC<WeatherMapProps> = (props) => {
  return <DynamicWeatherMap {...props} />;
};
