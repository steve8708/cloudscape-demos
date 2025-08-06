// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useEffect, useState } from 'react';

import Alert from '@cloudscape-design/components/alert';
import Button from '@cloudscape-design/components/button';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Spinner from '@cloudscape-design/components/spinner';
import SpaceBetween from '@cloudscape-design/components/space-between';

import { LocationData, WeatherResponse, weatherService } from '../services/weather-service';
import { CitySearch } from './city-search';
import { TemperatureChart } from './charts/temperature-chart';
import { WindHumidityChart } from './charts/wind-humidity-chart';
import { WeatherSummaryChart } from './charts/weather-summary-chart';
import { CurrentWeatherWidget } from './widgets/current-weather';

export function Content() {
  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCitySearch, setShowCitySearch] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<LocationData>(weatherService.getCurrentLocation());

  const fetchWeatherData = async (location?: LocationData) => {
    try {
      setLoading(true);
      setError(null);
      const data = await weatherService.fetchWeatherData(location);
      setWeatherData(data);
      if (location) {
        setCurrentLocation(location);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  const handleLocationChange = (newLocation: LocationData) => {
    weatherService.setLocation(newLocation);
    fetchWeatherData(newLocation);
  };

  useEffect(() => {
    fetchWeatherData();

    // Refresh data every 10 minutes
    const interval = setInterval(() => fetchWeatherData(), 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <Spinner size="large" />
          <div style={{ marginTop: '1rem' }}>Loading weather data...</div>
        </div>
      </Container>
    );
  }

  if (error || !weatherData) {
    return (
      <Alert type="error" header="Weather Data Error">
        {error || 'Unable to load weather data. Please try refreshing the page.'}
      </Alert>
    );
  }

  const weatherDescription = weatherService.getWeatherDescription(weatherData.current.weather_code);
  
  // Prepare chart data (24 hours)
  const temperatureData = weatherService.getTemperatureTrend(weatherData.hourly, 24);
  const windData = weatherService.getWindSpeedData(weatherData.hourly, 24);
  const humidityData = weatherService.getHumidityData(weatherData.hourly, 24);

  return (
    <SpaceBetween size="l">
      {/* Location Controls */}
      <Container>
        <SpaceBetween direction="horizontal" size="s" alignItems="center">
          <SpaceBetween direction="horizontal" size="xs" alignItems="center">
            <span style={{ fontSize: '14px', fontWeight: 'bold' }}>📍</span>
            <span style={{ fontSize: '14px' }}>
              {currentLocation.name}, {currentLocation.country}
            </span>
          </SpaceBetween>
          <Button
            variant="normal"
            iconName="search"
            onClick={() => setShowCitySearch(true)}
          >
            Change Location
          </Button>
          <Button
            variant="normal"
            iconName="refresh"
            onClick={() => fetchWeatherData()}
            loading={loading}
          >
            Refresh
          </Button>
        </SpaceBetween>
      </Container>

      {/* City Search Modal */}
      <CitySearch
        visible={showCitySearch}
        onDismiss={() => setShowCitySearch(false)}
        onLocationSelect={handleLocationChange}
        currentLocation={currentLocation}
      />

      {/* Current Weather Section */}
      <CurrentWeatherWidget
        weather={weatherData.current}
        location={currentLocation.name}
        weatherDescription={weatherDescription}
      />

      {/* Charts Section */}
      <ColumnLayout columns={2}>
        <Container>
          <TemperatureChart data={temperatureData} height={300} />
        </Container>
        <Container>
          <WeatherSummaryChart temperatureData={temperatureData} height={300} />
        </Container>
      </ColumnLayout>

      {/* Wind and Humidity Section */}
      <Container>
        <WindHumidityChart 
          windData={windData} 
          humidityData={humidityData} 
          height={350} 
        />
      </Container>

      {/* Hourly Forecast Section */}
      <Container
        header={
          <Header variant="h2" description="Detailed 24-hour weather forecast">
            Hourly Forecast
          </Header>
        }
      >
        <ColumnLayout columns={1}>
          <div style={{ fontSize: '14px', color: '#5f6b7a' }}>
            <strong>Location:</strong> {currentLocation.name}, {currentLocation.country}<br />
            <strong>Coordinates:</strong> {weatherData.latitude}°N, {weatherData.longitude}°E<br />
            <strong>Last Updated:</strong> {new Date(weatherData.current.time).toLocaleString()}<br />
            <strong>Data Source:</strong> Open Meteo API - Free Weather API
          </div>
        </ColumnLayout>
      </Container>
    </SpaceBetween>
  );
}
