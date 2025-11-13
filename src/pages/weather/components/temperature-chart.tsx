// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import LineChart from '@cloudscape-design/components/line-chart';
import { LineChartProps } from '@cloudscape-design/components/line-chart';

import { WeatherData } from '../types';

interface TemperatureChartProps {
  hourly: WeatherData['hourly'];
  timezone: string;
}

export function TemperatureChart({ hourly, timezone }: TemperatureChartProps) {
  // Get next 48 hours of data
  const dataPoints = hourly.time.slice(0, 48).map((time, index) => ({
    x: new Date(time),
    y: hourly.temperature_2m[index],
  }));

  const series: LineChartProps<Date>['series'] = [
    {
      title: 'Temperature',
      type: 'line',
      data: dataPoints,
      valueFormatter: value => `${Math.round(value as number)}°C`,
    },
  ];

  return (
    <Container
      header={
        <Header variant="h2" description="Next 48 hours">
          Temperature Trend
        </Header>
      }
    >
      <LineChart
        series={series}
        xScaleType="time"
        yTitle="Temperature (°C)"
        xTitle="Time"
        height={300}
        hideFilter
        hideLegend
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
          yTickFormatter: value => `${Math.round(value as number)}°C`,
        }}
        ariaLabel="Temperature trend chart"
        ariaDescription="Line chart showing temperature forecast for the next 48 hours"
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
