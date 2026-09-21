export interface WeatherStatusInfo {
  iconName: string;
  label: string;
  color: string;
  bgColor: string;
  tagColor: string;
}

export function getWeatherStatus(weatherText: string): WeatherStatusInfo {
  const text = weatherText || "";

  if (text.includes("雷") || text.includes("閃電")) {
    return {
      iconName: "CloudLightning",
      label: "雷陣雨",
      color: "text-amber-400",
      bgColor: "bg-amber-950/60 border-amber-500/50",
      tagColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    };
  }

  if (text.includes("雨") || text.includes("陣雨") || text.includes("毛雨")) {
    return {
      iconName: "CloudRain",
      label: "降雨",
      color: "text-sky-400",
      bgColor: "bg-sky-950/60 border-sky-500/50",
      tagColor: "bg-sky-500/20 text-sky-300 border-sky-500/30",
    };
  }

  if (text.includes("晴") && (text.includes("雲") || text.includes("陰"))) {
    return {
      iconName: "CloudSun",
      label: "多雲時晴",
      color: "text-amber-300",
      bgColor: "bg-amber-900/40 border-amber-400/40",
      tagColor: "bg-amber-400/20 text-amber-200 border-amber-400/30",
    };
  }

  if (text.includes("晴")) {
    return {
      iconName: "Sun",
      label: "晴朗",
      color: "text-yellow-400",
      bgColor: "bg-yellow-950/50 border-yellow-400/50",
      tagColor: "bg-yellow-400/20 text-yellow-300 border-yellow-400/30",
    };
  }

  if (text.includes("陰") || text.includes("多雲")) {
    return {
      iconName: "Cloud",
      label: "陰天/多雲",
      color: "text-slate-300",
      bgColor: "bg-slate-800/60 border-slate-600/50",
      tagColor: "bg-slate-700/30 text-slate-200 border-slate-600/30",
    };
  }

  if (text.includes("霧") || text.includes("霾")) {
    return {
      iconName: "CloudFog",
      label: "霧/霾",
      color: "text-gray-300",
      bgColor: "bg-gray-800/60 border-gray-600/50",
      tagColor: "bg-gray-700/30 text-gray-200 border-gray-600/30",
    };
  }

  return {
    iconName: "SunDim",
    label: text || "晴時多雲",
    color: "text-sky-300",
    bgColor: "bg-slate-800/60 border-slate-700/50",
    tagColor: "bg-sky-500/20 text-sky-300 border-sky-500/30",
  };
}

export function getTempColor(temp: number): {
  color: string;
  badgeBg: string;
  textColor: string;
} {
  if (temp >= 32) {
    return {
      color: "#ef4444",
      badgeBg: "bg-red-500/20 border-red-500 text-red-400",
      textColor: "text-red-400",
    };
  }
  if (temp >= 28) {
    return {
      color: "#f97316",
      badgeBg: "bg-orange-500/20 border-orange-500 text-orange-400",
      textColor: "text-orange-400",
    };
  }
  if (temp >= 24) {
    return {
      color: "#eab308",
      badgeBg: "bg-yellow-500/20 border-yellow-500 text-yellow-300",
      textColor: "text-yellow-300",
    };
  }
  if (temp >= 18) {
    return {
      color: "#10b981",
      badgeBg: "bg-emerald-500/20 border-emerald-500 text-emerald-300",
      textColor: "text-emerald-300",
    };
  }
  return {
    color: "#06b6d4",
    badgeBg: "bg-cyan-500/20 border-cyan-500 text-cyan-300",
    textColor: "text-cyan-300",
  };
}

export function getRainColor(pop: number): {
  color: string;
  badgeBg: string;
  textColor: string;
} {
  if (pop >= 70) {
    return {
      color: "#3b82f6",
      badgeBg: "bg-blue-600/30 border-blue-500 text-blue-300",
      textColor: "text-blue-400",
    };
  }
  if (pop >= 40) {
    return {
      color: "#0284c7",
      badgeBg: "bg-sky-600/30 border-sky-500 text-sky-300",
      textColor: "text-sky-400",
    };
  }
  if (pop >= 20) {
    return {
      color: "#06b6d4",
      badgeBg: "bg-cyan-600/20 border-cyan-500 text-cyan-300",
      textColor: "text-cyan-400",
    };
  }
  return {
    color: "#64748b",
    badgeBg: "bg-slate-700/30 border-slate-600 text-slate-400",
    textColor: "text-slate-400",
  };
}
