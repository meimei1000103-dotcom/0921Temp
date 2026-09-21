export interface WeatherElement {
  elementName: string;
  time: Array<{
    startTime: string;
    endTime: string;
    parameter: {
      parameterName: string;
      parameterValue?: string;
      parameterUnit?: string;
    };
  }>;
}

export interface CWALocation {
  locationName: string;
  weatherElement: WeatherElement[];
}

export interface CWAResponse {
  success: string;
  result: {
    resource_id: string;
    fields: Array<{ id: string; type: string }>;
  };
  records: {
    datasetDescription: string;
    location: CWALocation[];
  };
}

export interface ForecastPeriod {
  startTime: string;
  endTime: string;
  weather: string;
  weatherCode: string;
  rainProb: string;
  minTemp: string;
  maxTemp: string;
  comfort: string;
  windSpeed?: string;
}

export interface CountyWeather {
  id: string;
  name: string;
  lat: number;
  lng: number;
  currentForecast: ForecastPeriod;
  forecasts: ForecastPeriod[];
  updatedAt: string;
}

export interface StationWeather {
  stationId: string;
  stationName: string;
  county: string;
  lat: number;
  lng: number;
  temp: number | null;
  hum: number | null;
  rain: number | null;
  windSpeed: number | null;
  windDir: number | null;
  obsTime: string;
}

export interface WeatherApiResponse {
  success: boolean;
  timestamp: string;
  cached: boolean;
  counties: CountyWeather[];
  stations: StationWeather[];
  stats: {
    maxTemp: { county: string; value: number };
    minTemp: { county: string; value: number };
    maxRainProb: { county: string; value: number };
    avgTemp: number;
  };
  error?: string;
}
