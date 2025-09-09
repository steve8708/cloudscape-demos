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

interface DailyForecastWidgetProps {
  data: DailyWeather;
}

export function DailyForecastWidget({ data }: DailyForecastWidgetProps) {
  const cardItems = data.time.slice(0, 5).map((time, index) => {
    const weatherInfo = weatherAPI.getWeatherDescription(data.weatherCode[index]);
    const date = new Date(time);
    const dayName = date.toLocaleDateString([], { weekday: 'short' });
    const monthDay = date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    
    return {
      id: index,
      dayName,
      monthDay,
      weather: weatherInfo,
      tempMax: Math.round(data.temperatureMax[index]),
      tempMin: Math.round(data.temperatureMin[index]),
      precipitation: data.precipitationSum[index],
      windSpeed: Math.round(data.windSpeedMax[index]),
      sunrise: new Date(data.sunrise[index]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sunset: new Date(data.sunset[index]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  });

  return (
    <Container
      header={
        <Header description="5-day weather forecast">
          Daily Forecast
        </Header>
      }
    >
      <Cards
        ariaLabels={{
          itemSelectionLabel: (e, n) => `select ${n.dayName}`,
          selectionGroupLabel: 'Daily forecast selection',
        }}
        cardDefinition={{
          header: item => (
            <SpaceBetween direction="vertical" size="xs">
              <Box variant="h3">{item.dayName}</Box>
              <Box variant="small" color="text-body-secondary">{item.monthDay}</Box>
            </SpaceBetween>
          ),
          sections: [
            {
              id: 'weather',
              content: item => (
                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '8px' }}>{item.weather.icon}</div>
                  <Box variant="small">{item.weather.description}</Box>
                </div>
              ),
            },
            {
              id: 'temperature',
              content: item => (
                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                  <Box fontSize="heading-l">
                    <span style={{ fontWeight: 'bold' }}>{item.tempMax}°</span>
                    <span style={{ color: '#687078', marginLeft: '8px' }}>{item.tempMin}°</span>
                  </Box>
                </div>
              ),
            },
            {
              id: 'details',
              content: item => (
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
              ),
            },
          ],
        }}
        cardsPerRow={[
          { cards: 1, minWidth: 0 },
          { cards: 2, minWidth: 500 },
          { cards: 3, minWidth: 800 },
          { cards: 5, minWidth: 1200 },
        ]}
        items={cardItems}
        trackBy="id"
        visibleSections={['weather', 'temperature', 'details']}
      />
    </Container>
  );
}
