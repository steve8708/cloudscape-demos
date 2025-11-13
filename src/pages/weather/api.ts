// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import { GeocodingResponse, Location, WeatherData } from './types';

const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_API = 'https://api.open-meteo.com/v1/forecast';

export async function searchLocations(query: string): Promise<Location[]> {
  if (!query || query.length < 2) {
    return [];
  }

  try {
    const response = await fetch(`${GEOCODING_API}?name=${encodeURIComponent(query)}&count=10&language=en&format=json`);

    if (!response.ok) {
      throw new Error('Failed to fetch locations');
    }

    const data: GeocodingResponse = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error fetching locations:', error);
    return [];
  }
}

export async function fetchWeatherData(latitude: number, longitude: number, timezone: string): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current_weather: 'true',
    hourly: [
      'temperature_2m',
      'precipitation_probability',
      'precipitation',
      'weathercode',
      'windspeed_10m',
      'humidity_2m',
      'pressure_msl',
      'uv_index',
    ].join(','),
    daily: [
      'temperature_2m_max',
      'temperature_2m_min',
      'weathercode',
      'precipitation_sum',
      'precipitation_probability_max',
      'windspeed_10m_max',
      'sunrise',
      'sunset',
      'uv_index_max',
    ].join(','),
    timezone: timezone || 'auto',
  });

  try {
    const response = await fetch(`${WEATHER_API}?${params.toString()}`);

    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }

    const data: WeatherData = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
}
