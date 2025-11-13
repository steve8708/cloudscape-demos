// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import BarChart from '@cloudscape-design/components/bar-chart';
import { BarChartProps } from '@cloudscape-design/components/bar-chart';
import MixedLineBarChart from '@cloudscape-design/components/mixed-line-bar-chart';
import { MixedLineBarChartProps } from '@cloudscape-design/components/mixed-line-bar-chart';

import { WeatherData } from '../types';

interface PrecipitationChartProps {
  hourly: WeatherData['hourly'];
  timezone: string;
}

export function PrecipitationChart({ hourly, timezone }: PrecipitationChartProps) {
  // Get next 48 hours of data
  const dataPoints = hourly.time.slice(0, 48).map((time, index) => ({
    x: new Date(time),
    precipitation: hourly.precipitation[index],
    probability: hourly.precipitation_probability[index],
  }));

  const series: MixedLineBarChartProps<Date>['series'] = [
    {
      title: 'Precipitation',
      type: 'bar',
      data: dataPoints.map(d => ({ x: d.x, y: d.precipitation })),
      valueFormatter: value => `${(value as number).toFixed(1)} mm`,
    },
    {
      title: 'Probability',
      type: 'line',
      data: dataPoints.map(d => ({ x: d.x, y: d.probability })),
      valueFormatter: value => `${Math.round(value as number)}%`,
    },
  ];

  return (
    <Container
      header={
        <Header variant="h2" description="Next 48 hours">
          Precipitation Forecast
        </Header>
      }
    >
      <MixedLineBarChart
        series={series}
        xScaleType="time"
        yTitle="Precipitation (mm) / Probability (%)"
        xTitle="Time"
        height={300}
        hideFilter
        stackedBars={false}
        i18nStrings={{
          filterLabel: 'Filter displayed data',
          filterPlaceholder: 'Filter data',
          filterSelectedAriaLabel: 'selected',
          detailPopoverDismissAriaLabel: 'Dismiss',
          legendAriaLabel: 'Legend',
          chartAriaRoleDescription: 'mixed chart',
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
          yTickFormatter: value => `${(value as number).toFixed(1)}`,
        }}
        ariaLabel="Precipitation forecast chart"
        ariaDescription="Mixed chart showing precipitation amount and probability for the next 48 hours"
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
