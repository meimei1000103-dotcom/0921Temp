"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/Header";
import { WeatherStatsBar } from "@/components/WeatherStatsBar";
import { MapWrapper } from "@/components/MapWrapper";
import { WeatherDrawer } from "@/components/WeatherDrawer";
import {
  CountyWeather,
  StationWeather,
  WeatherApiResponse,
} from "@/types/weather";
import { AlertCircle, RefreshCw, Sparkles, Compass } from "lucide-react";

export default function Home() {
  const [data, setData] = useState<WeatherApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"counties" | "stations" | "radar">(
    "counties"
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCounty, setSelectedCounty] = useState<CountyWeather | null>(
    null
  );
  const [selectedStation, setSelectedStation] = useState<StationWeather | null>(
    null
  );

  const fetchWeather = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true);
    setError(null);
    try {
      const url = `/api/weather${refresh ? "?refresh=true" : ""}`;
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`伺服器回應異常 (${res.status})`);
      }
      const json: WeatherApiResponse = await res.json();
      setData(json);

      // Auto-select Taipei or first county initially if none selected
      if (json.counties.length > 0) {
        setSelectedCounty((prev) => {
          if (prev) {
            return (
              json.counties.find((c) => c.id === prev.id) || json.counties[0]
            );
          }
          const defaultCounty =
            json.counties.find((c) => c.name.includes("臺北")) ||
            json.counties[0];
          return defaultCounty;
        });
      }
    } catch (err: any) {
      console.error("Fetch weather failed:", err);
      setError(err.message || "無法載入氣象資料，請稍後重試。");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeather(false);
  }, [fetchWeather]);

  const handleSelectCounty = (county: CountyWeather) => {
    setSelectedCounty(county);
    setSelectedStation(null);
  };

  const handleSelectStation = (station: StationWeather) => {
    setSelectedStation(station);
    setSelectedCounty(null);
  };

  const handleCloseDrawer = () => {
    setSelectedCounty(null);
    setSelectedStation(null);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Bar */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onRefresh={() => fetchWeather(true)}
        isLoading={isLoading}
        lastUpdated={data?.timestamp || null}
        totalCounties={data?.counties.length || 22}
        totalStations={data?.stations.length || 0}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-6 py-4 flex flex-col gap-3">
        {/* Error Alert if any */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => fetchWeather(true)}
              className="px-3 py-1 rounded-lg bg-rose-500/30 hover:bg-rose-500/40 font-medium text-xs text-white transition-colors"
            >
              重新連線
            </button>
          </div>
        )}

        {/* Overview Stats Bar */}
        <WeatherStatsBar
          stats={data?.stats}
          selectedCountyName={selectedCounty?.name}
        />

        {/* Map Container View */}
        <div className="relative flex-1 w-full">
          <MapWrapper
            counties={data?.counties || []}
            stations={data?.stations || []}
            selectedCounty={selectedCounty}
            selectedStation={selectedStation}
            onSelectCounty={handleSelectCounty}
            onSelectStation={handleSelectStation}
            activeTab={activeTab}
            searchQuery={searchQuery}
          />

          {/* Quick County Selector Pills Bar (Desktop Bottom Center) */}
          {activeTab === "counties" && data?.counties && (
            <div className="absolute top-3 left-3 z-20 hidden md:flex flex-wrap gap-1.5 max-w-xl p-2 glass-panel rounded-xl border border-white/10 max-h-28 overflow-y-auto">
              {data.counties.slice(0, 12).map((c) => {
                const isSelected = selectedCounty?.id === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => handleSelectCounty(c)}
                    className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${
                      isSelected
                        ? "bg-sky-500 text-white font-bold shadow-md shadow-sky-500/30"
                        : "bg-slate-800/70 text-slate-300 hover:bg-slate-700/80 hover:text-white"
                    }`}
                  >
                    {c.name.replace("臺", "台")} {c.currentForecast.maxTemp}°
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Slide-over Weather Details Drawer */}
      <WeatherDrawer
        selectedCounty={selectedCounty}
        selectedStation={selectedStation}
        onClose={handleCloseDrawer}
      />

      {/* Footer */}
      <footer className="w-full border-t border-white/10 py-3 px-4 text-center text-xs text-slate-400 glass-panel mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span>資料來源：</span>
            <a
              href="https://opendata.cwa.gov.tw"
              target="_blank"
              rel="noreferrer"
              className="text-sky-400 hover:underline"
            >
              交通部中央氣象署 (CWA) 開放資料平臺
            </a>
          </div>
          <div>
            Taiwan Weather GIS Platform &bull; Built with Next.js, React-Leaflet
            & Tailwind CSS
          </div>
        </div>
      </footer>
    </div>
  );
}
