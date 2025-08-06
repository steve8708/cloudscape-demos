// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import StatusIndicator from '@cloudscape-design/components/status-indicator';

import { CurrentWeather } from '../../services/weather-service';

interface CurrentWeatherWidgetProps {
  weather: CurrentWeather;
  location: string;
  weatherDescription: string;
}

export function CurrentWeatherWidget({ weather, location, weatherDescription }: CurrentWeatherWidgetProps) {
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
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  };

  const getTemperatureColor = (temp: number): 'success' | 'warning' | 'error' => {
    if (temp < 0) return 'error';
    if (temp < 20) return 'warning';
    return 'success';
  };

  return (
    <Container
      header={
        <Header variant="h2" description={`Current conditions in ${location}`}>
          Current Weather
        </Header>
      }
    >
      <SpaceBetween size="l">
        <ColumnLayout columns={2} variant="text-grid">
          <div>
            <Box variant="h1" fontSize="display-l" color="text-status-success">
              {weather.temperature_2m.toFixed(1)}°C
            </Box>
            <Box variant="h3" color="text-status-subdued">
              {weatherDescription}
            </Box>
            <Box variant="small" color="text-status-subdued">
              Feels like current temperature
            </Box>
          </div>
          <div>
            <SpaceBetween size="s">
              <Box>
                <StatusIndicator type={getTemperatureColor(weather.temperature_2m)}>
                  Temperature: {weather.temperature_2m.toFixed(1)}°C
                </StatusIndicator>
              </Box>
              <Box>
                <StatusIndicator type="info">Humidity: {weather.relative_humidity_2m}%</StatusIndicator>
              </Box>
              <Box>
                <StatusIndicator type="info">
                  Wind: {weather.wind_speed_10m.toFixed(1)} km/h {getWindDirection(weather.wind_direction_10m)}
                </StatusIndicator>
              </Box>
            </SpaceBetween>
          </div>
        </ColumnLayout>

        <ColumnLayout columns={3}>
          <Container>
            <Box variant="h3" textAlign="center">
              {weather.relative_humidity_2m}%
            </Box>
            <Box variant="small" textAlign="center" color="text-status-subdued">
              Humidity
            </Box>
          </Container>
          <Container>
            <Box variant="h3" textAlign="center">
              {weather.wind_speed_10m.toFixed(1)} km/h
            </Box>
            <Box variant="small" textAlign="center" color="text-status-subdued">
              Wind Speed
            </Box>
          </Container>
          <Container>
            <Box variant="h3" textAlign="center">
              {getWindDirection(weather.wind_direction_10m)}
            </Box>
            <Box variant="small" textAlign="center" color="text-status-subdued">
              Wind Direction
            </Box>
          </Container>
        </ColumnLayout>
      </SpaceBetween>
    </Container>
  );
}
