// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import BarChart from '@cloudscape-design/components/bar-chart';
import Box from '@cloudscape-design/components/box';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';

const temperatureData = [
  { time: '12 AM', temp: 58 },
  { time: '3 AM', temp: 56 },
  { time: '6 AM', temp: 55 },
  { time: '9 AM', temp: 62 },
  { time: '12 PM', temp: 68 },
  { time: '3 PM', temp: 72 },
  { time: '6 PM', temp: 70 },
  { time: '9 PM', temp: 64 },
];

export function TemperatureChart() {
  return (
    <Container
      header={
        <Header variant="h2" description="Temperature trends for today">
          Temperature Over Time
        </Header>
      }
    >
      <BarChart
        series={[
          {
            title: 'Temperature (°F)',
            type: 'bar',
            data: temperatureData.map(d => ({ x: d.time, y: d.temp })),
          },
        ]}
        xDomain={temperatureData.map(d => d.time)}
        yDomain={[50, 80]}
        i18nStrings={{
          filterLabel: 'Filter displayed data',
          filterPlaceholder: 'Filter data',
          filterSelectedAriaLabel: 'selected',
          legendAriaLabel: 'Legend',
          chartAriaRoleDescription: 'bar chart',
          xTickFormatter: e => e.toString(),
          yTickFormatter: e => `${e}°F`,
        }}
        ariaLabel="Temperature chart"
        height={200}
        hideFilter
        hideLegend
      />
    </Container>
  );
}
