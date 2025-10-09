// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useState, useEffect } from 'react';
import Grid from '@cloudscape-design/components/grid';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Spinner from '@cloudscape-design/components/spinner';
import Select from '@cloudscape-design/components/select';
import { WeatherWidget } from './weather-widget';
import { ForecastWidget } from './forecast-widget';

interface WeatherData {
  temperature: number;
  windSpeed: number;
  weatherCode: number;
  humidity: number;
  precipitation: number;
}

interface City {
  name: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

const cities: City[] = [
  { name: 'New York', latitude: 40.7128, longitude: -74.006, timezone: 'America/New_York' },
  { name: 'London', latitude: 51.5074, longitude: -0.1278, timezone: 'Europe/London' },
  { name: 'Tokyo', latitude: 35.6762, longitude: 139.6503, timezone: 'Asia/Tokyo' },
  { name: 'Sydney', latitude: -33.8688, longitude: 151.2093, timezone: 'Australia/Sydney' },
  { name: 'Paris', latitude: 48.8566, longitude: 2.3522, timezone: 'Europe/Paris' },
  { name: 'Berlin', latitude: 52.52, longitude: 13.405, timezone: 'Europe/Berlin' },
  { name: 'San Francisco', latitude: 37.7749, longitude: -122.4194, timezone: 'America/Los_Angeles' },
  { name: 'Singapore', latitude: 1.3521, longitude: 103.8198, timezone: 'Asia/Singapore' },
];

export function WeatherContent() {
  const [selectedCity, setSelectedCity] = useState(cities[0]);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${selectedCity.latitude}&longitude=${selectedCity.longitude}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&hourly=temperature_2m,precipitation_probability&timezone=${selectedCity.timezone}&forecast_days=3`,
        );
        const data = await response.json();

        setWeatherData({
          temperature: data.current.temperature_2m,
          windSpeed: data.current.wind_speed_10m,
          weatherCode: data.current.weather_code,
          humidity: data.current.relative_humidity_2m,
          precipitation: data.current.precipitation,
        });

        setForecastData(data.hourly);
      } catch (err) {
        setError('Failed to fetch weather data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 300000); // Update every 5 minutes

    return () => clearInterval(interval);
  }, [selectedCity]);

  return (
    <SpaceBetween size="l">
      <Container>
        <SpaceBetween size="m">
          <Header variant="h2">Select Location</Header>
          <Select
            selectedOption={{ label: selectedCity.name, value: selectedCity.name }}
            onChange={({ detail }) => {
              const city = cities.find(c => c.name === detail.selectedOption.value);
              if (city) setSelectedCity(city);
            }}
            options={cities.map(city => ({ label: city.name, value: city.name }))}
            selectedAriaLabel="Selected"
          />
        </SpaceBetween>
      </Container>

      {loading && (
        <Container>
          <Box textAlign="center" padding="xxl">
            <Spinner size="large" />
            <Box variant="p" padding={{ top: 's' }}>
              Loading weather data...
            </Box>
          </Box>
        </Container>
      )}

      {error && (
        <Container>
          <Box textAlign="center" color="text-status-error" padding="xxl">
            {error}
          </Box>
        </Container>
      )}

      {!loading && !error && weatherData && (
        <Grid gridDefinition={[{ colspan: { default: 12, s: 6 } }, { colspan: { default: 12, s: 6 } }]}>
          <WeatherWidget city={selectedCity.name} data={weatherData} />
          {forecastData && <ForecastWidget forecastData={forecastData} />}
        </Grid>
      )}

      <Container>
        <Box variant="small" color="text-body-secondary" textAlign="center">
          Weather data by Open-Meteo.com
        </Box>
      </Container>
    </SpaceBetween>
  );
}
