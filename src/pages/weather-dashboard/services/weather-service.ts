// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

export interface CurrentWeather {
  time: string;
  temperature_2m: number;
  relative_humidity_2m: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  weather_code: number;
}

export interface HourlyWeather {
  time: string[];
  temperature_2m: number[];
  relative_humidity_2m: number[];
  wind_speed_10m: number[];
  wind_direction_10m: number[];
  weather_code: number[];
}

export interface WeatherResponse {
  latitude: number;
  longitude: number;
  current: CurrentWeather;
  hourly: HourlyWeather;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  name: string;
  country: string;
}

// Default location (Berlin, Germany)
const DEFAULT_LOCATION: LocationData = {
  latitude: 52.52,
  longitude: 13.41,
  name: 'Berlin',
  country: 'Germany'
};

// Weather code descriptions
export const WEATHER_CODES: Record<number, string> = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  71: 'Slight snow fall',
  73: 'Moderate snow fall',
  75: 'Heavy snow fall',
  95: 'Thunderstorm',
  96: 'Thunderstorm with slight hail',
  99: 'Thunderstorm with heavy hail'
};

class WeatherService {
  private readonly baseUrl = 'https://api.open-meteo.com/v1/forecast';
  private currentLocation: LocationData = DEFAULT_LOCATION;

  async fetchWeatherData(location?: LocationData): Promise<WeatherResponse> {
    const loc = location || this.currentLocation;
    
    const params = new URLSearchParams({
      latitude: loc.latitude.toString(),
      longitude: loc.longitude.toString(),
      current: [
        'temperature_2m',
        'relative_humidity_2m',
        'wind_speed_10m',
        'wind_direction_10m',
        'weather_code'
      ].join(','),
      hourly: [
        'temperature_2m',
        'relative_humidity_2m',
        'wind_speed_10m',
        'wind_direction_10m',
        'weather_code'
      ].join(','),
      timezone: 'auto',
      forecast_days: '7'
    });

    const response = await fetch(`${this.baseUrl}?${params}`);
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    return response.json();
  }

  setLocation(location: LocationData) {
    this.currentLocation = location;
  }

  getCurrentLocation(): LocationData {
    return this.currentLocation;
  }

  getWeatherDescription(code: number): string {
    return WEATHER_CODES[code] || 'Unknown';
  }

  // Helper method to get temperature trend data for charts
  getTemperatureTrend(hourlyData: HourlyWeather, hours: number = 24) {
    return hourlyData.time.slice(0, hours).map((time, index) => ({
      x: new Date(time),
      y: hourlyData.temperature_2m[index]
    }));
  }

  // Helper method to get wind speed data for charts
  getWindSpeedData(hourlyData: HourlyWeather, hours: number = 24) {
    return hourlyData.time.slice(0, hours).map((time, index) => ({
      x: new Date(time),
      y: hourlyData.wind_speed_10m[index]
    }));
  }

  // Helper method to get humidity data for charts
  getHumidityData(hourlyData: HourlyWeather, hours: number = 24) {
    return hourlyData.time.slice(0, hours).map((time, index) => ({
      x: new Date(time),
      y: hourlyData.relative_humidity_2m[index]
    }));
  }
}

export const weatherService = new WeatherService();
