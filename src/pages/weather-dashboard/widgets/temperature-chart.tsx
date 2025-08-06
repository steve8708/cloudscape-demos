// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Box from '@cloudscape-design/components/box';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import LineChart from '@cloudscape-design/components/line-chart';
import Spinner from '@cloudscape-design/components/spinner';

import { WeatherData } from '../services/weather-api';

interface TemperatureChartProps {
  weatherData: WeatherData | null;
  loading: boolean;
}

export function TemperatureChart({ weatherData, loading }: TemperatureChartProps) {
  if (loading) {
    return (
      <Container>
        <Header variant="h3">Temperature Trend</Header>
        <Box textAlign="center" padding={{ vertical: 'l' }}>
          <Spinner />
        </Box>
      </Container>
    );
  }

  if (!weatherData?.hourly) {
    return (
      <Container>
        <Header variant="h3">Temperature Trend</Header>
        <Box textAlign="center" padding={{ vertical: 'l' }}>
          No temperature data available
        </Box>
      </Container>
    );
  }

  const { hourly } = weatherData;
  
  // Take first 24 hours for better visualization
  const temperatureData = hourly.time.slice(0, 24).map((time, index) => ({
    x: new Date(time),
    y: hourly.temperature_2m[index]
  }));

  const series = [
    {
      title: 'Temperature',
      type: 'line' as const,
      data: temperatureData,
      color: '#0073bb'
    }
  ];

  return (
    <Container>
      <Header variant="h3" description="24-hour temperature forecast">
        Temperature Trend
      </Header>
      <LineChart
        series={series}
        xDomain={[temperatureData[0]?.x, temperatureData[temperatureData.length - 1]?.x]}
        yTitle="Temperature (°C)"
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
          chartAriaRoleDescription: 'line chart',
          xTickFormatter: (value) => {
            const date = new Date(value);
            return date.toLocaleDateString(undefined, { 
              hour: '2-digit', 
              minute: '2-digit' 
            });
          },
          yTickFormatter: (value) => `${Math.round(value)}°C`,
        }}
        ariaLabel="Temperature trend over 24 hours"
        ariaDescription="Line chart showing temperature changes over the next 24 hours"
      />
    </Container>
  );
}
