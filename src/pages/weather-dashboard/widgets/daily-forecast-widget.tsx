// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Cards from '@cloudscape-design/components/cards';
import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';
import ColumnLayout from '@cloudscape-design/components/column-layout';

import { DailyWeather, weatherAPI } from '../services/weather-api';
import { useTemperatureUnit } from '../context/temperature-unit-context';

interface DailyForecastWidgetProps {
  data: DailyWeather;
}

export function DailyForecastWidget({ data }: DailyForecastWidgetProps) {
  const { convertTemperature, getUnitSymbol } = useTemperatureUnit();

  const cardItems = data.time.slice(0, 7).map((time, index) => {
    const weatherInfo = weatherAPI.getWeatherDescription(data.weatherCode[index]);
    const date = new Date(time);
    const dayName = date.toLocaleDateString([], { weekday: 'short' });
    const monthDay = date.toLocaleDateString([], { month: 'short', day: 'numeric' });

    return {
      id: index,
      dayName,
      monthDay,
      weather: weatherInfo,
      tempMax: Math.round(convertTemperature(data.temperatureMax[index])),
      tempMin: Math.round(convertTemperature(data.temperatureMin[index])),
      precipitation: data.precipitationSum[index],
      windSpeed: Math.round(data.windSpeedMax[index]),
      sunrise: new Date(data.sunrise[index]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sunset: new Date(data.sunset[index]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  });

  return (
    <Container
      header={
        <Header description="7-day weather forecast">
          Daily Forecast
        </Header>
      }
    >
      <div style={{ overflowX: 'auto', paddingBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '16px', minWidth: 'max-content' }}>
          {cardItems.map((item) => (
            <div
              key={item.id}
              style={{
                minWidth: '200px',
                maxWidth: '200px',
                border: '1px solid #e0e5e8',
                borderRadius: '8px',
                padding: '16px',
                backgroundColor: '#ffffff',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              }}
            >
              <SpaceBetween direction="vertical" size="s">
                <div style={{ textAlign: 'center' }}>
                  <Box variant="h3">{item.dayName}</Box>
                  <Box variant="small" color="text-body-secondary">{item.monthDay}</Box>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>{item.weather.icon}</div>
                  <Box variant="small">{item.weather.description}</Box>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <Box fontSize="heading-m">
                    <span style={{ fontWeight: 'bold' }}>{item.tempMax}{getUnitSymbol()}</span>
                    <span style={{ color: '#687078', marginLeft: '8px' }}>{item.tempMin}{getUnitSymbol()}</span>
                  </Box>
                </div>

                <ColumnLayout columns={2} variant="text-grid">
                  <div>
                    <Box variant="awsui-key-label">Precip</Box>
                    <Box fontSize="body-s">{item.precipitation}mm</Box>
                  </div>
                  <div>
                    <Box variant="awsui-key-label">Wind</Box>
                    <Box fontSize="body-s">{item.windSpeed}km/h</Box>
                  </div>
                  <div>
                    <Box variant="awsui-key-label">Sunrise</Box>
                    <Box fontSize="body-s">{item.sunrise}</Box>
                  </div>
                  <div>
                    <Box variant="awsui-key-label">Sunset</Box>
                    <Box fontSize="body-s">{item.sunset}</Box>
                  </div>
                </ColumnLayout>
              </SpaceBetween>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}
