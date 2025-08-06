// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useState, useEffect } from 'react';

import ColumnLayout from '@cloudscape-design/components/column-layout';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Grid from '@cloudscape-design/components/grid';
import Alert from '@cloudscape-design/components/alert';

import { WeatherData, Location, weatherApi, defaultLocations } from '../services/weather-api';
import { CurrentWeatherWidget } from '../widgets/current-weather';
import { TemperatureChart } from '../widgets/temperature-chart';
import { HumidityChart } from '../widgets/humidity-chart';
import { PrecipitationChart } from '../widgets/precipitation-chart';
import { WindChart } from '../widgets/wind-chart';
import { WeatherForecast } from '../widgets/weather-forecast';
import { WeatherHeader } from './header';

export function WeatherContent() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location>(defaultLocations[0]);

  const fetchWeatherData = async (location: Location) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await weatherApi.getCurrentWeather(location.latitude, location.longitude);
      setWeatherData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData(selectedLocation);
  }, [selectedLocation]);

  const handleLocationChange = (location: Location) => {
    setSelectedLocation(location);
  };

  const handleRefresh = () => {
    fetchWeatherData(selectedLocation);
  };

  return (
    <SpaceBetween size="l">
      <WeatherHeader 
        selectedLocation={selectedLocation}
        onLocationChange={handleLocationChange}
        onRefresh={handleRefresh}
        isLoading={loading}
      />

      {error && (
        <Alert type="error" dismissible onDismiss={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Current Weather Overview */}
      <Container>
        <Header variant="h2" description="Current weather conditions and key metrics">
          Current Conditions
        </Header>
        <ColumnLayout columns={1}>
          <CurrentWeatherWidget 
            weatherData={weatherData} 
            loading={loading}
            location={selectedLocation}
          />
        </ColumnLayout>
      </Container>

      {/* Weather Charts */}
      <Container>
        <Header variant="h2" description="Interactive charts showing weather trends">
          Weather Analytics
        </Header>
        <Grid
          gridDefinition={[
            { colspan: { default: 12, xxs: 12, xs: 12, s: 12, m: 6, l: 6, xl: 6 } },
            { colspan: { default: 12, xxs: 12, xs: 12, s: 12, m: 6, l: 6, xl: 6 } },
            { colspan: { default: 12, xxs: 12, xs: 12, s: 12, m: 6, l: 6, xl: 6 } },
            { colspan: { default: 12, xxs: 12, xs: 12, s: 12, m: 6, l: 6, xl: 6 } }
          ]}
        >
          <TemperatureChart weatherData={weatherData} loading={loading} />
          <HumidityChart weatherData={weatherData} loading={loading} />
          <PrecipitationChart weatherData={weatherData} loading={loading} />
          <WindChart weatherData={weatherData} loading={loading} />
        </Grid>
      </Container>

      {/* Daily Forecast */}
      <Container>
        <Header variant="h2" description="7-day weather forecast">
          Weekly Forecast
        </Header>
        <ColumnLayout columns={1}>
          <WeatherForecast weatherData={weatherData} loading={loading} />
        </ColumnLayout>
      </Container>
    </SpaceBetween>
  );
}
