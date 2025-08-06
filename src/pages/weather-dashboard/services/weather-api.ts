// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

export interface WeatherData {
  current: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    precipitation: number;
    weather_code: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    relative_humidity_2m: number[];
    precipitation: number[];
    wind_speed_10m: number[];
    wind_direction_10m: number[];
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
  name: string;
  latitude: number;
  longitude: number;
  country: string;
}

// Default locations for demo
export const defaultLocations: Location[] = [
  { name: 'New York', latitude: 40.7128, longitude: -74.006, country: 'US' },
  { name: 'London', latitude: 51.5074, longitude: -0.1278, country: 'GB' },
  { name: 'Tokyo', latitude: 35.6762, longitude: 139.6503, country: 'JP' },
  { name: 'Sydney', latitude: -33.8688, longitude: 151.2093, country: 'AU' },
  { name: 'Berlin', latitude: 52.52, longitude: 13.405, country: 'DE' },
  { name: 'San Francisco', latitude: 37.7749, longitude: -122.4194, country: 'US' },
];

// Weather code descriptions
export const weatherCodeDescriptions: Record<number, string> = {
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

export class WeatherApiService {
  private baseUrl = 'https://api.open-meteo.com/v1';

  async getCurrentWeather(latitude: number, longitude: number): Promise<WeatherData> {
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      current: [
        'temperature_2m',
        'relative_humidity_2m',
        'precipitation',
        'weather_code',
        'wind_speed_10m',
        'wind_direction_10m',
      ].join(','),
      hourly: [
        'temperature_2m',
        'relative_humidity_2m',
        'precipitation',
        'wind_speed_10m',
        'wind_direction_10m',
        'weather_code',
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

    try {
      const response = await fetch(`${this.baseUrl}/forecast?${params}`);
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch weather data:', error);
      throw error;
    }
  }

  async searchLocations(query: string): Promise<Location[]> {
    if (query.length < 2) {
      return defaultLocations;
    }

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
      return (
        data.results?.map((result: any) => ({
          name: result.name,
          latitude: result.latitude,
          longitude: result.longitude,
          country: result.country_code || result.country || 'Unknown',
        })) || []
      );
    } catch (error) {
      console.error('Failed to search locations:', error);
      return defaultLocations;
    }
  }

  getWeatherDescription(code: number): string {
    return weatherCodeDescriptions[code] || 'Unknown';
  }

  formatTemperature(temp: number): string {
    return `${Math.round(temp)}°C`;
  }

  formatWindSpeed(speed: number): string {
    return `${Math.round(speed)} km/h`;
  }

  formatWindDirection(direction: number): string {
    const directions = [
      'N',
      'NNE',
      'NE',
      'ENE',
      'E',
      'ESE',
      'SE',
      'SSE',
      'S',
      'SSW',
      'SW',
      'WSW',
      'W',
      'WNW',
      'NW',
      'NNW',
    ];
    const index = Math.round(direction / 22.5) % 16;
    return directions[index];
  }
}

export const weatherApi = new WeatherApiService();
