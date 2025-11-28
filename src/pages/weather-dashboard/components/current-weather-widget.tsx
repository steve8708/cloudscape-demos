// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Box from '@cloudscape-design/components/box';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Icon from '@cloudscape-design/components/icon';

interface CurrentWeatherProps {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    weather_code: number;
    is_day: number;
  };
}

const getWeatherDescription = (weatherCode: number, isDay: number): string => {
  const weatherDescriptions: { [key: number]: { day: string; night: string } } = {
    0: { day: 'Clear sky', night: 'Clear sky' },
    1: { day: 'Mainly clear', night: 'Mainly clear' },
    2: { day: 'Partly cloudy', night: 'Partly cloudy' },
    3: { day: 'Overcast', night: 'Overcast' },
    45: { day: 'Fog', night: 'Fog' },
    48: { day: 'Depositing rime fog', night: 'Depositing rime fog' },
    51: { day: 'Light drizzle', night: 'Light drizzle' },
    53: { day: 'Moderate drizzle', night: 'Moderate drizzle' },
    55: { day: 'Dense drizzle', night: 'Dense drizzle' },
    61: { day: 'Slight rain', night: 'Slight rain' },
    63: { day: 'Moderate rain', night: 'Moderate rain' },
    65: { day: 'Heavy rain', night: 'Heavy rain' },
    80: { day: 'Slight rain showers', night: 'Slight rain showers' },
    81: { day: 'Moderate rain showers', night: 'Moderate rain showers' },
    82: { day: 'Violent rain showers', night: 'Violent rain showers' },
    95: { day: 'Thunderstorm', night: 'Thunderstorm' },
  };

  const weather = weatherDescriptions[weatherCode] || { day: 'Unknown', night: 'Unknown' };
  return isDay ? weather.day : weather.night;
};

const getWeatherIcon = (weatherCode: number, isDay: number): string => {
  if (weatherCode === 0 || weatherCode === 1) {
    return isDay ? 'status-positive' : 'status-info';
  }
  if (weatherCode === 2 || weatherCode === 3) {
    return 'status-warning';
  }
  if (weatherCode >= 45 && weatherCode <= 48) {
    return 'status-in-progress';
  }
  if (weatherCode >= 51 && weatherCode <= 82) {
    return 'status-negative';
  }
  if (weatherCode >= 95) {
    return 'notification';
  }
  return 'status-info';
};

const getWindDirection = (degrees: number): string => {
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
  return directions[Math.round(degrees / 22.5) % 16];
};

export function CurrentWeatherWidget({ current }: CurrentWeatherProps) {
  const weatherDescription = getWeatherDescription(current.weather_code, current.is_day);
  const weatherIcon = getWeatherIcon(current.weather_code, current.is_day);
  const windDirection = getWindDirection(current.wind_direction_10m);

  return (
    <Container header={<Header variant="h3">Current Weather</Header>}>
      <SpaceBetween size="m">
        <Box textAlign="center">
          <Icon name={weatherIcon} size="large" />
          <Box variant="h1" fontSize="display-l" padding={{ top: 's' }}>
            {Math.round(current.temperature_2m)}°C
          </Box>
          <Box variant="h3" color="text-status-inactive">
            {weatherDescription}
          </Box>
        </Box>

        <SpaceBetween size="s">
          <Box>
            <Box variant="small" color="text-status-inactive">
              Feels like
            </Box>
            <Box variant="h4">{Math.round(current.temperature_2m)}°C</Box>
          </Box>

          <Box>
            <Box variant="small" color="text-status-inactive">
              Humidity
            </Box>
            <Box variant="h4">{current.relative_humidity_2m}%</Box>
          </Box>

          <Box>
            <Box variant="small" color="text-status-inactive">
              Wind
            </Box>
            <Box variant="h4">
              {Math.round(current.wind_speed_10m)} km/h {windDirection}
            </Box>
          </Box>
        </SpaceBetween>
      </SpaceBetween>
    </Container>
  );
}
