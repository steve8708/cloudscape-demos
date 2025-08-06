// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';
import ColumnLayout from '@cloudscape-design/components/column-layout';

import { WeatherData, WeatherAPI } from '../services/weather-api';

interface CurrentWeatherCardProps {
  weatherData: WeatherData;
}

export function CurrentWeatherCard({ weatherData }: CurrentWeatherCardProps) {
  const current = weatherData.current;
  const weatherDescription = WeatherAPI.getWeatherDescription(current.weather_code);
  const windDirection = WeatherAPI.getWindDirection(current.wind_direction_10m);

  return (
    <Container>
      <Header variant="h2">Current Weather</Header>
      <SpaceBetween size="m">
        <Box textAlign="center">
          <Box fontSize="display-l" fontWeight="bold">
            {Math.round(current.temperature_2m)}°C
          </Box>
          <Box variant="h3" color="text-status-info">
            {weatherDescription}
          </Box>
          <Box variant="small">Feels like {Math.round(current.apparent_temperature)}°C</Box>
        </Box>

        <ColumnLayout columns={2} variant="text-grid">
          <div>
            <Box variant="awsui-key-label">Humidity</Box>
            <Box>{current.relative_humidity_2m}%</Box>
          </div>
          <div>
            <Box variant="awsui-key-label">Pressure</Box>
            <Box>{Math.round(current.surface_pressure)} hPa</Box>
          </div>
          <div>
            <Box variant="awsui-key-label">Wind Speed</Box>
            <Box>{Math.round(current.wind_speed_10m)} km/h</Box>
          </div>
          <div>
            <Box variant="awsui-key-label">Wind Direction</Box>
            <Box>
              {windDirection} ({Math.round(current.wind_direction_10m)}°)
            </Box>
          </div>
          <div>
            <Box variant="awsui-key-label">Precipitation</Box>
            <Box>{current.precipitation} mm</Box>
          </div>
          <div>
            <Box variant="awsui-key-label">Updated</Box>
            <Box variant="small">
              {new Date(current.time).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Box>
          </div>
        </ColumnLayout>
      </SpaceBetween>
    </Container>
  );
}
