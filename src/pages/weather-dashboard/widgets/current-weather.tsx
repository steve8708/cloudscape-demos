// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import Spinner from '@cloudscape-design/components/spinner';

import { WeatherData, Location, weatherApi } from '../services/weather-api';
import { HorizontalForecast } from './horizontal-forecast';

interface CurrentWeatherWidgetProps {
  weatherData: WeatherData | null;
  loading: boolean;
  location: Location;
}

export function CurrentWeatherWidget({ weatherData, loading, location }: CurrentWeatherWidgetProps) {
  if (loading) {
    return (
      <Container>
        <Box textAlign="center" padding={{ vertical: 'xl' }}>
          <Spinner size="big" />
          <Box variant="p" margin={{ top: 's' }}>
            Loading current weather conditions...
          </Box>
        </Box>
      </Container>
    );
  }

  if (!weatherData?.current) {
    return (
      <Container>
        <Box textAlign="center" padding={{ vertical: 'xl' }}>
          <StatusIndicator type="error">Unable to load weather data</StatusIndicator>
        </Box>
      </Container>
    );
  }

  const { current } = weatherData;
  const weatherDescription = weatherApi.getWeatherDescription(current.weather_code);
  const temperature = weatherApi.formatTemperature(current.temperature_2m);
  const windSpeed = weatherApi.formatWindSpeed(current.wind_speed_10m);
  const windDirection = weatherApi.formatWindDirection(current.wind_direction_10m);

  return (
    <SpaceBetween size="l">
      <ColumnLayout columns={4} variant="text-grid">
        <div>
          <Box variant="awsui-key-label">Temperature</Box>
          <Box variant="h1" color="text-status-info">
            {temperature}
          </Box>
          <Box variant="small" color="text-status-inactive">
            {weatherDescription}
          </Box>
        </div>

        <div>
          <Box variant="awsui-key-label">Humidity</Box>
          <Box variant="h2">{current.relative_humidity_2m}%</Box>
          <Box variant="small" color="text-status-inactive">
            Relative humidity
          </Box>
        </div>

        <div>
          <Box variant="awsui-key-label">Wind</Box>
          <Box variant="h2">{windSpeed}</Box>
          <Box variant="small" color="text-status-inactive">
            {windDirection} direction
          </Box>
        </div>

        <div>
          <Box variant="awsui-key-label">Precipitation</Box>
          <Box variant="h2">{current.precipitation} mm</Box>
          <Box variant="small" color="text-status-inactive">
            Current rainfall
          </Box>
        </div>
      </ColumnLayout>

      <div>
        <Box variant="h3" margin={{ bottom: 's' }}>
          7-Day Forecast
        </Box>
        <HorizontalForecast weatherData={weatherData} loading={loading} />
      </div>
    </SpaceBetween>
  );
}
