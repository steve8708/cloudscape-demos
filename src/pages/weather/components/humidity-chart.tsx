// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import LineChart from '@cloudscape-design/components/line-chart';
import { LineChartProps } from '@cloudscape-design/components/line-chart';

import { WeatherData } from '../types';

interface HumidityChartProps {
  hourly: WeatherData['hourly'];
  daily: WeatherData['daily'];
  timezone: string;
}

export function HumidityChart({ hourly, daily, timezone }: HumidityChartProps) {
  // Get next 48 hours of data
  const humidityData = hourly.time.slice(0, 48).map((time, index) => ({
    x: new Date(time),
    y: hourly.humidity_2m[index],
  }));

  const uvData = hourly.time.slice(0, 48).map((time, index) => ({
    x: new Date(time),
    y: hourly.uv_index[index],
  }));

  const series: LineChartProps<Date>['series'] = [
    {
      title: 'Humidity',
      type: 'line',
      data: humidityData,
      valueFormatter: value => `${Math.round(value as number)}%`,
    },
    {
      title: 'UV Index',
      type: 'line',
      data: uvData,
      valueFormatter: value => (value as number).toFixed(1),
    },
  ];

  return (
    <Container
      header={
        <Header variant="h2" description="Next 48 hours">
          Humidity & UV Index
        </Header>
      }
    >
      <LineChart
        series={series}
        xScaleType="time"
        yTitle="Humidity (%) / UV Index"
        xTitle="Time"
        height={300}
        hideFilter
        i18nStrings={{
          filterLabel: 'Filter displayed data',
          filterPlaceholder: 'Filter data',
          filterSelectedAriaLabel: 'selected',
          detailPopoverDismissAriaLabel: 'Dismiss',
          legendAriaLabel: 'Legend',
          chartAriaRoleDescription: 'line chart',
          xTickFormatter: date =>
            date
              .toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                hour12: true,
                timeZone: timezone,
              })
              .replace(',', ''),
          yTickFormatter: value => `${Math.round(value as number)}`,
        }}
        ariaLabel="Humidity and UV index chart"
        ariaDescription="Line chart showing humidity and UV index forecast for the next 48 hours"
        empty={
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <p>No data available</p>
          </div>
        }
        noMatch={
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <p>No matching data</p>
          </div>
        }
      />
    </Container>
  );
}
