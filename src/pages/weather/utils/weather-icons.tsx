// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import {
  IconSun,
  IconCloudSun,
  IconCloud,
  IconMist,
  IconCloudRain,
  IconCloudSnow,
  IconCloudFog,
  IconThunderstorm,
  IconCloudStorm,
  IconSnowflake,
} from '@tabler/icons-react';

// Map WMO weather codes to icon components
// Based on the codes from Open-Meteo API
// https://open-meteo.com/en/docs#weathervariables
export function getWeatherIconComponent(weatherCode: number): React.ComponentType<{ size?: number }> {
  switch (weatherCode) {
    case 0: // Clear sky
      return IconSun;
    case 1: // Mainly clear
    case 2: // Partly cloudy
      return IconCloudSun;
    case 3: // Overcast
      return IconCloud;
    case 45: // Fog
    case 48: // Depositing rime fog
      return IconCloudFog;
    case 51: // Light drizzle
    case 53: // Moderate drizzle
    case 55: // Dense drizzle
      return IconCloudRain;
    case 56: // Light freezing drizzle
    case 57: // Dense freezing drizzle
      return IconSnowflake;
    case 61: // Slight rain
    case 63: // Moderate rain
    case 65: // Heavy rain
      return IconCloudRain;
    case 66: // Light freezing rain
    case 67: // Heavy freezing rain
      return IconCloudSnow;
    case 71: // Slight snow fall
    case 73: // Moderate snow fall
    case 75: // Heavy snow fall
    case 77: // Snow grains
      return IconCloudSnow;
    case 80: // Slight rain showers
    case 81: // Moderate rain showers
    case 82: // Violent rain showers
      return IconCloudRain;
    case 85: // Slight snow showers
    case 86: // Heavy snow showers
      return IconCloudSnow;
    case 95: // Thunderstorm: Slight or moderate
      return IconThunderstorm;
    case 96: // Thunderstorm with slight hail
    case 99: // Thunderstorm with heavy hail
      return IconCloudStorm;
    default:
      return IconCloud;
  }
}
