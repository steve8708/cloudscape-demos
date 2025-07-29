// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useState, useEffect } from 'react';
import AppLayout from '@cloudscape-design/components/app-layout';
import ContentLayout from '@cloudscape-design/components/content-layout';
import Header from '@cloudscape-design/components/header';
import Container from '@cloudscape-design/components/container';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Grid from '@cloudscape-design/components/grid';
import Box from '@cloudscape-design/components/box';
import Input from '@cloudscape-design/components/input';
import Button from '@cloudscape-design/components/button';
import Icon from '@cloudscape-design/components/icon';
import Spinner from '@cloudscape-design/components/spinner';
import Alert from '@cloudscape-design/components/alert';
import Badge from '@cloudscape-design/components/badge';

interface WeatherData {
  current: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    weather_code: number;
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weather_code: number[];
    precipitation_sum: number[];
    wind_speed_10m_max: number[];
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    relative_humidity_2m: number[];
    precipitation: number[];
  };
}

interface LocationData {
  latitude: number;
  longitude: number;
  name: string;
  admin1: string;
  country: string;
}

const WEATHER_CODES: { [key: number]: { description: string; icon: string } } = {
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

export default function WeatherDashboard() {
  const [locationQuery, setLocationQuery] = useState('San Francisco, CA');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchLocation = async (query: string) => {
    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en&format=json`
      );
      const data = await response.json();
      return data.results?.[0] || null;
    } catch (err) {
      console.error('Location search failed:', err);
      return null;
    }
  };

  const fetchWeatherData = async (lat: number, lon: number) => {
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_sum,wind_speed_10m_max&hourly=temperature_2m,relative_humidity_2m,precipitation&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=auto&forecast_days=7`
      );
      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Weather fetch failed:', err);
      return null;
    }
  };

  const handleLocationSearch = async () => {
    if (!locationQuery.trim()) return;

    setLoading(true);
    setError(null);

    const location = await searchLocation(locationQuery);
    if (!location) {
      setError('Location not found. Please try a different search term.');
      setLoading(false);
      return;
    }

    setCurrentLocation(location);
    const weather = await fetchWeatherData(location.latitude, location.longitude);
    
    if (!weather) {
      setError('Failed to fetch weather data. Please try again.');
      setLoading(false);
      return;
    }

    setWeatherData(weather);
    setLoading(false);
  };

  useEffect(() => {
    handleLocationSearch();
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const getWeatherInfo = (code: number) => {
    return WEATHER_CODES[code] || { description: 'Unknown', icon: '❓' };
  };

  return (
    <AppLayout
      navigationHide
      toolsHide
      content={
        <ContentLayout
          header={
            <Header variant="h1">Weather Dashboard</Header>
          }
        >
          <SpaceBetween size="l">
            {/* Location Search */}
            <Container>
              <SpaceBetween size="s">
                <Box variant="h2">Location Search</Box>
                <Grid gridDefinition={[{ colspan: { default: 8, xs: 12 } }, { colspan: { default: 4, xs: 12 } }]}>
                  <Input
                    value={locationQuery}
                    onChange={({ detail }) => setLocationQuery(detail.value)}
                    placeholder="Enter city name..."
                    onKeyDown={(e) => {
                      if (e.detail.key === 'Enter') {
                        handleLocationSearch();
                      }
                    }}
                  />
                  <Button 
                    variant="primary" 
                    onClick={handleLocationSearch}
                    loading={loading}
                    iconName="search"
                  >
                    Search
                  </Button>
                </Grid>
              </SpaceBetween>
            </Container>

            {error && (
              <Alert type="error" dismissible onDismiss={() => setError(null)}>
                {error}
              </Alert>
            )}

            {loading && (
              <Container>
                <Box textAlign="center" padding="xl">
                  <Spinner size="large" />
                  <Box variant="p" padding={{ top: 's' }}>Loading weather data...</Box>
                </Box>
              </Container>
            )}

            {/* Current Weather */}
            {weatherData && currentLocation && !loading && (
              <Container>
                <SpaceBetween size="m">
                  <Box variant="h2">Current Weather</Box>
                  <Grid gridDefinition={[{ colspan: 6 }, { colspan: 6 }]}>
                    <SpaceBetween size="s">
                      <Box fontSize="display-l" fontWeight="bold">
                        {Math.round(weatherData.current.temperature_2m)}°F
                      </Box>
                      <Box variant="h3" color="text-status-inactive">
                        {currentLocation.name}, {currentLocation.admin1}
                      </Box>
                      <Box variant="p">
                        {getWeatherInfo(weatherData.current.weather_code).icon} {getWeatherInfo(weatherData.current.weather_code).description}
                      </Box>
                    </SpaceBetween>
                    <SpaceBetween size="s">
                      <Box>
                        <Badge color="blue">Humidity: {weatherData.current.relative_humidity_2m}%</Badge>
                      </Box>
                      <Box>
                        <Badge color="grey">Wind: {Math.round(weatherData.current.wind_speed_10m)} mph</Badge>
                      </Box>
                    </SpaceBetween>
                  </Grid>
                </SpaceBetween>
              </Container>
            )}

            {/* 7-Day Forecast */}
            {weatherData && !loading && (
              <Container>
                <SpaceBetween size="m">
                  <Box variant="h2">7-Day Forecast</Box>
                  <div style={{ overflowX: 'auto', paddingBottom: '8px' }}>
                    <div style={{ display: 'flex', gap: '16px', minWidth: '800px' }}>
                      {weatherData.daily.time.map((date, index) => (
                        <div
                          key={date}
                          style={{
                            border: '1px solid #e1e5e9',
                            borderRadius: '8px',
                            padding: '16px',
                            minWidth: '120px',
                            textAlign: 'center',
                            backgroundColor: '#fafbfc'
                          }}
                        >
                          <SpaceBetween size="xs">
                            <Box variant="small" fontWeight="bold">
                              {formatDate(date)}
                            </Box>
                            <Box fontSize="body-s">
                              {getWeatherInfo(weatherData.daily.weather_code[index]).icon}
                            </Box>
                            <Box variant="small" fontWeight="bold">
                              {Math.round(weatherData.daily.temperature_2m_max[index])}°
                            </Box>
                            <Box variant="small" color="text-status-inactive">
                              {Math.round(weatherData.daily.temperature_2m_min[index])}°
                            </Box>
                            <Box variant="small">
                              🌧️ {weatherData.daily.precipitation_sum[index]}"
                            </Box>
                          </SpaceBetween>
                        </div>
                      ))}
                    </div>
                  </div>
                </SpaceBetween>
              </Container>
            )}

            {/* Additional Charts and Data */}
            {weatherData && !loading && (
              <Container>
                <SpaceBetween size="m">
                  <Box variant="h2">Additional Weather Data</Box>
                  <Grid gridDefinition={[{ colspan: 6 }, { colspan: 6 }]}>
                    <SpaceBetween size="s">
                      <Box variant="h3">Today's Hourly Temperature</Box>
                      <div style={{ height: '200px', display: 'flex', alignItems: 'end', gap: '4px', border: '1px solid #e1e5e9', borderRadius: '8px', padding: '16px' }}>
                        {weatherData.hourly.time.slice(0, 24).map((time, index) => {
                          const temp = weatherData.hourly.temperature_2m[index];
                          const maxTemp = Math.max(...weatherData.hourly.temperature_2m.slice(0, 24));
                          const minTemp = Math.min(...weatherData.hourly.temperature_2m.slice(0, 24));
                          const height = ((temp - minTemp) / (maxTemp - minTemp)) * 150 + 20;
                          
                          return (
                            <div
                              key={time}
                              style={{
                                height: `${height}px`,
                                backgroundColor: '#0073bb',
                                width: '8px',
                                borderRadius: '2px',
                                position: 'relative'
                              }}
                              title={`${new Date(time).getHours()}:00 - ${Math.round(temp)}°F`}
                            />
                          );
                        })}
                      </div>
                      <Box variant="small" textAlign="center">Hourly temperature for the next 24 hours</Box>
                    </SpaceBetween>
                    
                    <SpaceBetween size="s">
                      <Box variant="h3">Weekly Trends</Box>
                      <Box padding="s" style={{ border: '1px solid #e1e5e9', borderRadius: '8px' }}>
                        <SpaceBetween size="s">
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Box variant="small">Avg High:</Box>
                            <Box variant="small" fontWeight="bold">
                              {Math.round(
                                weatherData.daily.temperature_2m_max.reduce((a, b) => a + b, 0) / 
                                weatherData.daily.temperature_2m_max.length
                              )}°F
                            </Box>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Box variant="small">Avg Low:</Box>
                            <Box variant="small" fontWeight="bold">
                              {Math.round(
                                weatherData.daily.temperature_2m_min.reduce((a, b) => a + b, 0) / 
                                weatherData.daily.temperature_2m_min.length
                              )}°F
                            </Box>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Box variant="small">Total Precipitation:</Box>
                            <Box variant="small" fontWeight="bold">
                              {weatherData.daily.precipitation_sum.reduce((a, b) => a + b, 0).toFixed(1)}"
                            </Box>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Box variant="small">Max Wind:</Box>
                            <Box variant="small" fontWeight="bold">
                              {Math.round(Math.max(...weatherData.daily.wind_speed_10m_max))} mph
                            </Box>
                          </div>
                        </SpaceBetween>
                      </Box>
                    </SpaceBetween>
                  </Grid>
                </SpaceBetween>
              </Container>
            )}
          </SpaceBetween>
        </ContentLayout>
      }
    />
  );
}
