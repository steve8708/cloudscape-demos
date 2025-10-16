// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Box from '@cloudscape-design/components/box';
import Cards from '@cloudscape-design/components/cards';

import { getWeatherIcon, getWeatherDescription, formatTemperature, formatDate, getWindDirection } from '../utils';

interface WeatherForecastProps {
  currentWeather: {
    temperature: number;
    weatherCode: number;
    windSpeed: number;
    windDirection: number;
    humidity: number;
  };
  dailyForecast: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weathercode: number[];
    precipitation_sum: number[];
    windspeed_10m_max: number[];
    sunrise: string[];
    sunset: string[];
  };
  location: {
    name: string;
    country: string;
    admin1?: string;
  };
}

export function WeatherForecast({ currentWeather, dailyForecast, location }: WeatherForecastProps) {
  const forecastItems = dailyForecast.time.map((date, index) => ({
    date,
    tempMax: dailyForecast.temperature_2m_max[index],
    tempMin: dailyForecast.temperature_2m_min[index],
    weatherCode: dailyForecast.weathercode[index],
    precipitation: dailyForecast.precipitation_sum[index],
    windSpeed: dailyForecast.windspeed_10m_max[index],
    sunrise: dailyForecast.sunrise[index],
    sunset: dailyForecast.sunset[index],
  }));

  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header variant="h2" description="Real-time weather conditions">
            Current Weather
          </Header>
        }
      >
        <ColumnLayout columns={5} variant="text-grid">
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '64px', margin: '10px 0' }}>
              {getWeatherIcon(currentWeather.weatherCode)}
            </div>
            <Box variant="h1" fontSize="display-l">
              {formatTemperature(currentWeather.temperature)}
            </Box>
            <Box variant="p" color="text-body-secondary">
              {getWeatherDescription(currentWeather.weatherCode)}
            </Box>
          </div>

          <SpaceBetween size="xs">
            <Box variant="awsui-key-label">Wind Speed</Box>
            <Box variant="h3">{currentWeather.windSpeed.toFixed(1)} km/h</Box>
            <Box variant="small" color="text-body-secondary">
              Direction: {getWindDirection(currentWeather.windDirection)}
            </Box>
          </SpaceBetween>

          <SpaceBetween size="xs">
            <Box variant="awsui-key-label">Humidity</Box>
            <Box variant="h3">{currentWeather.humidity}%</Box>
            <Box variant="small" color="text-body-secondary">
              Relative humidity
            </Box>
          </SpaceBetween>

          <SpaceBetween size="xs">
            <Box variant="awsui-key-label">Today's High</Box>
            <Box variant="h3">{formatTemperature(dailyForecast.temperature_2m_max[0])}</Box>
            <Box variant="small" color="text-body-secondary">
              Low: {formatTemperature(dailyForecast.temperature_2m_min[0])}
            </Box>
          </SpaceBetween>

          <SpaceBetween size="xs">
            <Box variant="awsui-key-label">Precipitation</Box>
            <Box variant="h3">{dailyForecast.precipitation_sum[0].toFixed(1)} mm</Box>
            <Box variant="small" color="text-body-secondary">
              Today's total
            </Box>
          </SpaceBetween>
        </ColumnLayout>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Extended forecast for the next 7 days">
            7-Day Forecast
          </Header>
        }
      >
        <Cards
          cardDefinition={{
            header: item => (
              <div style={{ textAlign: 'center' }}>
                <Box variant="h3">{formatDate(item.date)}</Box>
              </div>
            ),
            sections: [
              {
                id: 'icon',
                content: item => (
                  <div style={{ textAlign: 'center', fontSize: '48px', margin: '10px 0' }}>
                    {getWeatherIcon(item.weatherCode)}
                  </div>
                ),
              },
              {
                id: 'description',
                content: item => (
                  <div style={{ textAlign: 'center' }}>
                    <Box variant="p">{getWeatherDescription(item.weatherCode)}</Box>
                  </div>
                ),
              },
              {
                id: 'temperature',
                content: item => (
                  <div style={{ textAlign: 'center' }}>
                    <Box variant="h4">
                      {formatTemperature(item.tempMax)} / {formatTemperature(item.tempMin)}
                    </Box>
                  </div>
                ),
              },
              {
                id: 'details',
                content: item => (
                  <SpaceBetween size="xxs">
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Box variant="small" color="text-body-secondary">💧 Precipitation</Box>
                      <Box variant="small">{item.precipitation.toFixed(1)} mm</Box>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Box variant="small" color="text-body-secondary">💨 Wind</Box>
                      <Box variant="small">{item.windSpeed.toFixed(1)} km/h</Box>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Box variant="small" color="text-body-secondary">🌅 Sunrise</Box>
                      <Box variant="small">{new Date(item.sunrise).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}</Box>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Box variant="small" color="text-body-secondary">🌇 Sunset</Box>
                      <Box variant="small">{new Date(item.sunset).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}</Box>
                    </div>
                  </SpaceBetween>
                ),
              },
            ],
          }}
          cardsPerRow={[
            { cards: 1, minWidth: 0 },
            { cards: 3, minWidth: 600 },
            { cards: 5, minWidth: 900 },
            { cards: 7, minWidth: 1200 },
          ]}
          items={forecastItems}
          trackBy="date"
          visibleSections={['icon', 'description', 'temperature', 'details']}
        />
      </Container>
    </SpaceBetween>
  );
}
