"use client";

import React, { useState, useEffect } from "react";
import {
  CloudSun,
  RefreshCw,
  Search,
  MapPin,
  Compass,
  Radio,
  Layers,
  Sparkles,
  Github,
} from "lucide-react";

interface HeaderProps {
  activeTab: "counties" | "stations" | "radar";
  onTabChange: (tab: "counties" | "stations" | "radar") => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onRefresh: () => void;
  isLoading: boolean;
  lastUpdated: string | null;
  totalCounties: number;
  totalStations: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  onRefresh,
  isLoading,
  lastUpdated,
  totalCounties,
  totalStations,
}) => {
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("zh-TW", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-30 w-full glass-panel border-b border-white/10 px-4 lg:px-6 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand & Title */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 shadow-glow">
              <CloudSun className="w-6 h-6 text-white animate-pulse-glow" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-900" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg lg:text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                  台灣氣象 GIS 資訊地圖
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 text-xs font-semibold rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  CWA 即時
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Taiwan Weather GIS Interactive Platform
              </p>
            </div>
          </div>

          {/* Mobile Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="md:hidden p-2 rounded-lg bg-slate-800/80 border border-white/10 text-slate-300 hover:text-white"
            title="重新整理"
          >
            <RefreshCw
              className={`w-4 h-4 ${isLoading ? "animate-spin text-sky-400" : ""}`}
            />
          </button>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center bg-slate-900/80 p-1 rounded-xl border border-white/10 shadow-inner w-full md:w-auto justify-center">
          <button
            onClick={() => onTabChange("counties")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              activeTab === "counties"
                ? "bg-sky-500 text-white shadow-md shadow-sky-500/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>22縣市預報 ({totalCounties})</span>
          </button>

          <button
            onClick={() => onTabChange("stations")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              activeTab === "stations"
                ? "bg-sky-500 text-white shadow-md shadow-sky-500/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>即時測站 ({totalStations})</span>
          </button>

          <button
            onClick={() => onTabChange("radar")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              activeTab === "radar"
                ? "bg-sky-500 text-white shadow-md shadow-sky-500/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>降雨雷達</span>
          </button>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          {/* Search Box */}
          <div className="relative flex-1 md:w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="搜尋縣市或測站..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-900/90 border border-white/10 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-400/60 focus:ring-1 focus:ring-sky-400/60 transition-all"
            />
          </div>

          {/* Desktop Refresh */}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-white/10 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-700/80 transition-all disabled:opacity-50"
            title="重新獲取 CWA 最新氣象"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-sky-400" : ""}`}
            />
            <span>{isLoading ? "更新中..." : "重新整理"}</span>
          </button>

          {/* Time Display */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900/60 border border-white/5 text-xs text-slate-400 font-mono">
            <span>{currentTime}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
