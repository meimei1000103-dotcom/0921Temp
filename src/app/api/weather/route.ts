import { NextResponse } from "next/server";
import { TAIWAN_COUNTIES } from "@/data/counties";
import {
  CountyWeather,
  ForecastPeriod,
  StationWeather,
  WeatherApiResponse,
} from "@/types/weather";

// In-memory server-side cache
interface CacheEntry {
  data: WeatherApiResponse;
  timestamp: number;
}

let cachedWeatherData: CacheEntry | null = null;
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const forceRefresh = searchParams.get("refresh") === "true";
  const now = Date.now();

  if (
    !forceRefresh &&
    cachedWeatherData &&
    now - cachedWeatherData.timestamp < CACHE_TTL_MS
  ) {
    return NextResponse.json({
      ...cachedWeatherData.data,
      cached: true,
    });
  }

  const apiKey =
    process.env.CWA_API_KEY || "CWA-55FDA6D3-A43C-4AE0-BB30-E62D5F684FB2";

  try {
    // 1. Fetch 36h county forecasts: F-C0032-001
    const forecastUrl = `https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${apiKey}`;
    const stationUrl = `https://opendata.cwa.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=${apiKey}&limit=50`;

    const [forecastRes, stationRes] = await Promise.allSettled([
      fetch(forecastUrl, { next: { revalidate: 600 } }),
      fetch(stationUrl, { next: { revalidate: 600 } }),
    ]);

    let countyList: CountyWeather[] = [];
    let stationList: StationWeather[] = [];

    // Parse F-C0032-001 Forecasts
    if (forecastRes.status === "fulfilled" && forecastRes.value.ok) {
      const forecastJson = await forecastRes.value.json();
      if (forecastJson.success === "true" && forecastJson.records?.location) {
        countyList = parseCountyForecasts(forecastJson.records.location);
      }
    }

    // Parse O-A0003-001 Stations
    if (stationRes.status === "fulfilled" && stationRes.value.ok) {
      const stationJson = await stationRes.value.json();
      if (stationJson.success === "true" && stationJson.records?.Station) {
        stationList = parseStationObservations(stationJson.records.Station);
      }
    }

    // If county list is empty (e.g. CWA temporary outage), generate fallback standard data
    if (countyList.length === 0) {
      countyList = generateFallbackCounties();
    }

    // Compute stats
    let maxTemp = { county: "", value: -999 };
    let minTemp = { county: "", value: 999 };
    let maxRain = { county: "", value: -1 };
    let tempSum = 0;
    let tempCount = 0;

    countyList.forEach((c) => {
      const maxT = parseFloat(c.currentForecast.maxTemp) || 28;
      const minT = parseFloat(c.currentForecast.minTemp) || 22;
      const avgT = (maxT + minT) / 2;
      const pop = parseFloat(c.currentForecast.rainProb) || 0;

      if (maxT > maxTemp.value) {
        maxTemp = { county: c.name, value: maxT };
      }
      if (minT < minTemp.value) {
        minTemp = { county: c.name, value: minT };
      }
      if (pop > maxRain.value) {
        maxRain = { county: c.name, value: pop };
      }
      tempSum += avgT;
      tempCount++;
    });

    const responsePayload: WeatherApiResponse = {
      success: true,
      timestamp: new Date().toISOString(),
      cached: false,
      counties: countyList,
      stations: stationList,
      stats: {
        maxTemp: maxTemp.county ? maxTemp : { county: "臺北市", value: 31 },
        minTemp: minTemp.county ? minTemp : { county: "連江縣", value: 20 },
        maxRainProb: maxRain.county ? maxRain : { county: "基隆市", value: 30 },
        avgTemp: tempCount > 0 ? Math.round((tempSum / tempCount) * 10) / 10 : 26.5,
      },
    };

    cachedWeatherData = {
      data: responsePayload,
      timestamp: now,
    };

    return NextResponse.json(responsePayload);
  } catch (error: any) {
    console.error("CWA API Error:", error);

    // Provide fallback
    const fallbackCounties = generateFallbackCounties();
    const fallbackResponse: WeatherApiResponse = {
      success: true,
      timestamp: new Date().toISOString(),
      cached: false,
      counties: fallbackCounties,
      stations: [],
      stats: {
        maxTemp: { county: "高雄市", value: 31 },
        minTemp: { county: "連江縣", value: 19 },
        maxRainProb: { county: "基隆市", value: 40 },
        avgTemp: 26.2,
      },
      error: "CWA API temporarily unavailable, served resilient fallback data.",
    };

    return NextResponse.json(fallbackResponse);
  }
}

