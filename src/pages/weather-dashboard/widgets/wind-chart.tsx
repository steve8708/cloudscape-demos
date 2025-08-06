// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Box from '@cloudscape-design/components/box';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import MixedLineBarChart from '@cloudscape-design/components/mixed-line-bar-chart';
import Spinner from '@cloudscape-design/components/spinner';

import { WeatherData, weatherApi } from '../services/weather-api';

interface WindChartProps {
  weatherData: WeatherData | null;
  loading: boolean;
}

export function WindChart({ weatherData, loading }: WindChartProps) {
  if (loading) {
    return (
      <Container>
        <Header variant="h3">Wind Conditions</Header>
        <Box textAlign="center" padding={{ vertical: 'l' }}>
          <Spinner />
        </Box>
      </Container>
    );
  }

  if (!weatherData?.hourly) {
    return (
      <Container>
        <Header variant="h3">Wind Conditions</Header>
        <Box textAlign="center" padding={{ vertical: 'l' }}>
          No wind data available
        </Box>
      </Container>
    );
  }

  const { hourly } = weatherData;

  // Take every 2 hours for the next 24 hours
  const windData = hourly.time
    .slice(0, 24)
    .filter((_, index) => index % 2 === 0)
    .map((time, index) => {
      const dataIndex = index * 2;
      return {
        x: new Date(time).toLocaleTimeString(undefined, {
          hour: '2-digit',
          minute: '2-digit',
        }),
        y: hourly.wind_speed_10m[dataIndex] || 0,
        direction: weatherApi.formatWindDirection(hourly.wind_direction_10m[dataIndex] || 0),
      };
    });

  const series = [
    {
      title: 'Wind Speed',
      type: 'bar' as const,
      data: windData.map(d => ({ x: d.x, y: d.y })),
      color: '#d13212',
    },
  ];

  return (
    <Container>
      <Header variant="h3" description="24-hour wind speed and direction forecast">
        Wind Conditions
      </Header>
      <BarChart
        series={series}
        yTitle="Wind Speed (km/h)"
        xTitle="Time"
        height={300}
        hideFilter
        hideLegend
        xScaleType="categorical"
        i18nStrings={{
          filterLabel: 'Filter displayed data',
          filterPlaceholder: 'Filter data',
          filterSelectedAriaLabel: 'selected',
          detailPopoverDismissAriaLabel: 'Dismiss',
          legendAriaLabel: 'Legend',
          chartAriaRoleDescription: 'bar chart',
          yTickFormatter: value => `${Math.round(value)} km/h`,
        }}
        detailPopoverSeriesContent={({ series, x, y }) => {
          const dataPoint = windData.find(d => d.x === x);
          return {
            key: 'Wind Details',
            value: `${Math.round(y)} km/h ${dataPoint?.direction || ''}`,
          };
        }}
        ariaLabel="Wind conditions over 24 hours"
        ariaDescription="Bar chart showing wind speed and direction over the next 24 hours"
      />
    </Container>
  );
}

// Import BarChart instead of MixedLineBarChart for simplicity
import BarChart from '@cloudscape-design/components/bar-chart';
