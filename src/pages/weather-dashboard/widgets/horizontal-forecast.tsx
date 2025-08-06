// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Spinner from '@cloudscape-design/components/spinner';

import { WeatherData, weatherApi } from '../services/weather-api';

interface HorizontalForecastProps {
  weatherData: WeatherData | null;
  loading: boolean;
}

const getWeatherEmoji = (code: number): string => {
  if (code === 0) return '☀️';
  if (code === 1) return '🌤️';
  if (code === 2) return '⛅';
  if (code === 3) return '☁️';
  if (code === 45 || code === 48) return '🌫️';
  if (code >= 51 && code <= 57) return '🌦️';
  if (code >= 61 && code <= 67) return '🌧️';
  if (code >= 71 && code <= 77) return '❄️';
  if (code >= 80 && code <= 82) return '🌦️';
  if (code >= 85 && code <= 86) return '🌨️';
  if (code >= 95 && code <= 99) return '⛈️';
  return '🌤️';
};

export function HorizontalForecast({ weatherData, loading }: HorizontalForecastProps) {
  if (loading) {
    return (
      <Box textAlign="center" padding={{ vertical: 'm' }}>
        <Spinner />
      </Box>
    );
  }

  if (!weatherData?.daily) {
    return (
      <Box textAlign="center" padding={{ vertical: 'm' }} color="text-status-inactive">
        No forecast data available
      </Box>
    );
  }

  const { daily } = weatherData;
  const today = new Date();

  const forecastDays = daily.time.slice(0, 7).map((date, index) => {
    const dateObj = new Date(date);
    const isToday = dateObj.toDateString() === today.toDateString();
    const isTomorrow = dateObj.toDateString() === new Date(today.getTime() + 24 * 60 * 60 * 1000).toDateString();

    let dayLabel = dateObj.toLocaleDateString(undefined, { weekday: 'short' });
    if (isToday) dayLabel = 'Today';
    else if (isTomorrow) dayLabel = 'Tomorrow';

    return {
      day: dayLabel,
      date: dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      emoji: getWeatherEmoji(daily.weather_code[index]),
      maxTemp: Math.round(daily.temperature_2m_max[index]),
      minTemp: Math.round(daily.temperature_2m_min[index]),
      precipitation: daily.precipitation_sum[index],
      description: weatherApi.getWeatherDescription(daily.weather_code[index]),
    };
  });

  return (
    <div
      style={{
        overflowX: 'auto',
        paddingBottom: '8px',
        scrollBehavior: 'smooth',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '16px',
          minWidth: 'max-content',
          padding: '0 4px',
        }}
      >
        {forecastDays.map((day, index) => (
          <div
            key={index}
            style={{
              minWidth: '120px',
              padding: '16px 12px',
              backgroundColor:
                index === 0
                  ? 'var(--color-background-layout-panel-content)'
                  : 'var(--color-background-container-content)',
              border:
                index === 0
                  ? '2px solid var(--color-border-control-checked)'
                  : '1px solid var(--color-border-divider-default)',
              borderRadius: '8px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: index === 0 ? '0 2px 8px rgba(0, 0, 0, 0.1)' : 'none',
            }}
            onMouseEnter={e => {
              if (index !== 0) {
                e.currentTarget.style.backgroundColor = 'var(--color-background-layout-panel-content)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
              }
            }}
            onMouseLeave={e => {
              if (index !== 0) {
                e.currentTarget.style.backgroundColor = 'var(--color-background-container-content)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }
            }}
          >
            <SpaceBetween size="xs" alignItems="center">
              <Box variant="small" fontWeight={index === 0 ? 'bold' : 'normal'}>
                {day.day}
              </Box>
              <Box variant="small" color="text-status-inactive">
                {day.date}
              </Box>
              <div style={{ fontSize: '32px', lineHeight: '1' }}>{day.emoji}</div>
              <Box variant="small" textAlign="center">
                <div style={{ fontWeight: 'bold' }}>{day.maxTemp}°</div>
                <div style={{ color: 'var(--color-text-status-inactive)' }}>{day.minTemp}°</div>
              </Box>
              {day.precipitation > 0 && (
                <Box variant="small" color="text-status-info">
                  💧 {day.precipitation.toFixed(1)}mm
                </Box>
              )}
            </SpaceBetween>
          </div>
        ))}
      </div>
    </div>
  );
}
