// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useState, useEffect } from 'react';
import AppLayout from '@cloudscape-design/components/app-layout';
import ContentLayout from '@cloudscape-design/components/content-layout';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Container from '@cloudscape-design/components/container';
import Select from '@cloudscape-design/components/select';
import Box from '@cloudscape-design/components/box';
import Alert from '@cloudscape-design/components/alert';
import Spinner from '@cloudscape-design/components/spinner';
import Grid from '@cloudscape-design/components/grid';
import KeyValuePairs from '@cloudscape-design/components/key-value-pairs';
import Badge from '@cloudscape-design/components/badge';
import { 
  WeatherData, 
  Location, 
  defaultLocations, 
  fetchWeatherData, 
  formatTemperature, 
  formatHumidity, 
  formatWindSpeed, 
  formatPressure,
  weatherCodes 
} from './weather-api';
import WeatherChartsGrid from './weather-charts';

export default function WeatherDashboardApp() {
  const [selectedLocation, setSelectedLocation] = useState<Location>(defaultLocations[0]);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const locationOptions = defaultLocations.map(location => ({
    label: location.name,
    value: location.name,
    description: `${location.latitude}°, ${location.longitude}°`,
  }));

  const loadWeatherData = async (location: Location) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWeatherData(location);
      setWeatherData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load weather data');
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeatherData(selectedLocation);
  }, [selectedLocation]);

  const handleLocationChange = (detail: any) => {
    const location = defaultLocations.find(loc => loc.name === detail.selectedOption.value);
    if (location) {
      setSelectedLocation(location);
    }
  };

  const currentWeather = weatherData?.current;
  const weatherInfo = currentWeather && weatherCodes[currentWeather.weather_code];

  return (
    <AppLayout
      navigationHide
      toolsHide
      content={
        <ContentLayout
          header={
            <Header
              variant="h1"
              description="Real-time weather data and forecasts powered by Open-Meteo API"
            >
              Weather Dashboard
            </Header>
          }
        >
          <SpaceBetween size="l">
            {error && (
              <Alert type="error" dismissible onDismiss={() => setError(null)}>
                {error}
              </Alert>
            )}

            <Container>
              <SpaceBetween size="m">
                <Box variant="h2">Location</Box>
                <Grid gridDefinition={[{ colspan: { default: 12, s: 6, m: 4 } }]}>
                  <Select
                    selectedOption={locationOptions.find(opt => opt.value === selectedLocation.name) || null}
                    onChange={({ detail }) => handleLocationChange(detail)}
                    options={locationOptions}
                    placeholder="Select a location"
                    expandToViewport={true}
                  />
                </Grid>
              </SpaceBetween>
            </Container>

            {currentWeather && (
              <Container header={<Header variant="h2">Current Weather</Header>}>
                <Grid gridDefinition={[
                  { colspan: { default: 12, s: 6, m: 3 } },
                  { colspan: { default: 12, s: 6, m: 9 } }
                ]}>
                  <Box textAlign="center">
                    <SpaceBetween size="s">
                      <Box fontSize="display-l">
                        {weatherInfo?.icon || '🌤️'}
                      </Box>
                      <Box variant="h1" color="text-status-info">
                        {formatTemperature(currentWeather.temperature_2m)}
                      </Box>
                      <Badge color="blue">
                        {weatherInfo?.description || 'Unknown'}
                      </Badge>
                    </SpaceBetween>
                  </Box>
                  
                  <KeyValuePairs
                    columns={2}
                    items={[
                      {
                        label: 'Humidity',
                        value: formatHumidity(currentWeather.relative_humidity_2m),
                      },
                      {
                        label: 'Wind Speed',
                        value: formatWindSpeed(currentWeather.wind_speed_10m),
                      },
                      {
                        label: 'Pressure',
                        value: formatPressure(currentWeather.surface_pressure),
                      },
                      {
                        label: 'Last Updated',
                        value: new Date(currentWeather.time).toLocaleString(),
                      },
                    ]}
                  />
                </Grid>
              </Container>
            )}

            {loading && !weatherData && (
              <Container>
                <Box textAlign="center" padding="xxl">
                  <SpaceBetween size="m">
                    <Spinner size="large" />
                    <Box variant="p">Loading weather data...</Box>
                  </SpaceBetween>
                </Box>
              </Container>
            )}

            <WeatherChartsGrid weatherData={weatherData} loading={loading} />
          </SpaceBetween>
        </ContentLayout>
      }
    />
  );
}
