// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useState, useEffect } from 'react';

import AppLayout from '@cloudscape-design/components/app-layout';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import ContentLayout from '@cloudscape-design/components/content-layout';
import Grid from '@cloudscape-design/components/grid';
import Autosuggest from '@cloudscape-design/components/autosuggest';
import Alert from '@cloudscape-design/components/alert';
import Spinner from '@cloudscape-design/components/spinner';
import Box from '@cloudscape-design/components/box';

import { Breadcrumbs, Notifications } from '../commons';
import { CustomAppLayout } from '../commons/common-components';
import { Location, WeatherData } from './types';
import { searchLocations, fetchWeatherData } from './api';
import { CurrentWeather } from './components/current-weather';
import { WeeklyForecast } from './components/weekly-forecast';
import { TemperatureChart } from './components/temperature-chart';
import { PrecipitationChart } from './components/precipitation-chart';
import { WindChart } from './components/wind-chart';
import { HumidityChart } from './components/humidity-chart';

export function App() {
  const [searchValue, setSearchValue] = useState('');
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);

  // Load default location (London) on mount
  useEffect(() => {
    const loadDefaultLocation = async () => {
      setLoading(true);
      try {
        const defaultLocations = await searchLocations('London');
        if (defaultLocations.length > 0) {
          const london = defaultLocations[0];
          setSelectedLocation(london);
          setSearchValue(`${london.name}, ${london.country}`);
          const weather = await fetchWeatherData(london.latitude, london.longitude, london.timezone);
          setWeatherData(weather);
        }
      } catch (err) {
        setError('Failed to load default location');
      } finally {
        setLoading(false);
      }
    };

    loadDefaultLocation();
  }, []);

  // Search for locations when user types
  useEffect(() => {
    const searchTimer = setTimeout(async () => {
      if (searchValue.length >= 2 && !selectedLocation) {
        setSearchLoading(true);
        const results = await searchLocations(searchValue);
        setLocations(results);
        setSearchLoading(false);
      } else if (searchValue.length < 2) {
        setLocations([]);
      }
    }, 300);

    return () => clearTimeout(searchTimer);
  }, [searchValue, selectedLocation]);

  const handleLocationSelect = async (location: Location) => {
    setSelectedLocation(location);
    setSearchValue(`${location.name}, ${location.country}`);
    setLocations([]);
    setLoading(true);
    setError(null);

    try {
      const weather = await fetchWeatherData(location.latitude, location.longitude, location.timezone);
      setWeatherData(weather);
    } catch (err) {
      setError('Failed to load weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    setSelectedLocation(null);
  };

  return (
    <CustomAppLayout
      breadcrumbs={
        <Breadcrumbs
          items={[
            { text: 'Home', href: '/' },
            { text: 'Weather Dashboard', href: '/weather' },
          ]}
        />
      }
      navigationHide
      toolsHide
      notifications={<Notifications />}
      content={
        <ContentLayout
          header={
            <Header
              variant="h1"
              description="Interactive weather forecasts and climate data powered by Open Meteo"
              actions={
                <Box textAlign="center">
                  <Box variant="small" color="text-body-secondary">
                    Data provided by Open-Meteo.com
                  </Box>
                </Box>
              }
            >
              Weather Dashboard
            </Header>
          }
        >
          <SpaceBetween size="l">
            <Container>
              <SpaceBetween size="m">
                <Header variant="h2">Search Location</Header>
                <Autosuggest
                  onChange={({ detail }) => handleSearchChange(detail.value)}
                  value={searchValue}
                  options={locations.map(loc => ({
                    value: `${loc.name}, ${loc.country}`,
                    label: `${loc.name}, ${loc.country}${loc.admin1 ? `, ${loc.admin1}` : ''}`,
                    labelTag: loc.country_code,
                    tags: loc.population ? [`Pop: ${loc.population.toLocaleString()}`] : [],
                    description: `Lat: ${loc.latitude.toFixed(2)}, Lon: ${loc.longitude.toFixed(2)}`,
                  }))}
                  onSelect={({ detail }) => {
                    const location = locations.find(loc => `${loc.name}, ${loc.country}` === detail.value);
                    if (location) {
                      handleLocationSelect(location);
                    }
                  }}
                  placeholder="Search for a city..."
                  ariaLabel="City search"
                  statusType={searchLoading ? 'loading' : 'finished'}
                  loadingText="Searching locations..."
                  empty="No locations found"
                  enteredTextLabel={value => `Use: "${value}"`}
                />
              </SpaceBetween>
            </Container>

            {error && (
              <Alert
                type="error"
                dismissible
                onDismiss={() => setError(null)}
                action={
                  selectedLocation ? (
                    <Button
                      onClick={() => {
                        setError(null);
                        handleLocationSelect(selectedLocation);
                      }}
                    >
                      Retry
                    </Button>
                  ) : undefined
                }
              >
                {error}
              </Alert>
            )}

            {loading && (
              <Container>
                <Box textAlign="center" padding={{ vertical: 'xxl' }}>
                  <Spinner size="large" />
                  <Box variant="p" padding={{ top: 's' }}>
                    Loading weather data...
                  </Box>
                </Box>
              </Container>
            )}

            {!loading && weatherData && selectedLocation && (
              <>
                <CurrentWeather weatherData={weatherData} location={selectedLocation} />

                <WeeklyForecast daily={weatherData.daily} timezone={weatherData.timezone} />

                <Grid gridDefinition={[{ colspan: { default: 12, s: 6 } }, { colspan: { default: 12, s: 6 } }]}>
                  <TemperatureChart hourly={weatherData.hourly} timezone={weatherData.timezone} />
                  <PrecipitationChart hourly={weatherData.hourly} timezone={weatherData.timezone} />
                </Grid>

                <Grid gridDefinition={[{ colspan: { default: 12, s: 6 } }, { colspan: { default: 12, s: 6 } }]}>
                  <WindChart hourly={weatherData.hourly} timezone={weatherData.timezone} />
                  <HumidityChart hourly={weatherData.hourly} daily={weatherData.daily} timezone={weatherData.timezone} />
                </Grid>
              </>
            )}
          </SpaceBetween>
        </ContentLayout>
      }
    />
  );
}
