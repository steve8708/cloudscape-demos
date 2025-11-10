// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Grid from '@cloudscape-design/components/grid';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import { GeocodingResult, WeatherData } from '../types';
import { formatTemperature, getWeatherIcon, getWeatherDescription, getWindDirection } from '../utils';
import TemperatureChart from './TemperatureChart';
import PrecipitationChart from './PrecipitationChart';
import WindChart from './WindChart';
import ForecastCards from './ForecastCards';

interface WeatherDataDisplayProps {
  weatherData: WeatherData;
  selectedLocation: GeocodingResult;
}

export default function WeatherDataDisplay({ weatherData, selectedLocation }: WeatherDataDisplayProps) {
  const currentWeather = {
    temp: weatherData.hourly.temperature_2m[0],
    weatherCode: weatherData.hourly.weathercode[0],
    humidity: weatherData.hourly.relativehumidity_2m[0],
    windSpeed: weatherData.hourly.windspeed_10m[0],
    windDirection: weatherData.hourly.winddirection_10m[0],
    pressure: weatherData.hourly.pressure_msl[0],
    visibility: weatherData.hourly.visibility[0],
  };

  return (
    <>
      <Container
        header={
          <Header variant="h2">
            Current Weather - {selectedLocation.name}
            {selectedLocation.country && `, ${selectedLocation.country}`}
          </Header>
        }
      >
        <div className="current-weather">
          <Grid
            gridDefinition={[{ colspan: { default: 12, xs: 12, s: 4 } }, { colspan: { default: 12, xs: 12, s: 8 } }]}
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
                  {Math.round(currentWeather.windSpeed)} km/h {getWindDirection(currentWeather.windDirection)}
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
  );
}
