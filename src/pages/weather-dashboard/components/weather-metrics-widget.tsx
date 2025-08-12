// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Box from '@cloudscape-design/components/box';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import ProgressBar from '@cloudscape-design/components/progress-bar';

interface WeatherMetricsProps {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    weather_code: number;
    is_day: number;
  };
}

export function WeatherMetricsWidget({ current }: WeatherMetricsProps) {
  const getTemperatureStatus = (temp: number): 'success' | 'warning' | 'error' => {
    if (temp >= 15 && temp <= 25) return 'success';
    if (temp >= 5 && temp <= 35) return 'warning';
    return 'error';
  };

  const getHumidityStatus = (humidity: number): 'success' | 'warning' | 'error' => {
    if (humidity >= 30 && humidity <= 70) return 'success';
    if (humidity >= 20 && humidity <= 80) return 'warning';
    return 'error';
  };

  const getWindStatus = (speed: number): 'success' | 'warning' | 'error' => {
    if (speed <= 20) return 'success';
    if (speed <= 40) return 'warning';
    return 'error';
  };

  const temperaturePercent = Math.min(Math.max((current.temperature_2m + 20) / 60 * 100, 0), 100);
  const humidityPercent = current.relative_humidity_2m;
  const windPercent = Math.min(current.wind_speed_10m / 50 * 100, 100);

  return (
    <Container header={<Header variant="h3">Weather Metrics</Header>}>
      <SpaceBetween size="l">
        <div>
          <Box variant="awsui-key-label">Temperature</Box>
          <ProgressBar
            value={temperaturePercent}
            additionalInfo={`${Math.round(current.temperature_2m)}°C`}
            description="Current temperature reading"
            status={getTemperatureStatus(current.temperature_2m)}
          />
        </div>

        <div>
          <Box variant="awsui-key-label">Humidity</Box>
          <ProgressBar
            value={humidityPercent}
            additionalInfo={`${current.relative_humidity_2m}%`}
            description="Relative humidity level"
            status={getHumidityStatus(current.relative_humidity_2m)}
          />
        </div>

        <div>
          <Box variant="awsui-key-label">Wind Speed</Box>
          <ProgressBar
            value={windPercent}
            additionalInfo={`${Math.round(current.wind_speed_10m)} km/h`}
            description="Current wind speed"
            status={getWindStatus(current.wind_speed_10m)}
          />
        </div>

        <SpaceBetween size="s">
          <Box>
            <Box variant="small" color="text-status-inactive">Time of Day</Box>
            <Box variant="h4">{current.is_day ? 'Day' : 'Night'}</Box>
          </Box>
          
          <Box>
            <Box variant="small" color="text-status-inactive">Wind Direction</Box>
            <Box variant="h4">{Math.round(current.wind_direction_10m)}°</Box>
          </Box>
        </SpaceBetween>
      </SpaceBetween>
    </Container>
  );
}
