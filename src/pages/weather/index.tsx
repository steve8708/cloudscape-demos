// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useState, useEffect, useCallback, useRef } from 'react';
import AppLayout from '@cloudscape-design/components/app-layout';
import ContentLayout from '@cloudscape-design/components/content-layout';
import Header from '@cloudscape-design/components/header';
import Container from '@cloudscape-design/components/container';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Grid from '@cloudscape-design/components/grid';
import Box from '@cloudscape-design/components/box';
import Autosuggest from '@cloudscape-design/components/autosuggest';
import Spinner from '@cloudscape-design/components/spinner';
import Alert from '@cloudscape-design/components/alert';
import Button from '@cloudscape-design/components/button';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import { searchCities, getWeatherData } from './api';
import { GeocodingResult, WeatherData } from './types';
import {
  formatLocationName,
  formatTemperature,
  getWeatherIcon,
  getWeatherDescription,
  getWindDirection,
} from './utils';
import TemperatureChart from './components/TemperatureChart';
import PrecipitationChart from './components/PrecipitationChart';
import WindChart from './components/WindChart';
import ForecastCards from './components/ForecastCards';
import '../../styles/weather.scss';

export default function WeatherDashboard() {
  const [searchValue, setSearchValue] = useState('');
  const [searchOptions, setSearchOptions] = useState<GeocodingResult[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<GeocodingResult | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const isInitializedRef = useRef(false);

  // Debounced city search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchValue.trim().length >= 2) {
        setSearchLoading(true);
        try {
          const results = await searchCities(searchValue);
          setSearchOptions(results);
        } catch (err) {
          console.error('Error during city search:', err);
          setSearchOptions([]);
        } finally {
          setSearchLoading(false);
        }
      } else {
        setSearchOptions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue]);

  const loadWeatherData = useCallback(async (location: GeocodingResult) => {
    setLoading(true);
    setError(null);

    try {
      const data = await getWeatherData(location.latitude, location.longitude);
      if (data) {
        setWeatherData(data);
      } else {
        setError('Failed to load weather data. Please try again.');
      }
    } catch (err) {
      console.error('Error loading weather data:', err);
      setError('An error occurred while loading weather data.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLocationSelect = useCallback(
    (location: GeocodingResult) => {
      setSelectedLocation(location);
      setSearchValue(formatLocationName(location));
      loadWeatherData(location);
    },
    [loadWeatherData],
  );

  // Load default location (San Francisco) on mount only once
  useEffect(() => {
    if (!isInitializedRef.current) {
      isInitializedRef.current = true;
      const defaultLocation: GeocodingResult = {
        id: 5391959,
        name: 'San Francisco',
        latitude: 37.7749,
        longitude: -122.4194,
        country: 'United States',
        admin1: 'California',
      };
      setSelectedLocation(defaultLocation);
      setSearchValue(formatLocationName(defaultLocation));
      loadWeatherData(defaultLocation);
    }
  }, []);

  const currentWeather = weatherData
    ? {
        temp: weatherData.hourly.temperature_2m[0],
        weatherCode: weatherData.hourly.weathercode[0],
        humidity: weatherData.hourly.relativehumidity_2m[0],
        windSpeed: weatherData.hourly.windspeed_10m[0],
        windDirection: weatherData.hourly.winddirection_10m[0],
        pressure: weatherData.hourly.pressure_msl[0],
        visibility: weatherData.hourly.visibility[0],
      }
    : null;

  return (
    <AppLayout
      navigationHide
      toolsHide
      content={
        <ContentLayout
          header={
            <Header
              variant="h1"
              description="Search for any city worldwide to view detailed weather forecasts and conditions"
              actions={
                <Button iconName="refresh" onClick={() => selectedLocation && loadWeatherData(selectedLocation)}>
                  Refresh
                </Button>
              }
            >
              Weather Dashboard
            </Header>
          }
        >
          <SpaceBetween size="l">
            <Container>
              <SpaceBetween size="m">
                <Box variant="h2">Search Location</Box>
                <Autosuggest
                  onChange={({ detail }) => setSearchValue(detail.value)}
                  onSelect={({ detail }) => {
                    const location = searchOptions.find(opt => opt.id === parseInt(detail.value));
                    if (location) {
                      handleLocationSelect(location);
                    }
                  }}
                  value={searchValue}
                  options={searchOptions.map(location => ({
                    value: location.id.toString(),
                    label: formatLocationName(location),
                  }))}
                  placeholder="Search for a city..."
                  ariaLabel="City search"
                  statusType={searchLoading ? 'loading' : 'finished'}
                  empty="No cities found"
                  loadingText="Searching cities..."
                />
              </SpaceBetween>
            </Container>

            {error && (
              <Alert type="error" dismissible onDismiss={() => setError(null)}>
                {error}
              </Alert>
            )}

            {loading && (
              <Container>
                <Box textAlign="center" padding={{ vertical: 'xxl' }}>
                  <Spinner size="large" />
                  <Box variant="p" padding={{ top: 'm' }}>
                    Loading weather data...
                  </Box>
                </Box>
              </Container>
            )}

            {!loading && weatherData && selectedLocation && (
              <>
                <Container
                  header={
                    <Header variant="h2">
                      Current Weather - {selectedLocation.name}
                      {selectedLocation.country && `, ${selectedLocation.country}`}
                    </Header>
                  }
                >
                  {currentWeather && (
                    <div className="current-weather">
                      <Grid
                        gridDefinition={[
                          { colspan: { default: 12, xs: 12, s: 4 } },
                          { colspan: { default: 12, xs: 12, s: 8 } },
                        ]}
                      >
                        <div className="current-weather-main">
                          <Box fontSize="display-l" textAlign="center" padding={{ vertical: 'm' }}>
                            {getWeatherIcon(currentWeather.weatherCode)}
                          </Box>
                          <Box fontSize="heading-xl" textAlign="center" fontWeight="bold">
                            {formatTemperature(currentWeather.temp)}
                          </Box>
                          <Box fontSize="heading-s" textAlign="center" color="text-body-secondary">
                            {getWeatherDescription(currentWeather.weatherCode)}
                          </Box>
                        </div>
                        <ColumnLayout columns={2} variant="text-grid">
                          <div>
                            <Box variant="awsui-key-label">Humidity</Box>
                            <Box variant="awsui-value-large">{currentWeather.humidity}%</Box>
                          </div>
                          <div>
                            <Box variant="awsui-key-label">Wind</Box>
                            <Box variant="awsui-value-large">
                              {Math.round(currentWeather.windSpeed)} km/h{' '}
                              {getWindDirection(currentWeather.windDirection)}
                            </Box>
                          </div>
                          <div>
                            <Box variant="awsui-key-label">Pressure</Box>
                            <Box variant="awsui-value-large">{Math.round(currentWeather.pressure)} hPa</Box>
                          </div>
                          <div>
                            <Box variant="awsui-key-label">Visibility</Box>
                            <Box variant="awsui-value-large">{(currentWeather.visibility / 1000).toFixed(1)} km</Box>
                          </div>
                        </ColumnLayout>
                      </Grid>
                    </div>
                  )}
                </Container>

                <Container header={<Header variant="h2">7-Day Forecast</Header>}>
                  <ForecastCards dailyData={weatherData.daily} />
                </Container>

                <Container header={<Header variant="h2">24-Hour Temperature Trend</Header>}>
                  <TemperatureChart hourlyData={weatherData.hourly} />
                </Container>

                <Grid gridDefinition={[{ colspan: { default: 12, m: 6 } }, { colspan: { default: 12, m: 6 } }]}>
                  <Container header={<Header variant="h2">24-Hour Wind Speed</Header>}>
                    <WindChart hourlyData={weatherData.hourly} />
                  </Container>

                  <Container header={<Header variant="h2">7-Day Precipitation</Header>}>
                    <PrecipitationChart dailyData={weatherData.daily} />
                  </Container>
                </Grid>
              </>
            )}
          </SpaceBetween>
        </ContentLayout>
      }
    />
  );
}
