// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Icon from '@cloudscape-design/components/icon';

import { Location, WeatherData } from '../types';
import {
  getWeatherInfo,
  formatTemperature,
  formatWindSpeed,
  getWindDirection,
} from '../weather-utils';

interface CurrentWeatherProps {
  weatherData: WeatherData;
  location: Location;
}

export function CurrentWeather({ weatherData, location }: CurrentWeatherProps) {
  const { current_weather } = weatherData;
  const weatherInfo = getWeatherInfo(current_weather.weathercode);

  return (
    <Container
      header={
        <Header variant="h2" description={`${location.name}, ${location.country}`}>
          Current Weather
        </Header>
      }
    >
      <ColumnLayout columns={4} variant="text-grid">
        <SpaceBetween size="xs">
          <Box variant="awsui-key-label">Temperature</Box>
          <Box fontSize="display-l" fontWeight="bold">
            {formatTemperature(current_weather.temperature)}
          </Box>
        </SpaceBetween>

        <SpaceBetween size="xs">
          <Box variant="awsui-key-label">Conditions</Box>
          <SpaceBetween size="xxs" direction="horizontal" alignItems="center">
            <Icon name={weatherInfo.icon} size="large" />
            <Box fontSize="heading-m">{weatherInfo.description}</Box>
          </SpaceBetween>
        </SpaceBetween>

        <SpaceBetween size="xs">
          <Box variant="awsui-key-label">Wind</Box>
          <Box fontSize="heading-m">
            {formatWindSpeed(current_weather.windspeed)}
            <Box variant="small" color="text-body-secondary" display="inline" margin={{ left: 'xs' }}>
              {getWindDirection(current_weather.winddirection)}
            </Box>
          </Box>
        </SpaceBetween>

        <SpaceBetween size="xs">
          <Box variant="awsui-key-label">Location</Box>
          <Box fontSize="heading-s">
            Lat: {location.latitude.toFixed(2)}°
            <br />
            Lon: {location.longitude.toFixed(2)}°
          </Box>
        </SpaceBetween>
      </ColumnLayout>
    </Container>
  );
}
