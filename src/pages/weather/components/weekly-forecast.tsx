// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';

import { WeatherData } from '../types';
import { getWeatherEmoji, getWeatherInfo, formatTemperature, formatPrecipitation } from '../weather-utils';

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
      <div
        style={{
          overflowX: 'auto',
          overflowY: 'hidden',
          paddingBottom: '12px',
          marginRight: '-16px',
          marginLeft: '-16px',
          paddingRight: '16px',
          paddingLeft: '16px',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: '12px',
            minWidth: 'min-content',
          }}
        >
          {forecast.map(day => {
            const weatherInfo = getWeatherInfo(day.weatherCode);
            const weatherEmoji = getWeatherEmoji(day.weatherCode);
            const dateObj = new Date(day.date);
            const dateStr = dateObj.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              timeZone: timezone,
            });

            return (
              <div
                key={day.date}
                style={{
                  flexShrink: 0,
                  width: '160px',
                  padding: '16px',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '8px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <Box fontWeight="bold">{day.dayName}</Box>
                <Box variant="small" color="text-body-secondary">
                  {dateStr}
                </Box>

                <div style={{ fontSize: '48px', lineHeight: '1' }}>{weatherEmoji}</div>

                <Box variant="small" color="text-body-secondary">
                  {weatherInfo.description}
                </Box>

                <SpaceBetween size="xxs">
                  <Box>
                    <Box display="inline" fontWeight="bold">
                      {Math.round(day.tempMax)}°
                    </Box>
                    <Box display="inline" color="text-body-secondary" margin={{ left: 'xs' }}>
                      {Math.round(day.tempMin)}°
                    </Box>
                  </Box>
                </SpaceBetween>

                <Box variant="small">
                  💧 {Math.round(day.precipitationProbability)}%
                </Box>

                <Box variant="small">
                  💨 {Math.round(day.windSpeed)} km/h
                </Box>
              </div>
            );
          })}
        </div>
      </div>
    </Container>
  );
}
