// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import LineChart from '@cloudscape-design/components/line-chart';
import BarChart from '@cloudscape-design/components/bar-chart';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Grid from '@cloudscape-design/components/grid';
import { LineChartProps } from '@cloudscape-design/components/line-chart';
import { BarChartProps } from '@cloudscape-design/components/bar-chart';
import { WeatherData, formatTemperature, formatHumidity, formatWindSpeed, formatPressure, TemperatureUnit } from './weather-api';

const commonChartProps = {
  loadingText: 'Loading weather data...',
  errorText: 'Error loading weather data.',
  recoveryText: 'Retry',
  hideFilter: true,
  fitHeight: true,
  height: 300,
};

const dateFormatter = (date: Date) =>
  date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    hour12: false,
  });

interface WeatherChartsProps {
  weatherData: WeatherData | null;
  loading: boolean;
  temperatureUnit: TemperatureUnit;
}

export function TemperatureChart({ weatherData, loading, temperatureUnit }: WeatherChartsProps) {
  if (!weatherData) {
    return null;
  }

  const hourlyData = weatherData.hourly.time.slice(0, 24).map((time, index) => ({
    x: new Date(time),
    y: weatherData.hourly.temperature_2m[index],
  }));

  const series: LineChartProps<Date>['series'] = [
    {
      title: 'Temperature',
      type: 'line',
      data: hourlyData,
      valueFormatter: (value) => formatTemperature(value),
    },
  ];

  return (
    <Container header={<Header variant="h2">24-Hour Temperature Trend</Header>}>
      <LineChart
        {...commonChartProps}
        series={series}
        xScaleType="time"
        xTitle="Time"
        yTitle="Temperature (°C)"
        ariaLabel="24-hour temperature chart"
        loading={loading}
        i18nStrings={{
          filterLabel: 'Filter data',
          filterPlaceholder: 'Filter',
          filterSelectedAriaLabel: 'selected',
          legendAriaLabel: 'Legend',
          chartAriaRoleDescription: 'Temperature line chart',
          xTickFormatter: dateFormatter,
        }}
      />
    </Container>
  );
}

export function WeatherMetricsChart({ weatherData, loading, temperatureUnit }: WeatherChartsProps) {
  if (!weatherData) {
    return null;
  }

  const currentData = [
    { x: 'Humidity', y: weatherData.current.relative_humidity_2m },
    { x: 'Wind Speed', y: weatherData.current.wind_speed_10m },
    { x: 'Pressure', y: weatherData.current.surface_pressure / 10 }, // Scale down for visualization
  ];

  const series: BarChartProps<string>['series'] = [
    {
      title: 'Current Weather Metrics',
      type: 'bar',
      data: currentData,
      valueFormatter: (value, category) => {
        switch (category) {
          case 'Humidity':
            return formatHumidity(value);
          case 'Wind Speed':
            return formatWindSpeed(value);
          case 'Pressure':
            return formatPressure(value * 10); // Scale back up
          default:
            return value.toString();
        }
      },
    },
  ];

  return (
    <Container header={<Header variant="h2">Current Weather Metrics</Header>}>
      <BarChart
        {...commonChartProps}
        series={series}
        xScaleType="categorical"
        xTitle="Metrics"
        yTitle="Values"
        ariaLabel="Current weather metrics chart"
        loading={loading}
        i18nStrings={{
          filterLabel: 'Filter metrics',
          filterPlaceholder: 'Filter',
          filterSelectedAriaLabel: 'selected',
          legendAriaLabel: 'Legend',
          chartAriaRoleDescription: 'Weather metrics bar chart',
        }}
      />
    </Container>
  );
}

export function WeeklyForecastChart({ weatherData, loading, temperatureUnit }: WeatherChartsProps) {
  if (!weatherData) {
    return null;
  }

  const dailyData = weatherData.daily.time.map((time, index) => ({
    x: new Date(time),
    yMax: weatherData.daily.temperature_2m_max[index],
    yMin: weatherData.daily.temperature_2m_min[index],
  }));

  const maxTempSeries: LineChartProps<Date>['series'] = [
    {
      title: 'Max Temperature',
      type: 'line',
      data: dailyData.map(d => ({ x: d.x, y: d.yMax })),
      valueFormatter: (value) => formatTemperature(value, temperatureUnit),
    },
    {
      title: 'Min Temperature',
      type: 'line',
      data: dailyData.map(d => ({ x: d.x, y: d.yMin })),
      valueFormatter: (value) => formatTemperature(value, temperatureUnit),
    },
  ];

  return (
    <Container header={<Header variant="h2">7-Day Temperature Forecast</Header>}>
      <LineChart
        {...commonChartProps}
        series={maxTempSeries}
        xScaleType="time"
        xTitle="Date"
        yTitle="Temperature (°C)"
        ariaLabel="7-day temperature forecast chart"
        loading={loading}
        i18nStrings={{
          filterLabel: 'Filter temperature ranges',
          filterPlaceholder: 'Filter',
          filterSelectedAriaLabel: 'selected',
          legendAriaLabel: 'Legend',
          chartAriaRoleDescription: 'Weekly temperature forecast line chart',
          xTickFormatter: (date: Date) => 
            date.toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric' 
            }),
        }}
      />
    </Container>
  );
}

export function PrecipitationChart({ weatherData, loading, temperatureUnit }: WeatherChartsProps) {
  if (!weatherData) {
    return null;
  }

  const precipData = weatherData.daily.time.map((time, index) => ({
    x: time.split('-').slice(1).join('/'), // Format: MM/DD
    y: weatherData.daily.precipitation_sum[index],
  }));

  const series: BarChartProps<string>['series'] = [
    {
      title: 'Precipitation',
      type: 'bar',
      data: precipData,
      valueFormatter: (value) => `${value.toFixed(1)} mm`,
    },
  ];

  return (
    <Container header={<Header variant="h2">7-Day Precipitation Forecast</Header>}>
      <BarChart
        {...commonChartProps}
        series={series}
        xScaleType="categorical"
        xTitle="Date"
        yTitle="Precipitation (mm)"
        ariaLabel="7-day precipitation forecast chart"
        loading={loading}
        i18nStrings={{
          filterLabel: 'Filter precipitation data',
          filterPlaceholder: 'Filter',
          filterSelectedAriaLabel: 'selected',
          legendAriaLabel: 'Legend',
          chartAriaRoleDescription: 'Weekly precipitation forecast bar chart',
        }}
      />
    </Container>
  );
}

interface WeatherChartsGridProps {
  weatherData: WeatherData | null;
  loading: boolean;
  temperatureUnit: TemperatureUnit;
}

export default function WeatherChartsGrid({ weatherData, loading, temperatureUnit }: WeatherChartsGridProps) {
  return (
    <Grid
      gridDefinition={[
        { colspan: { default: 12, s: 6 } },
        { colspan: { default: 12, s: 6 } },
        { colspan: { default: 12, s: 6 } },
        { colspan: { default: 12, s: 6 } },
      ]}
    >
      <TemperatureChart weatherData={weatherData} loading={loading} temperatureUnit={temperatureUnit} />
      <WeatherMetricsChart weatherData={weatherData} loading={loading} temperatureUnit={temperatureUnit} />
      <WeeklyForecastChart weatherData={weatherData} loading={loading} temperatureUnit={temperatureUnit} />
      <PrecipitationChart weatherData={weatherData} loading={loading} temperatureUnit={temperatureUnit} />
    </Grid>
  );
}
