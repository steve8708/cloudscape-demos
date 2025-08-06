// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Box from '@cloudscape-design/components/box';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Table from '@cloudscape-design/components/table';
import Spinner from '@cloudscape-design/components/spinner';
import Badge from '@cloudscape-design/components/badge';

import { WeatherData, weatherApi } from '../services/weather-api';

interface WeatherForecastProps {
  weatherData: WeatherData | null;
  loading: boolean;
}

interface ForecastDay {
  date: string;
  dayName: string;
  maxTemp: number;
  minTemp: number;
  precipitation: number;
  windSpeed: number;
  weatherCode: number;
  weatherDescription: string;
}

export function WeatherForecast({ weatherData, loading }: WeatherForecastProps) {
  if (loading) {
    return (
      <Container>
        <Header variant="h3">7-Day Forecast</Header>
        <Box textAlign="center" padding={{ vertical: 'l' }}>
          <Spinner />
        </Box>
      </Container>
    );
  }

  if (!weatherData?.daily) {
    return (
      <Container>
        <Header variant="h3">7-Day Forecast</Header>
        <Box textAlign="center" padding={{ vertical: 'l' }}>
          No forecast data available
        </Box>
      </Container>
    );
  }

  const { daily } = weatherData;
  
  const forecastData: ForecastDay[] = daily.time.map((date, index) => {
    const dateObj = new Date(date);
    return {
      date: dateObj.toLocaleDateString(undefined, { 
        month: 'short', 
        day: 'numeric' 
      }),
      dayName: dateObj.toLocaleDateString(undefined, { 
        weekday: 'short' 
      }),
      maxTemp: daily.temperature_2m_max[index],
      minTemp: daily.temperature_2m_min[index],
      precipitation: daily.precipitation_sum[index],
      windSpeed: daily.wind_speed_10m_max[index],
      weatherCode: daily.weather_code[index],
      weatherDescription: weatherApi.getWeatherDescription(daily.weather_code[index])
    };
  });

  const getWeatherIcon = (code: number) => {
    if (code === 0) return '☀️';
    if (code <= 3) return '⛅';
    if (code <= 48) return '🌫️';
    if (code <= 67) return '🌧️';
    if (code <= 77) return '❄️';
    if (code <= 86) return '🌦️';
    return '⛈️';
  };

  const getPrecipitationBadge = (precipitation: number) => {
    if (precipitation === 0) return <Badge color="green">No rain</Badge>;
    if (precipitation < 2.5) return <Badge color="blue">Light</Badge>;
    if (precipitation < 10) return <Badge color="grey">Moderate</Badge>;
    return <Badge color="red">Heavy</Badge>;
  };

  return (
    <Container>
      <Header variant="h3" description="Extended weather forecast">
        7-Day Forecast
      </Header>
      <Table
        columnDefinitions={[
          {
            id: 'day',
            header: 'Day',
            cell: item => (
              <div>
                <Box variant="strong">{item.dayName}</Box>
                <Box variant="small" color="text-status-inactive">{item.date}</Box>
              </div>
            ),
            sortingField: 'dayName',
            minWidth: 80
          },
          {
            id: 'weather',
            header: 'Conditions',
            cell: item => (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '20px' }}>{getWeatherIcon(item.weatherCode)}</span>
                <Box variant="span">{item.weatherDescription}</Box>
              </div>
            ),
            minWidth: 150
          },
          {
            id: 'temperature',
            header: 'Temperature',
            cell: item => (
              <div>
                <Box variant="strong">{weatherApi.formatTemperature(item.maxTemp)}</Box>
                <Box variant="small" color="text-status-inactive">
                  / {weatherApi.formatTemperature(item.minTemp)}
                </Box>
              </div>
            ),
            sortingField: 'maxTemp',
            minWidth: 100
          },
          {
            id: 'precipitation',
            header: 'Precipitation',
            cell: item => (
              <div>
                <Box variant="span">{item.precipitation.toFixed(1)} mm</Box>
                <br />
                {getPrecipitationBadge(item.precipitation)}
              </div>
            ),
            sortingField: 'precipitation',
            minWidth: 120
          },
          {
            id: 'wind',
            header: 'Wind',
            cell: item => (
              <Box variant="span">
                {weatherApi.formatWindSpeed(item.windSpeed)}
              </Box>
            ),
            sortingField: 'windSpeed',
            minWidth: 80
          }
        ]}
        items={forecastData}
        loadingText="Loading forecast..."
        empty={
          <Box textAlign="center" color="inherit">
            <Box variant="strong" textAlign="center" color="inherit">
              No forecast data available
            </Box>
          </Box>
        }
        header={
          <Header counter={`(${forecastData.length})`}>
            Daily forecasts
          </Header>
        }
      />
    </Container>
  );
}
