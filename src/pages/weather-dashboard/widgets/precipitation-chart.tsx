// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Box from '@cloudscape-design/components/box';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import BarChart from '@cloudscape-design/components/bar-chart';
import Spinner from '@cloudscape-design/components/spinner';

import { WeatherData } from '../services/weather-api';

interface PrecipitationChartProps {
  weatherData: WeatherData | null;
  loading: boolean;
}

export function PrecipitationChart({ weatherData, loading }: PrecipitationChartProps) {
  if (loading) {
    return (
      <Container>
        <Header variant="h3">Precipitation Forecast</Header>
        <Box textAlign="center" padding={{ vertical: 'l' }}>
          <Spinner />
        </Box>
      </Container>
    );
  }

  if (!weatherData?.hourly) {
    return (
      <Container>
        <Header variant="h3">Precipitation Forecast</Header>
        <Box textAlign="center" padding={{ vertical: 'l' }}>
          No precipitation data available
        </Box>
      </Container>
    );
  }

  const { hourly } = weatherData;
  
  // Take every 3 hours for the next 24 hours to reduce clutter
  const precipitationData = hourly.time
    .slice(0, 24)
    .filter((_, index) => index % 3 === 0)
    .map((time, index) => ({
      x: new Date(time).toLocaleTimeString(undefined, { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      y: hourly.precipitation[index * 3] || 0
    }));

  const series = [
    {
      title: 'Precipitation',
      type: 'bar' as const,
      data: precipitationData,
      color: '#0084c7'
    }
  ];

  return (
    <Container>
      <Header variant="h3" description="24-hour precipitation forecast">
        Precipitation Forecast
      </Header>
      <BarChart
        series={series}
        yTitle="Precipitation (mm)"
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
          yTickFormatter: (value) => `${value} mm`,
        }}
        ariaLabel="Precipitation forecast over 24 hours"
        ariaDescription="Bar chart showing expected precipitation amounts over the next 24 hours"
      />
    </Container>
  );
}
