// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import SpaceBetween from '@cloudscape-design/components/space-between';
import StatusIndicator from '@cloudscape-design/components/status-indicator';

interface WeatherData {
  current: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    weather_code: number;
  };
}

interface CurrentWeatherDisplayProps {
  weatherData: WeatherData;
  getWeatherDescription: (code: number) => { description: string; icon: string };
  formatTime: (dateString: string) => string;
}

export function CurrentWeatherDisplay({ weatherData, getWeatherDescription, formatTime }: CurrentWeatherDisplayProps) {
  return (
    <ColumnLayout columns={4} variant="text-grid">
      <SpaceBetween size="xs">
        <Box variant="awsui-key-label">Temperature</Box>
        <Box fontSize="display-l" fontWeight="bold">
          {Math.round(weatherData.current.temperature_2m)}°C
        </Box>
        <Box variant="small" color="text-status-info">
          {getWeatherDescription(weatherData.current.weather_code).icon}{' '}
          {getWeatherDescription(weatherData.current.weather_code).description}
        </Box>
      </SpaceBetween>

      <SpaceBetween size="xs">
        <Box variant="awsui-key-label">Humidity</Box>
        <Box fontSize="heading-l" fontWeight="bold">
          {weatherData.current.relative_humidity_2m}%
        </Box>
      </SpaceBetween>

      <SpaceBetween size="xs">
        <Box variant="awsui-key-label">Wind Speed</Box>
        <Box fontSize="heading-l" fontWeight="bold">
          {Math.round(weatherData.current.wind_speed_10m)} km/h
        </Box>
      </SpaceBetween>

      <SpaceBetween size="xs">
        <Box variant="awsui-key-label">Last Updated</Box>
        <Box fontSize="heading-s">{formatTime(weatherData.current.time)}</Box>
        <StatusIndicator type="success">Live</StatusIndicator>
      </SpaceBetween>
    </ColumnLayout>
  );
}
