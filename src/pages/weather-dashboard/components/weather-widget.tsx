// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';

interface WeatherWidgetProps {
  city: string;
  data: {
    temperature: number;
    windSpeed: number;
    weatherCode: number;
    humidity: number;
    precipitation: number;
  };
}

const weatherCodeMap: Record<number, string> = {
  0: '☀️ Clear sky',
  1: '🌤️ Mainly clear',
  2: '⛅ Partly cloudy',
  3: '☁️ Overcast',
  45: '🌫️ Foggy',
  48: '🌫️ Depositing rime fog',
  51: '🌦️ Light drizzle',
  53: '🌦️ Moderate drizzle',
  55: '🌧️ Dense drizzle',
  61: '🌧️ Slight rain',
  63: '🌧️ Moderate rain',
  65: '🌧️ Heavy rain',
  71: '🌨️ Slight snow',
  73: '🌨️ Moderate snow',
  75: '❄️ Heavy snow',
  77: '🌨️ Snow grains',
  80: '🌦️ Slight rain showers',
  81: '🌧️ Moderate rain showers',
  82: '⛈️ Violent rain showers',
  85: '🌨️ Slight snow showers',
  86: '❄️ Heavy snow showers',
  95: '⛈️ Thunderstorm',
  96: '⛈️ Thunderstorm with hail',
  99: '⛈️ Severe thunderstorm',
};

export function WeatherWidget({ city, data }: WeatherWidgetProps) {
  const weatherDescription = weatherCodeMap[data.weatherCode] || '🌡️ Unknown';

  return (
    <Container header={<Header variant="h2">Current Weather - {city}</Header>}>
      <SpaceBetween size="l">
        <Box textAlign="center" fontSize="display-l" fontWeight="bold" padding="l">
          {data.temperature.toFixed(1)}°C
        </Box>

        <Box textAlign="center" fontSize="heading-l" padding="xs">
          {weatherDescription}
        </Box>

        <ColumnLayout columns={2} variant="text-grid">
          <div>
            <Box variant="awsui-key-label">Wind Speed</Box>
            <Box fontSize="heading-m">{data.windSpeed.toFixed(1)} km/h</Box>
          </div>
          <div>
            <Box variant="awsui-key-label">Humidity</Box>
            <Box fontSize="heading-m">{data.humidity}%</Box>
          </div>
          <div>
            <Box variant="awsui-key-label">Precipitation</Box>
            <Box fontSize="heading-m">{data.precipitation.toFixed(1)} mm</Box>
          </div>
          <div>
            <Box variant="awsui-key-label">Condition</Box>
            <Box fontSize="heading-m">
              {data.weatherCode === 0 ? 'Clear' : data.weatherCode < 50 ? 'Cloudy' : 'Rainy'}
            </Box>
          </div>
        </ColumnLayout>
      </SpaceBetween>
    </Container>
  );
}
