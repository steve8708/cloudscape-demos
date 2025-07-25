// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import Container from '@cloudscape-design/components/container';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Grid from '@cloudscape-design/components/grid';
import Box from '@cloudscape-design/components/box';
import Badge from '@cloudscape-design/components/badge';
import ColumnLayout from '@cloudscape-design/components/column-layout';

interface CurrentWeatherData {
  time: string;
  temperature_2m: number;
  relative_humidity_2m: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  weather_code: number;
  apparent_temperature: number;
  precipitation: number;
  pressure_msl: number;
  visibility: number;
  uv_index: number;
}

interface CurrentWeatherUnits {
  temperature_2m: string;
  relative_humidity_2m: string;
  wind_speed_10m: string;
  wind_direction_10m: string;
  apparent_temperature: string;
  precipitation: string;
  pressure_msl: string;
  visibility: string;
  uv_index: string;
}

interface CurrentWeatherProps {
  currentWeather: CurrentWeatherData;
  units: CurrentWeatherUnits;
  locationName: string;
}

const weatherCodeDescriptions: Record<number, { description: string; icon: string }> = {
  0: { description: 'Clear sky', icon: '☀️' },
  1: { description: 'Mainly clear', icon: '🌤️' },
  2: { description: 'Partly cloudy', icon: '⛅' },
  3: { description: 'Overcast', icon: '☁️' },
  45: { description: 'Fog', icon: '🌫️' },
  48: { description: 'Depositing rime fog', icon: '🌫️' },
  51: { description: 'Light drizzle', icon: '🌦️' },
  53: { description: 'Moderate drizzle', icon: '🌦️' },
  55: { description: 'Dense drizzle', icon: '🌦️' },
  61: { description: 'Slight rain', icon: '🌧️' },
  63: { description: 'Moderate rain', icon: '🌧️' },
  65: { description: 'Heavy rain', icon: '🌧️' },
  71: { description: 'Slight snow', icon: '🌨️' },
  73: { description: 'Moderate snow', icon: '🌨️' },
  75: { description: 'Heavy snow', icon: '❄️' },
  77: { description: 'Snow grains', icon: '🌨️' },
  80: { description: 'Slight rain showers', icon: '🌦️' },
  81: { description: 'Moderate rain showers', icon: '🌦️' },
  82: { description: 'Violent rain showers', icon: '⛈️' },
  85: { description: 'Slight snow showers', icon: '🌨️' },
  86: { description: 'Heavy snow showers', icon: '❄️' },
  95: { description: 'Thunderstorm', icon: '⛈️' },
  96: { description: 'Thunderstorm with slight hail', icon: '⛈️' },
  99: { description: 'Thunderstorm with heavy hail', icon: '⛈️' },
};

const getWeatherInfo = (code: number) => {
  return weatherCodeDescriptions[code] || { description: 'Unknown', icon: '❓' };
};

export default function CurrentWeather({ currentWeather, units, locationName }: CurrentWeatherProps) {
  return (
    <Container>
      <SpaceBetween size="m">
        <Box variant="h2">Current Weather - {locationName}</Box>
        <Grid gridDefinition={[{ colspan: 4 }, { colspan: 4 }, { colspan: 4 }]}>
          <Box textAlign="center">
            <Box fontSize="display-l" color="text-status-info">
              {getWeatherInfo(currentWeather.weather_code).icon}
            </Box>
            <Box variant="h1" color="text-status-info">
              {currentWeather.temperature_2m}°{units.temperature_2m}
            </Box>
            <Box variant="p">{getWeatherInfo(currentWeather.weather_code).description}</Box>
            <Box variant="small" color="text-body-secondary">
              Feels like {currentWeather.apparent_temperature}°{units.apparent_temperature}
            </Box>
          </Box>

          <ColumnLayout columns={2} variant="text-grid">
            <Box>
              <Badge color="blue">Humidity</Badge>
              <Box variant="h3">{currentWeather.relative_humidity_2m}%</Box>
            </Box>
            <Box>
              <Badge color="green">Wind Speed</Badge>
              <Box variant="h3">
                {currentWeather.wind_speed_10m} {units.wind_speed_10m}
              </Box>
            </Box>
            <Box>
              <Badge color="red">Pressure</Badge>
              <Box variant="h3">
                {currentWeather.pressure_msl} {units.pressure_msl}
              </Box>
            </Box>
            <Box>
              <Badge color="grey">UV Index</Badge>
              <Box variant="h3">{currentWeather.uv_index}</Box>
            </Box>
          </ColumnLayout>

          <ColumnLayout columns={2} variant="text-grid">
            <Box>
              <Badge color="grey">Wind Direction</Badge>
              <Box variant="h3">{currentWeather.wind_direction_10m}°</Box>
            </Box>
            <Box>
              <Badge color="blue">Visibility</Badge>
              <Box variant="h3">
                {currentWeather.visibility} {units.visibility}
              </Box>
            </Box>
            <Box>
              <Badge color="red">Precipitation</Badge>
              <Box variant="h3">
                {currentWeather.precipitation} {units.precipitation}
              </Box>
            </Box>
            <Box>
              <Badge color="green">Last Updated</Badge>
              <Box variant="small">{new Date(currentWeather.time).toLocaleString()}</Box>
            </Box>
          </ColumnLayout>
        </Grid>
      </SpaceBetween>
    </Container>
  );
}
