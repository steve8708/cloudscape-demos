// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

export interface WeatherData {
  current: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    surface_pressure: number;
    weather_code: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    relative_humidity_2m: number[];
    wind_speed_10m: number[];
    surface_pressure: number[];
    weather_code: number[];
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    wind_speed_10m_max: number[];
    weather_code: number[];
  };
}

export interface Location {
  latitude: number;
  longitude: number;
  name: string;
  country?: string;
  admin1?: string;
}

export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
  admin2?: string;
}

export type TemperatureUnit = 'celsius' | 'fahrenheit';

export const defaultLocations: Location[] = [
  { latitude: 52.52, longitude: 13.41, name: 'Berlin, Germany' },
  { latitude: 40.7128, longitude: -74.006, name: 'New York, USA' },
  { latitude: 35.6762, longitude: 139.6503, name: 'Tokyo, Japan' },
  { latitude: 51.5074, longitude: -0.1278, name: 'London, UK' },
  { latitude: -33.8688, longitude: 151.2093, name: 'Sydney, Australia' },
];

export const weatherCodes: Record<number, { description: string; icon: string }> = {
  0: { description: 'Clear sky', icon: '☀️' },
  1: { description: 'Mainly clear', icon: '🌤️' },
  2: { description: 'Partly cloudy', icon: '⛅' },
  3: { description: 'Overcast', icon: '☁️' },
  45: { description: 'Fog', icon: '🌫️' },
  48: { description: 'Depositing rime fog', icon: '🌫️' },
  51: { description: 'Light drizzle', icon: '🌦️' },
  53: { description: 'Moderate drizzle', icon: '🌦️' },
  55: { description: 'Dense drizzle', icon: '🌧️' },
  61: { description: 'Slight rain', icon: '🌧️' },
  63: { description: 'Moderate rain', icon: '🌧️' },
  65: { description: 'Heavy rain', icon: '🌧️' },
  71: { description: 'Slight snow fall', icon: '🌨️' },
  73: { description: 'Moderate snow fall', icon: '🌨️' },
  75: { description: 'Heavy snow fall', icon: '❄️' },
  95: { description: 'Thunderstorm', icon: '⛈️' },
};

export async function fetchWeatherData(location: Location, temperatureUnit: TemperatureUnit = 'celsius'): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: location.latitude.toString(),
    longitude: location.longitude.toString(),
    current: 'temperature_2m,relative_humidity_2m,wind_speed_10m,surface_pressure,weather_code',
    hourly: 'temperature_2m,relative_humidity_2m,wind_speed_10m,surface_pressure,weather_code',
    daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max,weather_code',
    timezone: 'auto',
    forecast_days: '7',
    temperature_unit: temperatureUnit === 'fahrenheit' ? 'fahrenheit' : 'celsius',
  });

  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
  
  if (!response.ok) {
    throw new Error(`Weather API error: ${response.status}`);
  }

  return response.json();
}

export async function searchCities(query: string): Promise<GeocodingResult[]> {
  if (query.length < 2) return [];

  const params = new URLSearchParams({
    name: query,
    count: '10',
    language: 'en',
    format: 'json',
  });

  try {
    const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${params}`);
    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status}`);
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error searching cities:', error);
    return [];
  }
}

export function formatTemperature(temp: number, unit: TemperatureUnit = 'celsius'): string {
  const symbol = unit === 'fahrenheit' ? '°F' : '°C';
  return `${Math.round(temp)}${symbol}`;
}

export function formatHumidity(humidity: number): string {
  return `${Math.round(humidity)}%`;
}

export function formatWindSpeed(speed: number): string {
  return `${Math.round(speed)} km/h`;
}

export function formatPressure(pressure: number): string {
  return `${Math.round(pressure)} hPa`;
}
