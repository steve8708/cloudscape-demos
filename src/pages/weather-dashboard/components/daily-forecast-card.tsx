// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Table from '@cloudscape-design/components/table';
import Box from '@cloudscape-design/components/box';
import Badge from '@cloudscape-design/components/badge';

import { WeatherData, WeatherAPI } from '../services/weather-api';

interface DailyForecastCardProps {
  weatherData: WeatherData;
}

interface DayForecast {
  date: string;
  dayName: string;
  maxTemp: number;
  minTemp: number;
  precipitation: number;
  windSpeed: number;
  weatherCode: number;
  weatherDescription: string;
}

export function DailyForecastCard({ weatherData }: DailyForecastCardProps) {
  const daily = weatherData.daily;

  const forecastData: DayForecast[] = daily.time.map((dateStr, index) => {
    const date = new Date(dateStr);
    return {
      date: dateStr,
      dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
      maxTemp: Math.round(daily.temperature_2m_max[index]),
      minTemp: Math.round(daily.temperature_2m_min[index]),
      precipitation: daily.precipitation_sum[index],
      windSpeed: Math.round(daily.wind_speed_10m_max[index]),
      weatherCode: daily.weather_code[index],
      weatherDescription: WeatherAPI.getWeatherDescription(daily.weather_code[index]),
    };
  });

  const getTemperatureBadgeColor = (temp: number) => {
    if (temp >= 25) return 'red';
    if (temp >= 15) return 'green';
    if (temp >= 5) return 'blue';
    return 'grey';
  };

  const getPrecipitationBadge = (precipitation: number) => {
    if (precipitation === 0) return <Badge color="green">No rain</Badge>;
    if (precipitation < 2) return <Badge color="blue">Light</Badge>;
    if (precipitation < 10) return <Badge color="grey">Moderate</Badge>;
    return <Badge color="red">Heavy</Badge>;
  };

  return (
    <Container>
      <Header variant="h2">7-Day Forecast</Header>
      <Table
        columnDefinitions={[
          {
            id: 'day',
            header: 'Day',
            cell: item => (
              <Box>
                <Box fontWeight="bold">{item.dayName}</Box>
                <Box variant="small">
                  {new Date(item.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </Box>
              </Box>
            ),
            width: 80,
          },
          {
            id: 'weather',
            header: 'Condition',
            cell: item => <Box variant="small">{item.weatherDescription}</Box>,
          },
          {
            id: 'temperature',
            header: 'Temperature',
            cell: item => (
              <Box>
                <Badge color={getTemperatureBadgeColor(item.maxTemp)}>{item.maxTemp}°</Badge>
                {' / '}
                <Badge color={getTemperatureBadgeColor(item.minTemp)}>{item.minTemp}°</Badge>
              </Box>
            ),
          },
          {
            id: 'precipitation',
            header: 'Rain',
            cell: item => (
              <Box>
                {getPrecipitationBadge(item.precipitation)}
                <Box variant="small">{item.precipitation > 0 && `${item.precipitation} mm`}</Box>
              </Box>
            ),
          },
          {
            id: 'wind',
            header: 'Wind',
            cell: item => <Box variant="small">{item.windSpeed} km/h</Box>,
          },
        ]}
        items={forecastData}
        variant="embedded"
        stickyHeader={false}
        trackBy="date"
        empty={
          <Box textAlign="center" color="inherit">
            No forecast data available
          </Box>
        }
      />
    </Container>
  );
}
