// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Box from '@cloudscape-design/components/box';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import LineChart from '@cloudscape-design/components/line-chart';
import Spinner from '@cloudscape-design/components/spinner';

import { useForecastData } from '../../hooks/use-weather-data';

interface ForecastChartProps {
  latitude: number;
  longitude: number;
  locationName: string;
}

export function ForecastChart({ latitude, longitude, locationName }: ForecastChartProps) {
  const { forecastData, loading, error } = useForecastData(latitude, longitude);

  if (loading) {
    return (
      <Container>
        <Box textAlign="center" padding="xxl">
          <Spinner size="large" />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container header={<Header variant="h2">7-Day Temperature Forecast - {locationName}</Header>}>
        <Box color="text-status-error" textAlign="center" padding="m">
          Error loading forecast data: {error}
        </Box>
      </Container>
    );
  }

  if (!forecastData) {
    return null;
  }

  const chartData = forecastData.time.slice(0, 168).map((time, index) => ({
    x: new Date(time),
    y: forecastData.temperature[index],
  }));

  return (
    <Container header={<Header variant="h2">7-Day Temperature Forecast - {locationName}</Header>}>
      <LineChart
        series={[
          {
            title: 'Temperature',
            type: 'line',
            data: chartData,
          },
        ]}
        xDomain={[chartData[0]?.x, chartData[chartData.length - 1]?.x]}
        yDomain={[
          Math.min(...forecastData.temperature.slice(0, 168)) - 5,
          Math.max(...forecastData.temperature.slice(0, 168)) + 5,
        ]}
        i18nStrings={{
          xTickFormatter: date =>
            date
              .toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
              })
              .split(',')
              .join('\n'),
          yTickFormatter: value => `${value}°C`,
        }}
        ariaLabel="Temperature forecast line chart"
        height={300}
        hideFilter
        xScaleType="time"
        yTitle="Temperature (°C)"
      />
    </Container>
  );
}
