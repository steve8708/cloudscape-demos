// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import AreaChart from '@cloudscape-design/components/area-chart';
import { AreaChartProps } from '@cloudscape-design/components/area-chart';

import { WeatherData } from '../types';

interface WindChartProps {
  hourly: WeatherData['hourly'];
  timezone: string;
}

export function WindChart({ hourly, timezone }: WindChartProps) {
  // Get next 48 hours of data
  const dataPoints = hourly.time.slice(0, 48).map((time, index) => ({
    x: new Date(time),
    y: hourly.windspeed_10m[index],
  }));

  const series: AreaChartProps<Date>['series'] = [
    {
      title: 'Wind Speed',
      type: 'area',
      data: dataPoints,
      valueFormatter: value => `${Math.round(value as number)} km/h`,
    },
  ];

  return (
    <Container
      header={
        <Header variant="h2" description="Next 48 hours">
          Wind Speed
        </Header>
      }
    >
      <AreaChart
        series={series}
        xScaleType="time"
        yTitle="Wind Speed (km/h)"
        xTitle="Time"
        height={300}
        hideFilter
        hideLegend
        statusType="finished"
        i18nStrings={{
          filterLabel: 'Filter displayed data',
          filterPlaceholder: 'Filter data',
          filterSelectedAriaLabel: 'selected',
          detailPopoverDismissAriaLabel: 'Dismiss',
          legendAriaLabel: 'Legend',
          chartAriaRoleDescription: 'area chart',
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
          yTickFormatter: value => `${Math.round(value as number)} km/h`,
        }}
        ariaLabel="Wind speed chart"
        ariaDescription="Area chart showing wind speed forecast for the next 48 hours"
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
