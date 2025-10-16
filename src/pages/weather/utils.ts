// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

export function getWeatherIcon(code: number): string {
  // WMO Weather interpretation codes
  const weatherIcons: { [key: number]: string } = {
    0: '☀️', // Clear sky
    1: '🌤️', // Mainly clear
    2: '⛅', // Partly cloudy
    3: '☁️', // Overcast
    45: '🌫️', // Fog
    48: '🌫️', // Depositing rime fog
    51: '🌦️', // Drizzle: Light
    53: '🌦️', // Drizzle: Moderate
    55: '🌧️', // Drizzle: Dense
    56: '🌧️', // Freezing Drizzle: Light
    57: '🌧️', // Freezing Drizzle: Dense
    61: '🌧️', // Rain: Slight
    63: '🌧️', // Rain: Moderate
    65: '🌧️', // Rain: Heavy
    66: '🌨️', // Freezing Rain: Light
    67: '🌨️', // Freezing Rain: Heavy
    71: '🌨️', // Snowfall: Slight
    73: '🌨️', // Snowfall: Moderate
    75: '❄️', // Snowfall: Heavy
    77: '🌨️', // Snow grains
    80: '🌦️', // Rain showers: Slight
    81: '🌧️', // Rain showers: Moderate
    82: '🌧️', // Rain showers: Violent
    85: '🌨️', // Snow showers: Slight
    86: '❄️', // Snow showers: Heavy
    95: '⛈️', // Thunderstorm: Slight or moderate
    96: '⛈️', // Thunderstorm with slight hail
    99: '⛈️', // Thunderstorm with heavy hail
  };

  return weatherIcons[code] || '🌡️';
}

export function getWeatherDescription(code: number): string {
  const descriptions: { [key: number]: string } = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Foggy',
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
    71: 'Slight snowfall',
    73: 'Moderate snowfall',
    75: 'Heavy snowfall',
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

  return descriptions[code] || 'Unknown';
}

export function formatTemperature(temp: number): string {
  return `${Math.round(temp)}°C`;
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: false,
  });
}

export function getWindDirection(degrees: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}
