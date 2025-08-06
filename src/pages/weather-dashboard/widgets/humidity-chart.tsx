// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Box from '@cloudscape-design/components/box';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import AreaChart from '@cloudscape-design/components/area-chart';
import Spinner from '@cloudscape-design/components/spinner';

import { WeatherData } from '../services/weather-api';

interface HumidityChartProps {
  weatherData: WeatherData | null;
  loading: boolean;
}

export function HumidityChart({ weatherData, loading }: HumidityChartProps) {
  if (loading) {
    return (
      <Container>
        <Header variant="h3">Humidity Levels</Header>
        <Box textAlign="center" padding={{ vertical: 'l' }}>
          <Spinner />
        </Box>
      </Container>
    );
  }

  if (!weatherData?.hourly) {
    return (
      <Container>
        <Header variant="h3">Humidity Levels</Header>
        <Box textAlign="center" padding={{ vertical: 'l' }}>
          No humidity data available
        </Box>
      </Container>
    );
  }

  const { hourly } = weatherData;

  // Take first 24 hours for better visualization
  const humidityData = hourly.time.slice(0, 24).map((time, index) => ({
    x: new Date(time),
    y: hourly.relative_humidity_2m[index],
  }));

  const series = [
    {
      title: 'Relative Humidity',
      type: 'area' as const,
      data: humidityData,
      color: '#037f0c',
    },
  ];

  return (
    <Container>
      <Header variant="h3" description="24-hour humidity forecast">
        Humidity Levels
      </Header>
      <AreaChart
        series={series}
        xDomain={[humidityData[0]?.x, humidityData[humidityData.length - 1]?.x]}
        yDomain={[0, 100]}
        yTitle="Humidity (%)"
        xTitle="Time"
        height={300}
        hideFilter
        hideLegend
        xScaleType="time"
        i18nStrings={{
          filterLabel: 'Filter displayed data',
          filterPlaceholder: 'Filter data',
          filterSelectedAriaLabel: 'selected',
          detailPopoverDismissAriaLabel: 'Dismiss',
          legendAriaLabel: 'Legend',
          chartAriaRoleDescription: 'area chart',
          xTickFormatter: value => {
            const date = new Date(value);
            return date.toLocaleDateString(undefined, {
              hour: '2-digit',
              minute: '2-digit',
            });
          },
          yTickFormatter: value => `${Math.round(value)}%`,
        }}
        ariaLabel="Humidity levels over 24 hours"
        ariaDescription="Area chart showing relative humidity changes over the next 24 hours"
      />
    </Container>
  );
}
