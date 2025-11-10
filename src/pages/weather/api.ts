// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { GeocodingResult, WeatherData } from './types';

const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_API = 'https://api.open-meteo.com/v1/forecast';

/**
 * Search for cities by name using Open Meteo Geocoding API
 */
export async function searchCities(query: string): Promise<GeocodingResult[]> {
  if (!query || query.trim().length < 2) {
    return [];
  }

  try {
    const response = await fetch(`${GEOCODING_API}?name=${encodeURIComponent(query)}&count=10&language=en&format=json`);

    if (!response.ok) {
      throw new Error('Failed to fetch cities');
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error searching cities:', error);
    return [];
  }
}

/**
 * Fetch weather data for a specific location
 */
export async function getWeatherData(latitude: number, longitude: number): Promise<WeatherData | null> {
  try {
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      hourly:
        'temperature_2m,precipitation,weathercode,windspeed_10m,winddirection_10m,relativehumidity_2m,cloudcover,visibility,pressure_msl',
      daily:
        'temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode,windspeed_10m_max,winddirection_10m_dominant,sunrise,sunset',
      timezone: 'auto',
      forecast_days: '7',
    });

    const response = await fetch(`${WEATHER_API}?${params.toString()}`);

    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }

    const data = await response.json();
    return data as WeatherData;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
}
