// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import { WeatherCodeInfo } from './types';

// Map WMO Weather codes to descriptions and icon names
// Based on WMO Code: https://open-meteo.com/en/docs
export const weatherCodeMap: Record<number, WeatherCodeInfo> = {
  0: { description: 'Clear sky', icon: 'status-positive' },
  1: { description: 'Mainly clear', icon: 'status-positive' },
  2: { description: 'Partly cloudy', icon: 'status-info' },
  3: { description: 'Overcast', icon: 'view-full' },
  45: { description: 'Foggy', icon: 'view-full' },
  48: { description: 'Depositing rime fog', icon: 'view-full' },
  51: { description: 'Light drizzle', icon: 'status-info' },
  53: { description: 'Moderate drizzle', icon: 'status-info' },
  55: { description: 'Dense drizzle', icon: 'status-info' },
  56: { description: 'Light freezing drizzle', icon: 'status-warning' },
  57: { description: 'Dense freezing drizzle', icon: 'status-warning' },
  61: { description: 'Slight rain', icon: 'status-info' },
  63: { description: 'Moderate rain', icon: 'status-info' },
  65: { description: 'Heavy rain', icon: 'status-negative' },
  66: { description: 'Light freezing rain', icon: 'status-warning' },
  67: { description: 'Heavy freezing rain', icon: 'status-negative' },
  71: { description: 'Slight snow', icon: 'status-info' },
  73: { description: 'Moderate snow', icon: 'status-info' },
  75: { description: 'Heavy snow', icon: 'status-negative' },
  77: { description: 'Snow grains', icon: 'status-info' },
  80: { description: 'Slight rain showers', icon: 'status-info' },
  81: { description: 'Moderate rain showers', icon: 'status-warning' },
  82: { description: 'Violent rain showers', icon: 'status-negative' },
  85: { description: 'Slight snow showers', icon: 'status-info' },
  86: { description: 'Heavy snow showers', icon: 'status-negative' },
  95: { description: 'Thunderstorm', icon: 'status-negative' },
  96: { description: 'Thunderstorm with slight hail', icon: 'status-negative' },
  99: { description: 'Thunderstorm with heavy hail', icon: 'status-negative' },
};

export function getWeatherInfo(code: number): WeatherCodeInfo {
  return weatherCodeMap[code] || { description: 'Unknown', icon: 'status-info' };
}

export function formatTemperature(temp: number): string {
  return `${Math.round(temp)}°C`;
}

export function formatWindSpeed(speed: number): string {
  return `${Math.round(speed)} km/h`;
}

export function formatPrecipitation(precip: number): string {
  return `${precip.toFixed(1)} mm`;
}

export function formatPressure(pressure: number): string {
  return `${Math.round(pressure)} hPa`;
}

export function formatHumidity(humidity: number): string {
  return `${Math.round(humidity)}%`;
}

export function getWindDirection(degrees: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}
