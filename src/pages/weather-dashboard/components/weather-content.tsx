// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useState, useEffect } from 'react';

import Grid from '@cloudscape-design/components/grid';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import Badge from '@cloudscape-design/components/badge';
import Button from '@cloudscape-design/components/button';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import Alert from '@cloudscape-design/components/alert';
import Spinner from '@cloudscape-design/components/spinner';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Select from '@cloudscape-design/components/select';

import { CurrentWeatherDisplay } from './current-weather-display';

interface WeatherData {
  current: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    weather_code: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    precipitation_probability: number[];
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

interface Location {
  label: string;
  value: string;
  latitude: number;
  longitude: number;
}

const LOCATIONS: Location[] = [
  { label: 'New York, NY', value: 'nyc', latitude: 40.7128, longitude: -74.006 },
  { label: 'London, UK', value: 'london', latitude: 51.5074, longitude: -0.1278 },
  { label: 'Tokyo, Japan', value: 'tokyo', latitude: 35.6762, longitude: 139.6503 },
  { label: 'Sydney, Australia', value: 'sydney', latitude: -33.8688, longitude: 151.2093 },
  { label: 'Berlin, Germany', value: 'berlin', latitude: 52.52, longitude: 13.405 },
];

const getWeatherDescription = (code: number) => {
  const weatherCodes: { [key: number]: { description: string; icon: string } } = {
    0: { description: 'Clear sky', icon: '☀️' },
    1: { description: 'Mainly clear', icon: '🌤️' },
    2: { description: 'Partly cloudy', icon: '⛅' },
    3: { description: 'Overcast', icon: '☁️' },
    45: { description: 'Fog', icon: '🌫️' },
    48: { description: 'Depositing rime fog', icon: '🌫️' },
    51: { description: 'Light drizzle', icon: '🌦️' },
    53: { description: 'Moderate drizzle', icon: '🌦️' },
    55: { description: 'Dense drizzle', icon: '🌧️' },
    61: { description: 'Slight rain', icon: '🌧️' },
    63: { description: 'Moderate rain', icon: '🌧️' },
    65: { description: 'Heavy rain', icon: '⛈️' },
    71: { description: 'Slight snow', icon: '🌨️' },
    73: { description: 'Moderate snow', icon: '❄️' },
    75: { description: 'Heavy snow', icon: '❄️' },
    95: { description: 'Thunderstorm', icon: '⛈️' },
  };
  return weatherCodes[code] || { description: 'Unknown', icon: '❓' };
};

export function WeatherContent() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location>(LOCATIONS[0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeatherData = async (location: Location) => {
    setLoading(true);
    setError(null);

    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&hourly=temperature_2m,precipitation_probability,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code&timezone=auto&forecast_days=7`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }

      const data = await response.json();
      setWeatherData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData(selectedLocation);
  }, [selectedLocation]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (error) {
    return (
      <Alert type="error" header="Failed to load weather data">
        {error}
        <Box margin={{ top: 's' }}>
          <Button onClick={() => fetchWeatherData(selectedLocation)}>Retry</Button>
        </Box>
      </Alert>
    );
  }

  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h2"
            actions={
              <Select
                selectedOption={{ label: selectedLocation.label, value: selectedLocation.value }}
                onChange={({ detail }) => {
                  const location = LOCATIONS.find(loc => loc.value === detail.selectedOption.value);
                  if (location) setSelectedLocation(location);
                }}
                options={LOCATIONS.map(loc => ({ label: loc.label, value: loc.value }))}
                placeholder="Select location"
              />
            }
          >
            Current Weather
          </Header>
        }
      >
        {loading ? (
          <Box textAlign="center" padding="l">
            <Spinner size="large" />
            <Box variant="p" margin={{ top: 's' }}>
              Loading weather data...
            </Box>
          </Box>
        ) : weatherData ? (
          <CurrentWeatherDisplay
            weatherData={weatherData}
            getWeatherDescription={getWeatherDescription}
            formatTime={formatTime}
          />
        ) : null}
      </Container>

      <Grid gridDefinition={[{ colspan: 6 }, { colspan: 6 }]}>
        <Container
          header={
            <Header variant="h2" counter={weatherData?.hourly.time.slice(0, 24).length.toString()}>
              24-Hour Forecast
            </Header>
          }
        >
          {loading ? (
            <Box textAlign="center" padding="l">
              <Spinner />
            </Box>
          ) : weatherData ? (
            <SpaceBetween size="s">
              {weatherData.hourly.time.slice(0, 24).map((time, index) => (
                <Box key={time} padding={{ vertical: 'xs', horizontal: 's' }}>
                  <ColumnLayout columns={4} variant="text-grid">
                    <Box variant="small">{formatTime(time)}</Box>
                    <Box fontWeight="bold">{Math.round(weatherData.hourly.temperature_2m[index])}°C</Box>
                    <Box variant="small">{weatherData.hourly.precipitation_probability[index]}% rain</Box>
                    <Box variant="small">{Math.round(weatherData.hourly.wind_speed_10m[index])} km/h</Box>
                  </ColumnLayout>
                </Box>
              ))}
            </SpaceBetween>
          ) : null}
        </Container>

        <Container
          header={
            <Header variant="h2" counter={weatherData?.daily.time.length.toString()}>
              7-Day Forecast
            </Header>
          }
        >
          {loading ? (
            <Box textAlign="center" padding="l">
              <Spinner />
            </Box>
          ) : weatherData ? (
            <SpaceBetween size="s">
              {weatherData.daily.time.map((date, index) => {
                const weather = getWeatherDescription(weatherData.daily.weather_code[index]);
                return (
                  <Box key={date} padding={{ vertical: 's', horizontal: 's' }}>
                    <ColumnLayout columns={4} variant="text-grid">
                      <Box fontWeight="bold">{formatDate(date)}</Box>
                      <Box>
                        <SpaceBetween direction="horizontal" size="xs">
                          <span>{weather.icon}</span>
                          <Box fontWeight="bold">{Math.round(weatherData.daily.temperature_2m_max[index])}°</Box>
                          <Box color="text-status-inactive">
                            {Math.round(weatherData.daily.temperature_2m_min[index])}°
                          </Box>
                        </SpaceBetween>
                      </Box>
                      <Box variant="small">{weather.description}</Box>
                      <Box variant="small">
                        {weatherData.daily.precipitation_sum[index] > 0 && (
                          <Badge color="blue">{weatherData.daily.precipitation_sum[index].toFixed(1)}mm</Badge>
                        )}
                      </Box>
                    </ColumnLayout>
                  </Box>
                );
              })}
            </SpaceBetween>
          ) : null}
        </Container>
      </Grid>
    </SpaceBetween>
  );
}