function parseCountyForecasts(locations: any[]): CountyWeather[] {
  const result: CountyWeather[] = [];

  for (const loc of locations) {
    const name = loc.locationName;
    const geo = TAIWAN_COUNTIES[name] || {
      lat: 23.5,
      lng: 121,
      region: "central",
    };

    const elements = loc.weatherElement || [];
    const wxEl = elements.find((e: any) => e.elementName === "Wx");
    const popEl = elements.find((e: any) => e.elementName === "PoP");
    const minTEl = elements.find((e: any) => e.elementName === "MinT");
    const maxTEl = elements.find((e: any) => e.elementName === "MaxT");
    const ciEl = elements.find((e: any) => e.elementName === "CI");

    const timeCount = wxEl?.time?.length || 0;
    const forecasts: ForecastPeriod[] = [];

    for (let i = 0; i < timeCount; i++) {
      forecasts.push({
        startTime: wxEl?.time?.[i]?.startTime || "",
        endTime: wxEl?.time?.[i]?.endTime || "",
        weather: wxEl?.time?.[i]?.parameter?.parameterName || "多雲",
        weatherCode: wxEl?.time?.[i]?.parameter?.parameterValue || "1",
        rainProb: popEl?.time?.[i]?.parameter?.parameterName || "0",
        minTemp: minTEl?.time?.[i]?.parameter?.parameterName || "22",
        maxTemp: maxTEl?.time?.[i]?.parameter?.parameterName || "28",
        comfort: ciEl?.time?.[i]?.parameter?.parameterName || "舒適",
      });
    }

    const currentForecast = forecasts[0] || {
      startTime: "",
      endTime: "",
      weather: "多雲時晴",
      weatherCode: "2",
      rainProb: "10",
      minTemp: "23",
      maxTemp: "29",
      comfort: "舒適",
    };

    result.push({
      id: name,
      name: name,
      lat: geo.lat,
      lng: geo.lng,
      currentForecast,
      forecasts,
      updatedAt: new Date().toISOString(),
    });
  }

  return result;
}

function parseStationObservations(stations: any[]): StationWeather[] {
  return stations
    .filter(
      (st: any) =>
        st.GeoInfo?.Coordinates?.[0]?.StationLatitude &&
        st.GeoInfo?.Coordinates?.[0]?.StationLongitude
    )
    .map((st: any) => {
      const coords = st.GeoInfo.Coordinates[0];
      const weatherObs = st.WeatherElement || {};

      return {
        stationId: st.StationId,
        stationName: st.StationName,
        county: st.GeoInfo?.CountyName || "臺灣",
        lat: parseFloat(coords.StationLatitude),
        lng: parseFloat(coords.StationLongitude),
        temp:
          weatherObs.AirTemperature !== undefined &&
          weatherObs.AirTemperature !== -99
            ? parseFloat(weatherObs.AirTemperature)
            : null,
        hum:
          weatherObs.RelativeHumidity !== undefined &&
          weatherObs.RelativeHumidity !== -99
            ? parseFloat(weatherObs.RelativeHumidity)
            : null,
        rain:
          weatherObs.Now?.precipitation !== undefined &&
          weatherObs.Now?.precipitation !== -99
            ? parseFloat(weatherObs.Now.precipitation)
            : null,
        windSpeed:
          weatherObs.WindSpeed !== undefined && weatherObs.WindSpeed !== -99
            ? parseFloat(weatherObs.WindSpeed)
            : null,
        windDir:
          weatherObs.WindDirection !== undefined &&
          weatherObs.WindDirection !== -99
            ? parseFloat(weatherObs.WindDirection)
            : null,
        obsTime: st.ObsTime?.DateTime || new Date().toISOString(),
      };
    });
}

function generateFallbackCounties(): CountyWeather[] {
  return Object.keys(TAIWAN_COUNTIES).map((name) => {
    const geo = TAIWAN_COUNTIES[name];
    const dummyForecast: ForecastPeriod = {
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 12 * 3600 * 1000).toISOString(),
      weather: "多雲時晴",
      weatherCode: "2",
      rainProb: "10",
      minTemp: "23",
      maxTemp: "30",
      comfort: "舒適",
    };

    return {
      id: name,
      name: name,
      lat: geo.lat,
      lng: geo.lng,
      currentForecast: dummyForecast,
      forecasts: [dummyForecast],
      updatedAt: new Date().toISOString(),
    };
  });
}
