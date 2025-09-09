// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useEffect, useState } from 'react';

import Grid from '@cloudscape-design/components/grid';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Alert from '@cloudscape-design/components/alert';
import Spinner from '@cloudscape-design/components/spinner';

import { weatherAPI, WeatherData, DEFAULT_LOCATION } from '../services/weather-api';
import { CurrentWeatherWidget } from '../widgets/current-weather-widget';
import { HourlyForecastWidget } from '../widgets/hourly-forecast-widget';
import { DailyForecastWidget } from '../widgets/daily-forecast-widget';
import { TemperatureChartWidget } from '../widgets/temperature-chart-widget';
import { PrecipitationWidget } from '../widgets/precipitation-widget';
import { WindWidget } from '../widgets/wind-widget';

export function Content() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await weatherAPI.getCompleteWeatherData(DEFAULT_LOCATION);
        setWeatherData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
    
    // Refresh data every 10 minutes
    const interval = setInterval(fetchWeatherData, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px' }}>
        <SpaceBetween size="m">
          <Spinner size="large" />
          <div>Loading weather data...</div>
        </SpaceBetween>
      </div>
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
      <Alert type="info" header="No weather data available">
        Please check your connection and try again.
      </Alert>
    );
  }

  return (
    <Grid
      gridDefinition={[
        { colspan: { l: 4, m: 6, default: 12 } },
        { colspan: { l: 4, m: 6, default: 12 } },
        { colspan: { l: 4, m: 12, default: 12 } },
        { colspan: { l: 8, m: 12, default: 12 } },
        { colspan: { l: 4, m: 12, default: 12 } },
        { colspan: { l: 6, m: 6, default: 12 } },
        { colspan: { l: 6, m: 6, default: 12 } },
      ]}
    >
      <CurrentWeatherWidget data={weatherData.current} location={weatherData.location} />
      <TemperatureChartWidget data={weatherData.hourly} />
      <WindWidget current={weatherData.current} hourly={weatherData.hourly} />
      <HourlyForecastWidget data={weatherData.hourly} />
      <DailyForecastWidget data={weatherData.daily} />
      <PrecipitationWidget data={weatherData.hourly} />
    </Grid>
  );
}
