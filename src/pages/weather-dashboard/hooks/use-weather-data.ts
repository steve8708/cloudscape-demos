// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import { useEffect, useState } from 'react';

export interface WeatherData {
  latitude: number;
  longitude: number;
  temperature: number;
  windSpeed: number;
  precipitation: number;
  weatherCode: number;
  humidity: number;
  cloudCover: number;
}

export interface ForecastData {
  time: string[];
  temperature: number[];
  precipitation: number[];
}

export function useWeatherData(latitude: number, longitude: number) {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,cloud_cover,wind_speed_10m&timezone=auto`,
        );

        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }

        const data = await response.json();

        setWeatherData({
          latitude: data.latitude,
          longitude: data.longitude,
          temperature: data.current.temperature_2m,
          windSpeed: data.current.wind_speed_10m,
          precipitation: data.current.precipitation,
          weatherCode: data.current.weather_code,
          humidity: data.current.relative_humidity_2m,
          cloudCover: data.current.cloud_cover,
        });
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [latitude, longitude]);

  return { weatherData, loading, error };
}

export function useForecastData(latitude: number, longitude: number) {
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,precipitation&forecast_days=7&timezone=auto`,
        );

        if (!response.ok) {
          throw new Error('Failed to fetch forecast data');
        }

        const data = await response.json();

        setForecastData({
          time: data.hourly.time,
          temperature: data.hourly.temperature_2m,
          precipitation: data.hourly.precipitation,
        });
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchForecast();
  }, [latitude, longitude]);

  return { forecastData, loading, error };
}
