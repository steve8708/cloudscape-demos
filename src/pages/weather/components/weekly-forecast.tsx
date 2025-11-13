// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Cards from '@cloudscape-design/components/cards';
import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Icon from '@cloudscape-design/components/icon';
import ProgressBar from '@cloudscape-design/components/progress-bar';

import { WeatherData } from '../types';
import { getWeatherInfo, formatTemperature, formatPrecipitation } from '../weather-utils';

interface WeeklyForecastProps {
  daily: WeatherData['daily'];
  timezone: string;
}

interface DayForecast {
  date: string;
  dayName: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  precipitation: number;
  precipitationProbability: number;
  windSpeed: number;
  uvIndex: number;
}

export function WeeklyForecast({ daily, timezone }: WeeklyForecastProps) {
  const forecast: DayForecast[] = daily.time.slice(0, 7).map((dateStr, index) => {
    const date = new Date(dateStr);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short', timeZone: timezone });

    return {
      date: dateStr,
      dayName,
      weatherCode: daily.weathercode[index],
      tempMax: daily.temperature_2m_max[index],
      tempMin: daily.temperature_2m_min[index],
      precipitation: daily.precipitation_sum[index],
      precipitationProbability: daily.precipitation_probability_max[index],
      windSpeed: daily.windspeed_10m_max[index],
      uvIndex: daily.uv_index_max[index],
    };
  });

  return (
    <Container header={<Header variant="h2">7-Day Forecast</Header>}>
      <Cards
        cardDefinition={{
          header: item => {
            const weatherInfo = getWeatherInfo(item.weatherCode);
            return (
              <SpaceBetween size="xs" direction="horizontal" alignItems="center">
                <Icon name={weatherInfo.icon} size="medium" />
                <Box fontWeight="bold">{item.dayName}</Box>
              </SpaceBetween>
            );
          },
          sections: [
            {
              id: 'date',
              content: item => (
                <Box variant="small" color="text-body-secondary">
                  {new Date(item.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    timeZone: timezone,
                  })}
                </Box>
              ),
            },
            {
              id: 'conditions',
              content: item => {
                const weatherInfo = getWeatherInfo(item.weatherCode);
                return (
                  <Box variant="small" color="text-body-secondary">
                    {weatherInfo.description}
                  </Box>
                );
              },
            },
            {
              id: 'temperature',
              header: 'Temperature',
              content: item => (
                <Box>
                  <Box display="inline" fontWeight="bold">
                    {formatTemperature(item.tempMax)}
                  </Box>
                  {' / '}
                  <Box display="inline" color="text-body-secondary">
                    {formatTemperature(item.tempMin)}
                  </Box>
                </Box>
              ),
            },
            {
              id: 'precipitation',
              header: 'Precipitation',
              content: item => (
                <SpaceBetween size="xs">
                  <Box>{formatPrecipitation(item.precipitation)}</Box>
                  <ProgressBar
                    value={item.precipitationProbability}
                    variant="standalone"
                    label={`${Math.round(item.precipitationProbability)}% chance`}
                    description="Probability"
                    additionalInfo=""
                  />
                </SpaceBetween>
              ),
            },
            {
              id: 'details',
              header: 'Details',
              content: item => (
                <SpaceBetween size="xxs">
                  <Box variant="small">
                    Wind: <strong>{Math.round(item.windSpeed)} km/h</strong>
                  </Box>
                  <Box variant="small">
                    UV Index: <strong>{Math.round(item.uvIndex)}</strong>
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
        items={forecast}
        trackBy="date"
      />
    </Container>
  );
}
