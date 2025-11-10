// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  timezone?: string;
  country_code?: string;
  country?: string;
  admin1?: string;
  admin2?: string;
  admin3?: string;
  admin4?: string;
  population?: number;
}

export interface HourlyWeatherData {
  time: string[];
  temperature_2m: number[];
  precipitation: number[];
  weathercode: number[];
  windspeed_10m: number[];
  winddirection_10m: number[];
  relativehumidity_2m: number[];
  cloudcover: number[];
  visibility: number[];
  pressure_msl: number[];
}

export interface DailyWeatherData {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_sum: number[];
  weathercode: number[];
  windspeed_10m_max: number[];
  winddirection_10m_dominant: number[];
  sunrise: string[];
  sunset: string[];
}

export interface WeatherData {
  latitude: number;
  longitude: number;
  timezone: string;
  hourly: HourlyWeatherData;
  daily: DailyWeatherData;
}

export interface ChartDataPoint {
  x: string | number;
  y: number;
}
