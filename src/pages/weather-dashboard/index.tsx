// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useState, useEffect, useCallback } from 'react';
import AppLayout from '@cloudscape-design/components/app-layout';
import ContentLayout from '@cloudscape-design/components/content-layout';
import Header from '@cloudscape-design/components/header';
import Container from '@cloudscape-design/components/container';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Grid from '@cloudscape-design/components/grid';
import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import Input from '@cloudscape-design/components/input';
import FormField from '@cloudscape-design/components/form-field';
import Cards from '@cloudscape-design/components/cards';
import Badge from '@cloudscape-design/components/badge';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import Spinner from '@cloudscape-design/components/spinner';
import Select from '@cloudscape-design/components/select';
import BarChart from '@cloudscape-design/components/bar-chart';
import LineChart from '@cloudscape-design/components/line-chart';
import AreaChart from '@cloudscape-design/components/area-chart';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Tabs from '@cloudscape-design/components/tabs';

interface WeatherData {
  current: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    weather_code: number;
    apparent_temperature: number;
    precipitation: number;
    pressure_msl: number;
    visibility: number;
    uv_index: number;
  };
  current_units: {
    temperature_2m: string;
    relative_humidity_2m: string;
    wind_speed_10m: string;
    wind_direction_10m: string;
    apparent_temperature: string;
    precipitation: string;
    pressure_msl: string;
    visibility: string;
    uv_index: string;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    precipitation_probability: number[];
    precipitation: number[];
    weather_code: number[];
    wind_speed_10m: number[];
    relative_humidity_2m: number[];
    pressure_msl: number[];
    visibility: number[];
    uv_index: number[];
  };
  hourly_units: {
    temperature_2m: string;
    precipitation_probability: string;
    precipitation: string;
    wind_speed_10m: string;
    relative_humidity_2m: string;
    pressure_msl: string;
    visibility: string;
    uv_index: string;
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    weather_code: number[];
    wind_speed_10m_max: number[];
    wind_direction_10m_dominant: number[];
    precipitation_probability_max: number[];
    uv_index_max: number[];
    sunrise: string[];
    sunset: string[];
  };
  daily_units: {
    temperature_2m_max: string;
    temperature_2m_min: string;
    precipitation_sum: string;
    wind_speed_10m_max: string;
    wind_direction_10m_dominant: string;
    precipitation_probability_max: string;
    uv_index_max: string;
  };
}

interface LocationData {
  latitude: number;
  longitude: number;
  name: string;
  country?: string;
  admin1?: string;
  population?: number;
  id?: number;
}

interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation: number;
  feature_code: string;
  country_code: string;
  country: string;
  admin1?: string;
  admin2?: string;
  admin3?: string;
  admin4?: string;
  population?: number;
  postcodes?: string[];
  timezone: string;
}

const weatherCodeDescriptions: Record<number, { description: string; icon: string }> = {
  0: { description: 'Clear sky', icon: '☀️' },
  1: { description: 'Mainly clear', icon: '🌤️' },
  2: { description: 'Partly cloudy', icon: '⛅' },
  3: { description: 'Overcast', icon: '☁️' },
  45: { description: 'Fog', icon: '🌫️' },
  48: { description: 'Depositing rime fog', icon: '🌫️' },
  51: { description: 'Light drizzle', icon: '🌦️' },
  53: { description: 'Moderate drizzle', icon: '🌦️' },
  55: { description: 'Dense drizzle', icon: '🌦️' },
  61: { description: 'Slight rain', icon: '🌧️' },
  63: { description: 'Moderate rain', icon: '🌧️' },
  65: { description: 'Heavy rain', icon: '🌧️' },
  71: { description: 'Slight snow', icon: '🌨️' },
  73: { description: 'Moderate snow', icon: '🌨️' },
  75: { description: 'Heavy snow', icon: '❄️' },
  77: { description: 'Snow grains', icon: '🌨️' },
  80: { description: 'Slight rain showers', icon: '🌦️' },
  81: { description: 'Moderate rain showers', icon: '🌦️' },
  82: { description: 'Violent rain showers', icon: '⛈️' },
  85: { description: 'Slight snow showers', icon: '🌨️' },
  86: { description: 'Heavy snow showers', icon: '❄️' },
  95: { description: 'Thunderstorm', icon: '⛈️' },
  96: { description: 'Thunderstorm with slight hail', icon: '⛈️' },
  99: { description: 'Thunderstorm with heavy hail', icon: '⛈️' },
};

const getWeatherInfo = (code: number) => {
  return weatherCodeDescriptions[code] || { description: 'Unknown', icon: '❓' };
};

