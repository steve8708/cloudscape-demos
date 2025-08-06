// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useEffect, useState } from 'react';

import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Grid from '@cloudscape-design/components/grid';
import Box from '@cloudscape-design/components/box';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Select from '@cloudscape-design/components/select';
import Alert from '@cloudscape-design/components/alert';
import LineChart from '@cloudscape-design/components/line-chart';
import BarChart from '@cloudscape-design/components/bar-chart';

import { WeatherAPI, WeatherData, WeatherLocation, DEFAULT_LOCATIONS } from '../services/weather-api';
import { CurrentWeatherCard } from './current-weather-card';
import { DailyForecastCard } from './daily-forecast-card';

export function WeatherContent() {
  const [selectedLocation, setSelectedLocation] = useState(DEFAULT_LOCATIONS[0]);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeatherData = async (location: WeatherLocation) => {
    setLoading(true);
    setError(null);
    try {
      const data = await WeatherAPI.fetchWeatherData(location.latitude, location.longitude);
      setWeatherData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData(selectedLocation);
  }, [selectedLocation]);

  const prepareHourlyTemperatureData = () => {
    if (!weatherData) return [];

    // Get next 24 hours of data
    const hourlyData = weatherData.hourly.time.slice(0, 24).map((time, index) => ({
      x: new Date(time),
      y: weatherData.hourly.temperature_2m[index],
    }));

    return [
      {
        title: 'Temperature (°C)',
        type: 'line' as const,
        data: hourlyData,
      },
    ];
  };

  const preparePrecipitationData = () => {
    if (!weatherData) return [];

    // Get next 24 hours of precipitation data
    const precipData = weatherData.hourly.time.slice(0, 24).map((time, index) => ({
      x: new Date(time),
      y: weatherData.hourly.precipitation[index],
    }));

    return [
      {
        title: 'Precipitation (mm)',
        type: 'bar' as const,
        data: precipData,
      },
    ];
  };

  const prepareWindSpeedData = () => {
    if (!weatherData) return [];

    // Get next 24 hours of wind speed data
    const windData = weatherData.hourly.time.slice(0, 24).map((time, index) => ({
      x: new Date(time),
      y: weatherData.hourly.wind_speed_10m[index],
    }));

    return [
      {
        title: 'Wind Speed (km/h)',
        type: 'line' as const,
        data: windData,
      },
    ];
  };

  const prepareHumidityData = () => {
    if (!weatherData) return [];

    // Get next 24 hours of humidity data
    const humidityData = weatherData.hourly.time.slice(0, 24).map((time, index) => ({
      x: new Date(time),
      y: weatherData.hourly.relative_humidity_2m[index],
    }));

    return [
      {
        title: 'Humidity (%)',
        type: 'line' as const,
        data: humidityData,
      },
    ];
  };

  const commonChartProps = {
    loadingText: 'Loading chart data...',
    errorText: 'Error loading chart data',
    recoveryText: 'Retry',
    empty: (
      <Box textAlign="center" color="inherit">
        <b>No data available</b>
        <Box variant="p" color="inherit">
          There is no weather data available for this location
        </Box>
      </Box>
    ),
    i18nStrings: {
      legendAriaLabel: 'Legend',
      chartAriaRoleDescription: 'weather chart',
      xAxisAriaRoleDescription: 'time axis',
      yAxisAriaRoleDescription: 'value axis',
    },
  };

  return (
    <SpaceBetween size="l">
      <Container>
        <SpaceBetween size="m">
          <Header variant="h2">Location Selection</Header>
          <Select
            selectedOption={{
              label: selectedLocation.name,
              value: selectedLocation.name,
            }}
            onChange={({ detail }) => {
              const location = DEFAULT_LOCATIONS.find(loc => loc.name === detail.selectedOption.value);
              if (location) setSelectedLocation(location);
            }}
            options={DEFAULT_LOCATIONS.map(location => ({
              label: location.name,
              value: location.name,
            }))}
            placeholder="Select a location"
          />
        </SpaceBetween>
      </Container>

      {error && (
        <Alert type="error" header="Weather data error">
          {error}
        </Alert>
      )}

      {loading ? (
        <Container>
          <Box textAlign="center">
            <StatusIndicator type="loading">Loading weather data...</StatusIndicator>
          </Box>
        </Container>
      ) : (
        weatherData && (
          <SpaceBetween size="l">
            <Grid
              gridDefinition={[
                { colspan: { default: 12, xs: 12, s: 6, m: 6, l: 4, xl: 4 } },
                { colspan: { default: 12, xs: 12, s: 6, m: 6, l: 8, xl: 8 } },
              ]}
            >
              <CurrentWeatherCard weatherData={weatherData} />
              <DailyForecastCard weatherData={weatherData} />
            </Grid>

            <Container>
              <Header variant="h2">24-Hour Temperature Forecast</Header>
              <LineChart
                {...commonChartProps}
                series={prepareHourlyTemperatureData()}
                xDomain={weatherData.hourly.time.slice(0, 24).map(time => new Date(time))}
                yTitle="Temperature (°C)"
                xTitle="Time"
                height={300}
                hideFilter={true}
                xScaleType="time"
                yScaleType="linear"
              />
            </Container>

            <Grid
              gridDefinition={[
                { colspan: { default: 12, xs: 12, s: 12, m: 6, l: 6, xl: 6 } },
                { colspan: { default: 12, xs: 12, s: 12, m: 6, l: 6, xl: 6 } },
              ]}
            >
              <Container>
                <Header variant="h3">24-Hour Precipitation</Header>
                <BarChart
                  {...commonChartProps}
                  series={preparePrecipitationData()}
                  xDomain={weatherData.hourly.time.slice(0, 24).map(time => new Date(time))}
                  yTitle="Precipitation (mm)"
                  xTitle="Time"
                  height={250}
                  hideFilter={true}
                  xScaleType="time"
                  yScaleType="linear"
                />
              </Container>

              <Container>
                <Header variant="h3">24-Hour Wind Speed</Header>
                <LineChart
                  {...commonChartProps}
                  series={prepareWindSpeedData()}
                  xDomain={weatherData.hourly.time.slice(0, 24).map(time => new Date(time))}
                  yTitle="Wind Speed (km/h)"
                  xTitle="Time"
                  height={250}
                  hideFilter={true}
                  xScaleType="time"
                  yScaleType="linear"
                />
              </Container>
            </Grid>

            <Container>
              <Header variant="h3">24-Hour Humidity</Header>
              <LineChart
                {...commonChartProps}
                series={prepareHumidityData()}
                xDomain={weatherData.hourly.time.slice(0, 24).map(time => new Date(time))}
                yTitle="Humidity (%)"
                xTitle="Time"
                height={250}
                hideFilter={true}
                xScaleType="time"
                yScaleType="linear"
              />
            </Container>
          </SpaceBetween>
        )
      )}
    </SpaceBetween>
  );
}
