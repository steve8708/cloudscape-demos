// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import Cards from '@cloudscape-design/components/cards';
import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { DailyWeatherData } from '../types';
import { formatDate, formatTemperature, getWeatherIcon, getWeatherDescription, formatTime } from '../utils';

interface ForecastCardsProps {
  dailyData: DailyWeatherData;
}

export default function ForecastCards({ dailyData }: ForecastCardsProps) {
  const forecastItems = dailyData.time.map((time, index) => ({
    date: time,
    formattedDate: formatDate(time),
    weatherCode: dailyData.weathercode[index],
    maxTemp: dailyData.temperature_2m_max[index],
    minTemp: dailyData.temperature_2m_min[index],
    precipitation: dailyData.precipitation_sum[index],
    windSpeed: dailyData.windspeed_10m_max[index],
    sunrise: dailyData.sunrise[index],
    sunset: dailyData.sunset[index],
  }));

  return (
    <Cards
      cardDefinition={{
        header: item => (
          <Box fontSize="heading-m" fontWeight="bold">
            {item.formattedDate}
          </Box>
        ),
        sections: [
          {
            id: 'weather',
            content: item => (
              <SpaceBetween size="xs" direction="vertical">
                <Box textAlign="center" fontSize="display-l" padding={{ vertical: 's' }}>
                  {getWeatherIcon(item.weatherCode)}
                </Box>
                <Box textAlign="center" fontSize="body-m" color="text-body-secondary">
                  {getWeatherDescription(item.weatherCode)}
                </Box>
              </SpaceBetween>
            ),
          },
          {
            id: 'temperature',
            content: item => (
              <SpaceBetween size="xs" direction="vertical">
                <Box>
                  <strong>High:</strong> {formatTemperature(item.maxTemp)}
                </Box>
                <Box>
                  <strong>Low:</strong> {formatTemperature(item.minTemp)}
                </Box>
              </SpaceBetween>
            ),
          },
          {
            id: 'details',
            content: item => (
              <SpaceBetween size="xs" direction="vertical">
                <Box>
                  <strong>Rain:</strong> {item.precipitation.toFixed(1)} mm
                </Box>
                <Box>
                  <strong>Wind:</strong> {Math.round(item.windSpeed)} km/h
                </Box>
                <Box fontSize="body-s" color="text-body-secondary">
                  <strong>Sunrise:</strong> {formatTime(item.sunrise)}
                </Box>
                <Box fontSize="body-s" color="text-body-secondary">
                  <strong>Sunset:</strong> {formatTime(item.sunset)}
                </Box>
              </SpaceBetween>
            ),
          },
        ],
      }}
      cardsPerRow={[
        { cards: 1, minWidth: 0 },
        { cards: 2, minWidth: 500 },
        { cards: 3, minWidth: 800 },
        { cards: 4, minWidth: 1000 },
        { cards: 7, minWidth: 1400 },
      ]}
      items={forecastItems}
      loadingText="Loading forecast"
      trackBy="date"
      visibleSections={['weather', 'temperature', 'details']}
      empty={
        <Box textAlign="center" color="inherit">
          <b>No forecast data</b>
        </Box>
      }
    />
  );
}
