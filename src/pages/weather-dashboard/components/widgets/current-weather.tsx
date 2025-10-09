// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Spinner from '@cloudscape-design/components/spinner';

import { useWeatherData } from '../../hooks/use-weather-data';

interface CurrentWeatherProps {
  latitude: number;
  longitude: number;
  locationName: string;
}

function getWeatherDescription(code: number): string {
  const weatherCodes: { [key: number]: string } = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    71: 'Slight snow',
    73: 'Moderate snow',
    75: 'Heavy snow',
    95: 'Thunderstorm',
  };
  return weatherCodes[code] || 'Unknown';
}

export function CurrentWeather({ latitude, longitude, locationName }: CurrentWeatherProps) {
  const { weatherData, loading, error } = useWeatherData(latitude, longitude);

  if (loading) {
    return (
      <Container>
        <Box textAlign="center" padding="xxl">
          <Spinner size="large" />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container header={<Header variant="h2">Current Weather - {locationName}</Header>}>
        <Box color="text-status-error" textAlign="center" padding="m">
          Error loading weather data: {error}
        </Box>
      </Container>
    );
  }

  if (!weatherData) {
    return null;
  }

  return (
    <Container header={<Header variant="h2">Current Weather - {locationName}</Header>}>
      <ColumnLayout columns={3} variant="text-grid">
        <div>
          <Box variant="awsui-key-label">Temperature</Box>
          <Box variant="awsui-value-large">{weatherData.temperature}°C</Box>
        </div>
        <div>
          <Box variant="awsui-key-label">Conditions</Box>
          <Box variant="awsui-value-large">{getWeatherDescription(weatherData.weatherCode)}</Box>
        </div>
        <div>
          <Box variant="awsui-key-label">Humidity</Box>
          <Box variant="awsui-value-large">{weatherData.humidity}%</Box>
        </div>
        <div>
          <Box variant="awsui-key-label">Wind Speed</Box>
          <Box variant="awsui-value-large">{weatherData.windSpeed} km/h</Box>
        </div>
        <div>
          <Box variant="awsui-key-label">Precipitation</Box>
          <Box variant="awsui-value-large">{weatherData.precipitation} mm</Box>
        </div>
        <div>
          <Box variant="awsui-key-label">Cloud Cover</Box>
          <Box variant="awsui-value-large">{weatherData.cloudCover}%</Box>
        </div>
      </ColumnLayout>
    </Container>
  );
}
