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

  const url = `${WEATHER_API}?${params.toString()}`;
  console.log('Fetching weather from:', url);

  try {
    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Weather API error response:', response.status, errorText);
      throw new Error(`Weather API returned ${response.status}: ${errorText}`);
    }

    const data: WeatherData = await response.json();
    console.log('Weather data received:', data);
    return data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error fetching weather data:', errorMessage);
    throw new Error(`Failed to fetch weather data: ${errorMessage}`);
  }
}
