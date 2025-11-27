// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';

import { CurrentWeather, WeatherAPI } from '../services/weather-api';

interface WeatherDetailsGridProps {
  current: CurrentWeather;
}

export function WeatherDetailsGrid({ current }: WeatherDetailsGridProps) {
  const windDirection = WeatherAPI.getWindDirection(current.wind_direction_10m);

  return (
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
  );
}
