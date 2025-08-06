// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

export interface CurrentWeather {
  time: string;
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  precipitation: number;
  weather_code: number;
  surface_pressure: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
}

export interface HourlyWeather {
  time: string[];
  temperature_2m: number[];
  relative_humidity_2m: number[];
  precipitation: number[];
  weather_code: number[];
  surface_pressure: number[];
  wind_speed_10m: number[];
  wind_direction_10m: number[];
}

export interface DailyWeather {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_sum: number[];
  wind_speed_10m_max: number[];
  weather_code: number[];
}

export interface WeatherData {
  latitude: number;
  longitude: number;
  current: CurrentWeather;
  hourly: HourlyWeather;
  daily: DailyWeather;
  timezone: string;
}

export interface WeatherLocation {
  name: string;
  latitude: number;
  longitude: number;
}

// Default locations for demonstration
export const DEFAULT_LOCATIONS: WeatherLocation[] = [
  { name: 'San Francisco, CA', latitude: 37.7749, longitude: -122.4194 },
  { name: 'New York, NY', latitude: 40.7128, longitude: -74.0060 },
  { name: 'London, UK', latitude: 51.5074, longitude: -0.1278 },
  { name: 'Tokyo, Japan', latitude: 35.6762, longitude: 139.6503 },
  { name: 'Sydney, Australia', latitude: -33.8688, longitude: 151.2093 },
];

export class WeatherAPI {
  private static readonly BASE_URL = 'https://api.open-meteo.com/v1/forecast';

  static async fetchWeatherData(latitude: number, longitude: number): Promise<WeatherData> {
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      current: [
        'temperature_2m',
        'relative_humidity_2m',
        'apparent_temperature',
        'precipitation',
        'weather_code',
        'surface_pressure',
        'wind_speed_10m',
        'wind_direction_10m',
      ].join(','),
      hourly: [
        'temperature_2m',
        'relative_humidity_2m',
        'precipitation',
        'weather_code',
        'surface_pressure',
        'wind_speed_10m',
        'wind_direction_10m',
      ].join(','),
      daily: [
        'temperature_2m_max',
        'temperature_2m_min',
        'precipitation_sum',
        'wind_speed_10m_max',
        'weather_code',
      ].join(','),
      timezone: 'auto',
      forecast_days: '7',
    });

    const response = await fetch(`${this.BASE_URL}?${params}`);
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  }

  static getWeatherDescription(code: number): string {
    const weatherCodes: { [key: number]: string } = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Fog',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      56: 'Light freezing drizzle',
      57: 'Dense freezing drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      66: 'Light freezing rain',
      67: 'Heavy freezing rain',
      71: 'Slight snow fall',
      73: 'Moderate snow fall',
      75: 'Heavy snow fall',
      77: 'Snow grains',
      80: 'Slight rain showers',
      81: 'Moderate rain showers',
      82: 'Violent rain showers',
      85: 'Slight snow showers',
      86: 'Heavy snow showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm with slight hail',
      99: 'Thunderstorm with heavy hail',
    };

    return weatherCodes[code] || 'Unknown';
  }

  static getWindDirection(degrees: number): string {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  }
}
