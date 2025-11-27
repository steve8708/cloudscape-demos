// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';

import { WeatherData, WeatherAPI } from '../services/weather-api';
import { WeatherDetailsGrid } from './weather-details-grid';

interface CurrentWeatherCardProps {
  weatherData: WeatherData;
}

export function CurrentWeatherCard({ weatherData }: CurrentWeatherCardProps) {
  const current = weatherData.current;
  const weatherDescription = WeatherAPI.getWeatherDescription(current.weather_code);

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

        <WeatherDetailsGrid current={current} />
      </SpaceBetween>
    </Container>
  );
}
