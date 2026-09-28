"use client";

import React, { useEffect, useMemo, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  LayersControl,
  ImageOverlay,
} from "react-leaflet";
import L from "leaflet";
import { CountyWeather, StationWeather } from "@/types/weather";
import {
  getTempColor,
  getRainColor,
  getWeatherStatus,
} from "@/utils/weatherIcons";
import {
  CloudRain,
  Compass,
  Thermometer,
  Wind,
  Layers,
  Info,
  Droplets,
} from "lucide-react";

// Fix leaflet icon default asset paths
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

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

// Helper component to pan/zoom when a county or station is selected
function MapFocusHandler({
  target,
}: {
  target: { lat: number; lng: number; zoom?: number } | null;
}) {
  const map = useMap();
  useEffect(() => {
    if (target) {
      map.flyTo([target.lat, target.lng], target.zoom || 10, {
        duration: 1.2,
      });
    }
  }, [target, map]);
  return null;
}

export const WeatherMap: React.FC<WeatherMapProps> = ({
  counties,
  stations,
  selectedCounty,
  selectedStation,
  onSelectCounty,
  onSelectStation,
  activeTab,
  searchQuery,
}) => {
  // Filter counties and stations based on search query
  const filteredCounties = useMemo(() => {
    if (!searchQuery.trim()) return counties;
    const q = searchQuery.toLowerCase();
    return counties.filter((c) => c.name.toLowerCase().includes(q));
  }, [counties, searchQuery]);

  const filteredStations = useMemo(() => {
    if (!searchQuery.trim()) return stations;
    const q = searchQuery.toLowerCase();
    return stations.filter(
      (s) =>
        s.stationName.toLowerCase().includes(q) ||
        s.county.toLowerCase().includes(q)
    );
  }, [stations, searchQuery]);

  // Create custom marker icons for counties with Pin design & Weather Phenomenon (Wx)
  const createCountyIcon = (county: CountyWeather, isSelected: boolean) => {
    const tempMax = parseFloat(county.currentForecast.maxTemp) || 28;
    const tempMin = parseFloat(county.currentForecast.minTemp) || 22;
    const avgTemp = Math.round((tempMax + tempMin) / 2);
    const rainProb = parseFloat(county.currentForecast.rainProb) || 0;
    const wx = county.currentForecast.weather || "晴時多雲";
    const tempColor = getTempColor(avgTemp);
    const isMajorCity = ["臺北市", "台北市", "臺中市", "台中市", "高雄市"].includes(county.name);

    const html = `
      <div class="weather-pin-container ${isSelected ? "selected" : ""} ${isMajorCity ? "major-city" : ""}">
        <div class="weather-pin-body" style="border-color: ${tempColor.color}; background: rgba(15, 23, 42, 0.95);">
          ${isMajorCity ? `<span class="pin-star">★</span>` : ""}
          <span class="pin-city">${county.name.replace("臺", "台")}</span>
          <span class="pin-wx" title="${wx}">${wx}</span>
          <span class="pin-temp" style="color: ${tempColor.color};">${avgTemp}°C</span>
        </div>
        <div class="weather-pin-arrow" style="border-top-color: ${tempColor.color};"></div>
      </div>
    `;

    return L.divIcon({
      html,
      className: "custom-weather-pin-marker",
      iconSize: [isMajorCity ? 140 : 120, 42],
      iconAnchor: [isMajorCity ? 70 : 60, 42],
      popupAnchor: [0, -42],
    });
  };

  // Create custom marker icons for stations
  const createStationIcon = (station: StationWeather, isSelected: boolean) => {
    const temp = station.temp !== null ? `${Math.round(station.temp)}°` : "--";
    const tempColor =
      station.temp !== null ? getTempColor(station.temp) : { color: "#38bdf8" };

    const html = `
      <div class="weather-badge ${isSelected ? "selected" : ""}" style="background-color: rgba(15, 23, 42, 0.85); border-color: ${tempColor.color}; font-size: 11px; padding: 2px 6px;">
        <span style="color: ${tempColor.color}; font-weight: bold;">${temp}</span>
        <span style="color: #94a3b8; font-size: 10px; margin-left: 2px;">${station.stationName}</span>
      </div>
    `;

    return L.divIcon({
      html,
      className: "custom-weather-marker",
      iconSize: [85, 24],
      iconAnchor: [42, 12],
      popupAnchor: [0, -14],
    });
  };

  // Center on Taichung Dali area (24.1, 120.68) with zoom 7 as requested
  const defaultCenter: [number, number] = [24.1, 120.68];
  const defaultZoom = 7;

  const focusTarget = useMemo(() => {
    if (selectedCounty) {
      return { lat: selectedCounty.lat, lng: selectedCounty.lng, zoom: 10 };
    }
    if (selectedStation) {
      return { lat: selectedStation.lat, lng: selectedStation.lng, zoom: 11 };
    }
    return null;
  }, [selectedCounty, selectedStation]);

  return (
    <div className="relative w-full h-[calc(100vh-140px)] min-h-[550px] rounded-2xl overflow-hidden shadow-2xl border border-white/10">
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        scrollWheelZoom={true}
        className="w-full h-full"
        zoomControl={false}
      >
        <MapFocusHandler target={focusTarget} />

        {/* Base Map Layers */}
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="深色科技地圖 (CartoDB Dark)">
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name="清晰標準地圖 (OSM)">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name="夜間衛星底圖 (CartoDB Voyager)">
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />
          </LayersControl.BaseLayer>
        </LayersControl>

        {/* 1. County Markers */}
        {(activeTab === "counties" || activeTab === "radar") &&
          filteredCounties.map((county) => {
            const isSelected = selectedCounty?.id === county.id;
            return (
              <Marker
                key={county.id}
                position={[county.lat, county.lng]}
                icon={createCountyIcon(county, isSelected)}
                eventHandlers={{
                  click: () => onSelectCounty(county),
                }}
              >
                <Popup className="custom-popup">
                  <div className="p-2 text-slate-100 min-w-[200px]">
                    <div className="flex items-center justify-between border-b border-white/10 pb-1.5 mb-2">
                      <span className="font-bold text-base text-white">
                        {county.name}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded bg-sky-500/20 text-sky-300">
                        {county.currentForecast.weather}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                      <div>
                        <div className="text-slate-400">氣溫區間</div>
                        <div className="text-sm font-bold text-amber-300">
                          {county.currentForecast.minTemp}° ~{" "}
                          {county.currentForecast.maxTemp}°C
                        </div>
                      </div>
                      <div>
                        <div className="text-slate-400">降雨機率</div>
                        <div className="text-sm font-bold text-sky-400">
                          {county.currentForecast.rainProb}%
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectCounty(county)}
                      className="w-full py-1 rounded-lg bg-sky-500 hover:bg-sky-400 text-white font-medium text-xs transition-colors"
                    >
                      查看 36h 詳細預報
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}

        {/* 2. Station Markers */}
        {activeTab === "stations" &&
          filteredStations.map((station) => {
            const isSelected =
              selectedStation?.stationId === station.stationId;
            return (
              <Marker
                key={station.stationId}
                position={[station.lat, station.lng]}
                icon={createStationIcon(station, isSelected)}
                eventHandlers={{
                  click: () => onSelectStation(station),
                }}
              >
                <Popup>
                  <div className="p-2 text-slate-100 min-w-[180px]">
                    <div className="font-bold text-sm text-white mb-1">
                      {station.stationName} 測站
                    </div>
                    <div className="text-xs text-slate-400 mb-2">
                      {station.county}
                    </div>
                    <div className="space-y-1 text-xs mb-3">
                      <div className="flex justify-between">
                        <span className="text-slate-400">即時氣溫：</span>
                        <span className="font-bold text-sky-300">
                          {station.temp !== null ? `${station.temp}°C` : "--"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">相對濕度：</span>
                        <span className="font-bold text-emerald-300">
                          {station.hum !== null ? `${station.hum}%` : "--"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">時雨量：</span>
                        <span className="font-bold text-blue-300">
                          {station.rain !== null ? `${station.rain}mm` : "0mm"}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => onSelectStation(station)}
                      className="w-full py-1 rounded-lg bg-sky-500 hover:bg-sky-400 text-white font-medium text-xs transition-colors"
                    >
                      查看即時觀測詳情
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
      </MapContainer>

      {/* Floating Map Legend */}
      <div className="absolute bottom-4 left-4 z-20 glass-panel rounded-xl p-3 text-xs text-slate-300 border border-white/10 hidden sm:block max-w-xs shadow-lg">
        <div className="font-bold text-white mb-1.5 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-sky-400" />
          <span>圖例說明 (GIS Legend)</span>
        </div>
        <div className="space-y-1.5 text-[11px]">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500 inline-block shrink-0" />
            <span>高溫 (&ge; 30°C)</span>
            <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block shrink-0 ml-2" />
            <span>舒適 (24~29°C)</span>
            <span className="w-3 h-3 rounded-full bg-cyan-500 inline-block shrink-0 ml-2" />
            <span>涼爽 (&lt; 24°C)</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400 pt-1 border-t border-white/5">
            <Droplets className="w-3 h-3 text-sky-400" />
            <span>點擊地圖標記可展開 36 小時氣象詳情</span>
          </div>
        </div>
      </div>
    </div>
  );
};
