// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Icon from '@cloudscape-design/components/icon';

interface DailyForecastProps {
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    weather_code: number[];
  };
}

const getWeatherIcon = (weatherCode: number): string => {
  if (weatherCode === 0 || weatherCode === 1) {
    return 'status-positive';
  }
  if (weatherCode === 2 || weatherCode === 3) {
    return 'status-warning';
  }
  if (weatherCode >= 45 && weatherCode <= 48) {
    return 'status-in-progress';
  }
  if (weatherCode >= 51 && weatherCode <= 82) {
    return 'status-negative';
  }
  if (weatherCode >= 95) {
    return 'notification';
  }
  return 'status-info';
};

const getWeatherDescription = (weatherCode: number): string => {
  const weatherDescriptions: { [key: number]: string } = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    95: 'Thunderstorm',
  };

  return weatherDescriptions[weatherCode] || 'Unknown';
};

const formatDate = (dateString: string): { dayName: string; date: string } => {
  const date = new Date(dateString);
  const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
  const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return { dayName, date: dateStr };
};

function DayForecastCard({
  time,
  tempMax,
  tempMin,
  precipitation,
  weatherCode,
  isToday = false,
}: {
  time: string;
  tempMax: number;
  tempMin: number;
  precipitation: number;
  weatherCode: number;
  isToday?: boolean;
}) {
  const { dayName, date } = formatDate(time);
  const weatherIcon = getWeatherIcon(weatherCode);
  const weatherDescription = getWeatherDescription(weatherCode);

  return (
    <div
      style={{
        padding: '16px',
        border: '1px solid var(--color-border-divider-default)',
        borderRadius: '8px',
        backgroundColor: isToday ? 'var(--color-background-container-content)' : 'transparent',
        textAlign: 'center',
      }}
    >
      <SpaceBetween size="s">
        <Box>
          <Box variant="h4" color={isToday ? 'text-status-success' : undefined}>
            {isToday ? 'Today' : dayName}
          </Box>
          <Box variant="small" color="text-status-inactive">
            {date}
          </Box>
        </Box>

        <Icon name={weatherIcon} size="normal" />

        <Box variant="small" color="text-status-inactive">
          {weatherDescription}
        </Box>

        <SpaceBetween size="xs">
          <Box variant="h3">{Math.round(tempMax)}°</Box>
          <Box variant="small" color="text-status-inactive">
            {Math.round(tempMin)}°
          </Box>
        </SpaceBetween>

        {precipitation > 0 && (
          <Box variant="small" color="text-status-info">
            🌧 {Math.round(precipitation * 10) / 10}mm
          </Box>
        )}
      </SpaceBetween>
    </div>
  );
}

export function DailyForecastWidget({ daily }: DailyForecastProps) {
  return (
    <ColumnLayout columns={7} borders="vertical">
      {daily.time.map((time, index) => (
        <DayForecastCard
          key={time}
          time={time}
          tempMax={daily.temperature_2m_max[index]}
          tempMin={daily.temperature_2m_min[index]}
          precipitation={daily.precipitation_sum[index]}
          weatherCode={daily.weather_code[index]}
          isToday={index === 0}
        />
      ))}
    </ColumnLayout>
  );
}
