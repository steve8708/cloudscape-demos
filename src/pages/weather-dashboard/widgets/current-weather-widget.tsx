// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';

import { CurrentWeather, WeatherLocation, weatherAPI } from '../services/weather-api';
import { useTemperatureUnit } from '../context/temperature-unit-context';

interface CurrentWeatherWidgetProps {
  data: CurrentWeather;
  location: WeatherLocation;
}

export function CurrentWeatherWidget({ data, location }: CurrentWeatherWidgetProps) {
  const { convertTemperature, getUnitSymbol } = useTemperatureUnit();
  const weatherInfo = weatherAPI.getWeatherDescription(data.weatherCode);
  const lastUpdated = new Date(data.time).toLocaleTimeString();

  return (
    <Container
      header={
        <Header description={`Last updated: ${lastUpdated}`}>
          Current Weather - {location.name}
        </Header>
      }
    >
      <SpaceBetween size="l">
        <div style={{ textAlign: 'center' }}>
          <Box fontSize="heading-xl" fontWeight="bold" margin={{ bottom: 's' }}>
            <span style={{ fontSize: '3rem' }}>{Math.round(convertTemperature(data.temperature))}{getUnitSymbol()}</span>
          </Box>
          <Box fontSize="heading-m" color="text-body-secondary">
            <span style={{ fontSize: '2rem', marginRight: '8px' }}>{weatherInfo.icon}</span>
            {weatherInfo.description}
          </Box>
        </div>

        <ColumnLayout columns={2} variant="text-grid">
          <div>
            <Box variant="awsui-key-label">Humidity</Box>
            <Box fontSize="heading-s">{data.humidity}%</Box>
          </div>
          <div>
            <Box variant="awsui-key-label">Pressure</Box>
            <Box fontSize="heading-s">{Math.round(data.pressure)} hPa</Box>
          </div>
          <div>
            <Box variant="awsui-key-label">Wind Speed</Box>
            <Box fontSize="heading-s">{Math.round(data.windSpeed)} km/h</Box>
          </div>
          <div>
            <Box variant="awsui-key-label">Precipitation</Box>
            <Box fontSize="heading-s">{data.precipitation} mm</Box>
          </div>
        </ColumnLayout>
      </SpaceBetween>
    </Container>
  );
}
