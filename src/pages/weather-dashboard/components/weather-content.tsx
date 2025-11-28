// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useEffect, useState } from 'react';

import Alert from '@cloudscape-design/components/alert';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Spinner from '@cloudscape-design/components/spinner';

import { CurrentWeatherWidget } from './current-weather-widget';
import { HourlyForecastChart } from './hourly-forecast-chart';
import { DailyForecastWidget } from './daily-forecast-widget';
import { WeatherMetricsWidget } from './weather-metrics-widget';

interface WeatherData {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    weather_code: number;
    is_day: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    precipitation_probability: number[];
    precipitation: number[];
    wind_speed_10m: number[];
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    weather_code: number[];
  };
}

interface WeatherContentProps {
  latitude: number;
  longitude: number;
}

export function WeatherContent({ latitude, longitude }: WeatherContentProps) {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      setLoading(true);
      setError(null);

      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,weather_code,is_day&hourly=temperature_2m,precipitation_probability,precipitation,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code&timezone=auto&forecast_days=7`;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setWeatherData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
      } finally {
        setLoading(false);
      }
    };

    if (latitude && longitude) {
      fetchWeatherData();
    }
  }, [latitude, longitude]);

  if (loading) {
    return (
      <Container>
        <Box textAlign="center" padding="xxl">
          <Spinner size="large" />
          <Box variant="p" padding={{ top: 'm' }}>
            Loading weather data...
          </Box>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Alert type="error" header="Failed to load weather data">
        {error}
      </Alert>
    );
  }

  if (!weatherData) {
    return (
      <Alert type="warning" header="No weather data available">
        Please check the latitude and longitude values.
      </Alert>
    );
  }

  return (
    <SpaceBetween size="l">
      <ColumnLayout columns={2} borders="vertical">
        <CurrentWeatherWidget current={weatherData.current} />
        <WeatherMetricsWidget current={weatherData.current} />
      </ColumnLayout>

      <Container header={<Header variant="h2">24-Hour Forecast</Header>}>
        <HourlyForecastChart hourly={weatherData.hourly} />
      </Container>

      <Container header={<Header variant="h2">7-Day Forecast</Header>}>
        <DailyForecastWidget daily={weatherData.daily} />
      </Container>
    </SpaceBetween>
  );
}