const defaultLocations: LocationData[] = [
  { latitude: 40.7128, longitude: -74.0060, name: 'New York, NY' },
  { latitude: 34.0522, longitude: -118.2437, name: 'Los Angeles, CA' },
  { latitude: 51.5074, longitude: -0.1278, name: 'London, UK' },
  { latitude: 48.8566, longitude: 2.3522, name: 'Paris, France' },
  { latitude: 35.6762, longitude: 139.6503, name: 'Tokyo, Japan' },
];

export default function WeatherDashboard() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<LocationData>(defaultLocations[0]);
  const [customLatitude, setCustomLatitude] = useState('');
  const [customLongitude, setCustomLongitude] = useState('');
  const [citySearchValue, setCitySearchValue] = useState('');
  const [citySearchOptions, setCitySearchOptions] = useState<Array<{ label: string; value: string; data: LocationData }>>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedCity, setSelectedCity] = useState<{ label: string; value: string; data: LocationData } | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const fetchWeatherData = async (latitude: number, longitude: number) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        current: 'temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,weather_code,apparent_temperature,precipitation,pressure_msl,visibility,uv_index',
        hourly: 'temperature_2m,precipitation_probability,precipitation,weather_code,wind_speed_10m,relative_humidity_2m,pressure_msl,visibility,uv_index',
        daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code,wind_speed_10m_max,wind_direction_10m_dominant,precipitation_probability_max,uv_index_max,sunrise,sunset',
        forecast_days: '7',
        timezone: 'auto',
      });

      const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: WeatherData = await response.json();
      setWeatherData(data);
    } catch (err) {
      console.error('Error fetching weather data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  const searchCities = useCallback(async (query: string) => {
    if (query.length < 2) {
      setCitySearchOptions([]);
      return;
    }

    setSearchLoading(true);
    try {
      const params = new URLSearchParams({
        name: query,
        count: '10',
        language: 'en',
        format: 'json'
      });

      const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${params}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: { results?: GeocodingResult[] } = await response.json();

      if (data.results) {
        const options = data.results.map((result) => {
          const locationData: LocationData = {
            latitude: result.latitude,
            longitude: result.longitude,
            name: result.name,
            country: result.country,
            admin1: result.admin1,
            population: result.population,
            id: result.id
          };

          const displayName = `${result.name}${result.admin1 ? `, ${result.admin1}` : ''}, ${result.country}`;

          return {
            label: displayName,
            value: `${result.id}`,
            data: locationData
          };
        });

        setCitySearchOptions(options);
      }
    } catch (err) {
      console.error('Error searching cities:', err);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeatherData(currentLocation.latitude, currentLocation.longitude);
  }, [currentLocation]);

  const handleLocationChange = (location: LocationData) => {
    setCurrentLocation(location);
  };

  const handleCustomLocationSubmit = () => {
    const lat = parseFloat(customLatitude);
    const lng = parseFloat(customLongitude);
    
    if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      const customLocation: LocationData = {
        latitude: lat,
        longitude: lng,
        name: `Custom (${lat.toFixed(2)}, ${lng.toFixed(2)})`,
      };
      setCurrentLocation(customLocation);
      setCustomLatitude('');
      setCustomLongitude('');
    } else {
      setError('Please enter valid latitude (-90 to 90) and longitude (-180 to 180) values');
    }
  };

  const getHourlyForecast = () => {
    if (!weatherData?.hourly) return [];
    
    return weatherData.hourly.time.slice(0, 12).map((time, index) => ({
      time: new Date(time).toLocaleTimeString('en-US', { hour: 'numeric' }),
      temperature: weatherData.hourly.temperature_2m[index],
      precipitation: weatherData.hourly.precipitation_probability[index],
      weatherCode: weatherData.hourly.weather_code[index],
    }));
  };

  return (
    <AppLayout
      navigationHide
      toolsHide
      content={
        <ContentLayout
          header={
            <Header variant="h1" description="Real-time weather information powered by Open-Meteo API">
              Weather Dashboard
            </Header>
          }
        >
          <SpaceBetween size="l">
            <Container>
              <SpaceBetween size="m">
                <Box variant="h2">Location</Box>
                <Grid gridDefinition={[{ colspan: 6 }, { colspan: 6 }]}>
                  <SpaceBetween size="s">
                    <Box variant="h3">Quick Locations</Box>
                    <SpaceBetween size="xs">
                      {defaultLocations.map((location) => (
                        <Button
                          key={`${location.latitude}-${location.longitude}`}
                          variant={currentLocation.name === location.name ? 'primary' : 'normal'}
                          onClick={() => handleLocationChange(location)}
                        >
                          {location.name}
                        </Button>
                      ))}
                    </SpaceBetween>
                  </SpaceBetween>
                  
                  <SpaceBetween size="s">
                    <Box variant="h3">Custom Location</Box>
                    <FormField label="Latitude">
                      <Input
                        value={customLatitude}
                        onChange={({ detail }) => setCustomLatitude(detail.value)}
                        placeholder="e.g., 40.7128"
                      />
                    </FormField>
                    <FormField label="Longitude">
                      <Input
                        value={customLongitude}
                        onChange={({ detail }) => setCustomLongitude(detail.value)}
                        placeholder="e.g., -74.0060"
                      />
                    </FormField>
                    <Button
                      variant="primary"
                      onClick={handleCustomLocationSubmit}
                      disabled={!customLatitude || !customLongitude}
                    >
                      Get Weather
                    </Button>
                  </SpaceBetween>
                </Grid>
              </SpaceBetween>
            </Container>

            {error && (
              <Container>
                <StatusIndicator type="error">{error}</StatusIndicator>
              </Container>
            )}

            {loading && (
              <Container>
                <Box textAlign="center">
                  <Spinner size="large" />
                  <Box variant="p" padding={{ top: 's' }}>
                    Loading weather data...
                  </Box>
                </Box>
              </Container>
            )}

            {weatherData && !loading && (
              <>
                <Container>
                  <SpaceBetween size="m">
                    <Box variant="h2">Current Weather - {currentLocation.name}</Box>
                    <Grid gridDefinition={[{ colspan: 4 }, { colspan: 4 }, { colspan: 4 }]}>
                      <Box textAlign="center">
                        <Box fontSize="display-l" color="text-status-info">
                          {getWeatherInfo(weatherData.current.weather_code).icon}
                        </Box>
                        <Box variant="h1" color="text-status-info">
                          {weatherData.current.temperature_2m}°{weatherData.current_units.temperature_2m}
                        </Box>
                        <Box variant="p">
                          {getWeatherInfo(weatherData.current.weather_code).description}
                        </Box>
                      </Box>
                      
                      <SpaceBetween size="s">
                        <Box>
                          <Badge color="blue">Humidity</Badge>
                          <Box variant="h3">{weatherData.current.relative_humidity_2m}%</Box>
                        </Box>
                        <Box>
                          <Badge color="green">Wind Speed</Badge>
                          <Box variant="h3">
                            {weatherData.current.wind_speed_10m} {weatherData.current_units.wind_speed_10m}
                          </Box>
                        </Box>
                      </SpaceBetween>
                      
                      <SpaceBetween size="s">
                        <Box>
                          <Badge color="grey">Wind Direction</Badge>
                          <Box variant="h3">{weatherData.current.wind_direction_10m}°</Box>
                        </Box>
                        <Box>
                          <Badge color="red">Last Updated</Badge>
                          <Box variant="p">
                            {new Date(weatherData.current.time).toLocaleString()}
                          </Box>
                        </Box>
                      </SpaceBetween>
                    </Grid>
                  </SpaceBetween>
                </Container>

                <Container>
                  <SpaceBetween size="m">
                    <Box variant="h2">12-Hour Forecast</Box>
                    <Cards
                      ariaLabels={{
                        itemSelectionLabel: (e, n) => `select ${n.time}`,
                        selectionGroupLabel: 'Hourly forecast selection',
                      }}
                      cardDefinition={{
                        header: item => item.time,
                        sections: [
                          {
                            id: 'weather',
                            content: item => (
                              <SpaceBetween size="xs" alignItems="center">
                                <Box textAlign="center" fontSize="heading-m">
                                  {getWeatherInfo(item.weatherCode).icon}
                                </Box>
                                <Box textAlign="center" variant="h3">
                                  {item.temperature}°{weatherData.hourly_units.temperature_2m}
                                </Box>
                                <Box textAlign="center" variant="small">
                                  {item.precipitation}% rain
                                </Box>
                              </SpaceBetween>
                            ),
                          },
                        ],
                      }}
                      cardsPerRow={[
                        { cards: 2, minWidth: 0 },
                        { cards: 4, minWidth: 600 },
                        { cards: 6, minWidth: 900 },
                        { cards: 8, minWidth: 1200 },
                      ]}
                      items={getHourlyForecast()}
                      loadingText="Loading forecast"
                      trackBy="time"
                      visibleSections={['weather']}
                    />
                  </SpaceBetween>
                </Container>
              </>
            )}
          </SpaceBetween>
        </ContentLayout>
      }
    />
  );
}
