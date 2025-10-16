// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useState, useEffect, useCallback } from 'react';

import AppLayout from '@cloudscape-design/components/app-layout';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Header from '@cloudscape-design/components/header';
import Container from '@cloudscape-design/components/container';
import Autosuggest from '@cloudscape-design/components/autosuggest';
import Grid from '@cloudscape-design/components/grid';
import Alert from '@cloudscape-design/components/alert';
import Spinner from '@cloudscape-design/components/spinner';

import { Breadcrumbs, Notifications } from '../commons';
import { CustomAppLayout } from '../commons/common-components';
import { WeatherForecast } from './components/forecast';
import { WeatherCharts } from './components/charts';

interface Location {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
}

interface WeatherData {
  current: {
    temperature: number;
    weatherCode: number;
    windSpeed: number;
    windDirection: number;
    humidity: number;
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weathercode: number[];
    precipitation_sum: number[];
    windspeed_10m_max: number[];
    sunrise: string[];
    sunset: string[];
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    precipitation: number[];
    windspeed_10m: number[];
    relativehumidity_2m: number[];
    pressure_msl: number[];
  };
}

export function App() {
  const [searchValue, setSearchValue] = useState('');
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);

  const searchLocations = useCallback(async (query: string) => {
    if (query.length < 2) {
      setLocations([]);
      return;
    }

    setSearchLoading(true);
    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=10&language=en&format=json`,
      );
      const data = await response.json();

      if (data.results) {
        setLocations(
          data.results.map((item: any) => ({
            id: item.id,
            name: item.name,
            latitude: item.latitude,
            longitude: item.longitude,
            country: item.country,
            admin1: item.admin1,
          })),
        );
      } else {
        setLocations([]);
      }
    } catch (err) {
      console.error('Error searching locations:', err);
      setLocations([]);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  const fetchWeatherData = async (location: Location) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,weathercode,windspeed_10m,winddirection_10m,relativehumidity_2m&hourly=temperature_2m,precipitation,windspeed_10m,relativehumidity_2m,pressure_msl&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max,sunrise,sunset&timezone=auto&forecast_days=7`,
      );

      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }

      const data = await response.json();

      setWeatherData({
        current: {
          temperature: data.current.temperature_2m,
          weatherCode: data.current.weathercode,
          windSpeed: data.current.windspeed_10m,
          windDirection: data.current.winddirection_10m,
          humidity: data.current.relativehumidity_2m,
        },
        daily: data.daily,
        hourly: data.hourly,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue) {
        searchLocations(searchValue);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue, searchLocations]);

  useEffect(() => {
    if (selectedLocation) {
      fetchWeatherData(selectedLocation);
    }
  }, [selectedLocation]);

  return (
    <CustomAppLayout
      content={
        <SpaceBetween size="l">
          <Header
            variant="h1"
            description="Search for any city worldwide to view detailed weather forecasts and interactive charts"
          >
            Weather Dashboard
          </Header>

          <Container>
            <SpaceBetween size="m">
              <Autosuggest
                onChange={({ detail }) => setSearchValue(detail.value)}
                onSelect={({ detail }) => {
                  const location = locations.find(
                    loc => `${loc.name}, ${loc.admin1 ? loc.admin1 + ', ' : ''}${loc.country}` === detail.value,
                  );
                  if (location) {
                    setSelectedLocation(location);
                  }
                }}
                value={searchValue}
                options={locations.map(loc => ({
                  value: `${loc.name}, ${loc.admin1 ? loc.admin1 + ', ' : ''}${loc.country}`,
                  label: `${loc.name}, ${loc.admin1 ? loc.admin1 + ', ' : ''}${loc.country}`,
                }))}
                placeholder="Search for a city..."
                ariaLabel="Search for a city"
                empty="No cities found"
                statusType={searchLoading ? 'loading' : 'finished'}
                loadingText="Searching cities..."
              />

              {selectedLocation && (
                <Header variant="h2">
                  {selectedLocation.name}, {selectedLocation.admin1 ? `${selectedLocation.admin1}, ` : ''}
                  {selectedLocation.country}
                </Header>
              )}
            </SpaceBetween>
          </Container>

          {error && (
            <Alert type="error" header="Error loading weather data">
              {error}
            </Alert>
          )}

          {loading && (
            <Container>
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <Spinner size="large" />
              </div>
            </Container>
          )}

          {weatherData && selectedLocation && !loading && (
            <>
              <WeatherForecast
                currentWeather={weatherData.current}
                dailyForecast={weatherData.daily}
                location={selectedLocation}
              />

              <WeatherCharts hourlyData={weatherData.hourly} dailyData={weatherData.daily} />
            </>
          )}

          {!selectedLocation && !loading && (
            <Container>
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <Header variant="h3">Search for a city to view weather data</Header>
                <p>Start typing a city name in the search box above to see detailed forecasts and charts</p>
              </div>
            </Container>
          )}
        </SpaceBetween>
      }
      breadcrumbs={
        <Breadcrumbs
          items={[
            { text: 'Dashboard', href: '/' },
            { text: 'Weather', href: '#' },
          ]}
        />
      }
      navigationHide
      toolsHide
      notifications={<Notifications />}
    />
  );
}
