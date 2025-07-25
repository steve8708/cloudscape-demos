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
  { latitude: 40.7128, longitude: -74.006, name: 'New York, NY' },
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
  const [citySearchOptions, setCitySearchOptions] = useState<
    Array<{ label: string; value: string; data: LocationData }>
  >([]);
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
        current:
          'temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,weather_code,apparent_temperature,precipitation,pressure_msl,visibility,uv_index',
        hourly:
          'temperature_2m,precipitation_probability,precipitation,weather_code,wind_speed_10m,relative_humidity_2m,pressure_msl,visibility,uv_index',
        daily:
          'temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code,wind_speed_10m_max,wind_direction_10m_dominant,precipitation_probability_max,uv_index_max,sunrise,sunset',
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
        format: 'json',
      });

      const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${params}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: { results?: GeocodingResult[] } = await response.json();

      if (data.results) {
        const options = data.results.map(result => {
          const locationData: LocationData = {
            latitude: result.latitude,
            longitude: result.longitude,
            name: result.name,
            country: result.country,
            admin1: result.admin1,
            population: result.population,
            id: result.id,
          };

          const displayName = `${result.name}${result.admin1 ? `, ${result.admin1}` : ''}, ${result.country}`;

          return {
            label: displayName,
            value: `${result.id}`,
            data: locationData,
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

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (citySearchValue) {
        searchCities(citySearchValue);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [citySearchValue, searchCities]);

  const handleLocationChange = (location: LocationData) => {
    setCurrentLocation(location);
    setSelectedCity(null);
    setCitySearchValue('');
  };

  const handleCitySelect = (option: { label: string; value: string; data: LocationData }) => {
    setSelectedCity(option);
    setCurrentLocation(option.data);
    setCitySearchValue(option.label);
    setCitySearchOptions([]);
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
      setSelectedCity(null);
      setCitySearchValue('');
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

  const getDailyForecast = () => {
    if (!weatherData?.daily) return [];

    return weatherData.daily.time.map((time, index) => ({
      date: new Date(time).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      maxTemp: weatherData.daily.temperature_2m_max[index],
      minTemp: weatherData.daily.temperature_2m_min[index],
      precipitation: weatherData.daily.precipitation_sum[index],
      weatherCode: weatherData.daily.weather_code[index],
      windSpeed: weatherData.daily.wind_speed_10m_max[index],
      precipitationProbability: weatherData.daily.precipitation_probability_max[index],
      uvIndex: weatherData.daily.uv_index_max[index],
      sunrise: weatherData.daily.sunrise[index],
      sunset: weatherData.daily.sunset[index],
    }));
  };

  const getTemperatureChartData = () => {
    if (!weatherData?.hourly) return [];

    return weatherData.hourly.time.slice(0, 24).map((time, index) => ({
      x: new Date(time).toLocaleTimeString('en-US', { hour: 'numeric' }),
      y: weatherData.hourly.temperature_2m[index],
    }));
  };

  const getPrecipitationChartData = () => {
    if (!weatherData?.hourly) return [];

    return weatherData.hourly.time.slice(0, 24).map((time, index) => ({
      x: new Date(time).toLocaleTimeString('en-US', { hour: 'numeric' }),
      y: weatherData.hourly.precipitation[index],
    }));
  };

  const getWeeklyTemperatureData = () => {
    if (!weatherData?.daily) return [];

    return weatherData.daily.time.map((time, index) => ({
      x: new Date(time).toLocaleDateString('en-US', { weekday: 'short' }),
      y: weatherData.daily.temperature_2m_max[index],
    }));
  };

  const getWeeklyPrecipitationData = () => {
    if (!weatherData?.daily) return [];

    return weatherData.daily.time.map((time, index) => ({
      x: new Date(time).toLocaleDateString('en-US', { weekday: 'short' }),
      y: weatherData.daily.precipitation_sum[index],
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
                <Box variant="h2">Location Search</Box>
                <Grid gridDefinition={[{ colspan: 8 }, { colspan: 4 }]}>
                  <SpaceBetween size="s">
                    <FormField label="Search for any city">
                      <Input
                        value={citySearchValue}
                        onChange={({ detail }) => setCitySearchValue(detail.value)}
                        placeholder="Type city name (e.g., Bangkok, London, New York...)"
                        onKeyDown={e => {
                          if (e.detail.key === 'Enter' && citySearchOptions.length > 0) {
                            handleCitySelect(citySearchOptions[0]);
                          }
                        }}
                      />
                    </FormField>
                    {citySearchOptions.length > 0 && (
                      <Box>
                        <SpaceBetween size="xs">
                          {citySearchOptions.slice(0, 5).map(option => (
                            <Button key={option.value} variant="link" onClick={() => handleCitySelect(option)}>
                              {option.label}
                              {option.data.population && ` (Pop: ${option.data.population.toLocaleString()})`}
                            </Button>
                          ))}
                        </SpaceBetween>
                      </Box>
                    )}
                    {searchLoading && (
                      <Box>
                        <Spinner size="normal" /> Searching cities...
                      </Box>
                    )}
                  </SpaceBetween>

                  <SpaceBetween size="s">
                    <Box variant="h3">Quick Locations</Box>
                    <SpaceBetween size="xs">
                      {defaultLocations.map(location => (
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
                </Grid>

                <Grid gridDefinition={[{ colspan: 6 }, { colspan: 6 }]}>
                  <SpaceBetween size="s">
                    <Box variant="h3">Custom Coordinates</Box>
                    <FormField label="Latitude">
                      <Input
                        value={customLatitude}
                        onChange={({ detail }) => setCustomLatitude(detail.value)}
                        placeholder="e.g., 40.7128"
                      />
                    </FormField>
                  </SpaceBetween>

                  <SpaceBetween size="s">
                    <Box variant="h3">&nbsp;</Box>
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
                        <Box variant="p">{getWeatherInfo(weatherData.current.weather_code).description}</Box>
                        <Box variant="small" color="text-body-secondary">
                          Feels like {weatherData.current.apparent_temperature}°
                          {weatherData.current_units.apparent_temperature}
                        </Box>
                      </Box>

                      <ColumnLayout columns={2} variant="text-grid">
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
                        <Box>
                          <Badge color="red">Pressure</Badge>
                          <Box variant="h3">
                            {weatherData.current.pressure_msl} {weatherData.current_units.pressure_msl}
                          </Box>
                        </Box>
                        <Box>
                          <Badge color="grey">UV Index</Badge>
                          <Box variant="h3">{weatherData.current.uv_index}</Box>
                        </Box>
                      </ColumnLayout>

                      <ColumnLayout columns={2} variant="text-grid">
                        <Box>
                          <Badge color="grey">Wind Direction</Badge>
                          <Box variant="h3">{weatherData.current.wind_direction_10m}°</Box>
                        </Box>
                        <Box>
                          <Badge color="blue">Visibility</Badge>
                          <Box variant="h3">
                            {weatherData.current.visibility} {weatherData.current_units.visibility}
                          </Box>
                        </Box>
                        <Box>
                          <Badge color="red">Precipitation</Badge>
                          <Box variant="h3">
                            {weatherData.current.precipitation} {weatherData.current_units.precipitation}
                          </Box>
                        </Box>
                        <Box>
                          <Badge color="green">Last Updated</Badge>
                          <Box variant="small">{new Date(weatherData.current.time).toLocaleString()}</Box>
                        </Box>
                      </ColumnLayout>
                    </Grid>
                  </SpaceBetween>
                </Container>

                <Container>
                  <SpaceBetween size="m">
                    <Box variant="h2">7-Day Forecast</Box>
                    <div style={{ overflowX: 'auto', paddingBottom: '16px' }}>
                      <div style={{ display: 'flex', gap: '16px', minWidth: 'max-content' }}>
                        {getDailyForecast().map((day, index) => (
                          <div
                            key={index}
                            style={{
                              minWidth: '200px',
                              padding: '16px',
                              border: '1px solid var(--color-border-divider-default)',
                              borderRadius: '8px',
                              backgroundColor: 'var(--color-background-container-content)',
                            }}
                          >
                            <SpaceBetween size="s">
                              <Box variant="h3" textAlign="center">
                                {day.date}
                              </Box>
                              <Box textAlign="center" fontSize="heading-l">
                                {getWeatherInfo(day.weatherCode).icon}
                              </Box>
                              <ColumnLayout columns={1} variant="text-grid">
                                <Box textAlign="center">
                                  <Box variant="h2" color="text-status-info">
                                    {Math.round(day.maxTemp)}°
                                  </Box>
                                  <Box variant="p" color="text-body-secondary">
                                    {Math.round(day.minTemp)}°
                                  </Box>
                                </Box>
                                <Box textAlign="center">
                                  <Badge color="blue">{day.precipitationProbability}% rain</Badge>
                                </Box>
                                <Box textAlign="center" variant="small">
                                  💧 {day.precipitation}mm
                                </Box>
                                <Box textAlign="center" variant="small">
                                  💨 {day.windSpeed} {weatherData.daily_units.wind_speed_10m_max}
                                </Box>
                                <Box textAlign="center" variant="small">
                                  ☀️ UV {day.uvIndex}
                                </Box>
                              </ColumnLayout>
                            </SpaceBetween>
                          </div>
                        ))}
                      </div>
                    </div>
                  </SpaceBetween>
                </Container>

                <Tabs
                  tabs={[
                    {
                      id: 'overview',
                      label: 'Overview',
                      content: (
                        <SpaceBetween size="l">
                          <Container>
                            <SpaceBetween size="m">
                              <Box variant="h2">12-Hour Detailed Forecast</Box>
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
                        </SpaceBetween>
                      ),
                    },
                    {
                      id: 'charts',
                      label: 'Charts & Analytics',
                      content: (
                        <SpaceBetween size="l">
                          <Container>
                            <SpaceBetween size="m">
                              <Box variant="h2">24-Hour Temperature Trend</Box>
                              <LineChart
                                series={[
                                  {
                                    title: `Temperature (${weatherData.hourly_units.temperature_2m})`,
                                    type: 'line',
                                    data: getTemperatureChartData(),
                                    color: '#FF6B6B',
                                  },
                                ]}
                                xDomain={getTemperatureChartData().map(d => d.x)}
                                yTitle={`Temperature (${weatherData.hourly_units.temperature_2m})`}
                                xTitle="Time"
                                height={300}
                                hideFilter
                                hideLegend
                              />
                            </SpaceBetween>
                          </Container>

                          <Container>
                            <SpaceBetween size="m">
                              <Box variant="h2">24-Hour Precipitation</Box>
                              <BarChart
                                series={[
                                  {
                                    title: `Precipitation (${weatherData.hourly_units.precipitation})`,
                                    type: 'bar',
                                    data: getPrecipitationChartData(),
                                  },
                                ]}
                                xDomain={getPrecipitationChartData().map(d => d.x)}
                                yTitle={`Precipitation (${weatherData.hourly_units.precipitation})`}
                                xTitle="Time"
                                height={300}
                                hideFilter
                                hideLegend
                              />
                            </SpaceBetween>
                          </Container>

                          <Grid gridDefinition={[{ colspan: 6 }, { colspan: 6 }]}>
                            <Container>
                              <SpaceBetween size="m">
                                <Box variant="h2">Weekly Temperature Highs</Box>
                                <AreaChart
                                  series={[
                                    {
                                      title: `Max Temp (${weatherData.daily_units.temperature_2m_max})`,
                                      type: 'area',
                                      data: getWeeklyTemperatureData(),
                                      color: '#4ECDC4',
                                    },
                                  ]}
                                  xDomain={getWeeklyTemperatureData().map(d => d.x)}
                                  yTitle={`Temperature (${weatherData.daily_units.temperature_2m_max})`}
                                  xTitle="Day"
                                  height={250}
                                  hideFilter
                                  hideLegend
                                />
                              </SpaceBetween>
                            </Container>

                            <Container>
                              <SpaceBetween size="m">
                                <Box variant="h2">Weekly Precipitation</Box>
                                <BarChart
                                  series={[
                                    {
                                      title: `Precipitation (${weatherData.daily_units.precipitation_sum})`,
                                      type: 'bar',
                                      data: getWeeklyPrecipitationData(),
                                    },
                                  ]}
                                  xDomain={getWeeklyPrecipitationData().map(d => d.x)}
                                  yTitle={`Precipitation (${weatherData.daily_units.precipitation_sum})`}
                                  xTitle="Day"
                                  height={250}
                                  hideFilter
                                  hideLegend
                                />
                              </SpaceBetween>
                            </Container>
                          </Grid>
                        </SpaceBetween>
                      ),
                    },
                  ]}
                  activeTabId={activeTab}
                  onChange={({ detail }) => setActiveTab(detail.activeTabId)}
                />
              </>
            )}
          </SpaceBetween>
        </ContentLayout>
      }
    />
  );
}
