// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Header from '@cloudscape-design/components/header';
import LineChart from '@cloudscape-design/components/line-chart';
import { WidgetConfig } from '../interfaces';

function TemperatureChartHeader() {
  return <Header variant="h2">Temperature Trend (24h)</Header>;
}

function TemperatureChartWidget() {
  const series = [
    {
      title: 'Temperature',
      type: 'line' as const,
      data: [
        { x: new Date(2024, 0, 1, 0), y: 58 },
        { x: new Date(2024, 0, 1, 3), y: 55 },
        { x: new Date(2024, 0, 1, 6), y: 54 },
        { x: new Date(2024, 0, 1, 9), y: 62 },
        { x: new Date(2024, 0, 1, 12), y: 68 },
        { x: new Date(2024, 0, 1, 15), y: 72 },
        { x: new Date(2024, 0, 1, 18), y: 69 },
        { x: new Date(2024, 0, 1, 21), y: 64 },
        { x: new Date(2024, 0, 2, 0), y: 60 },
      ],
      valueFormatter: (value: number) => `${value}°F`,
    },
  ];

  return (
    <LineChart
      series={series}
      xDomain={[new Date(2024, 0, 1, 0), new Date(2024, 0, 2, 0)]}
      yDomain={[50, 80]}
      i18nStrings={{
        xTickFormatter: (date: Date) =>
          date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            hour12: true,
          }),
        yTickFormatter: (value: number) => `${value}°F`,
      }}
      ariaLabel="Temperature trend chart"
      height={200}
      hideFilter
      hideLegend
      xScaleType="time"
      yTitle="Temperature (°F)"
    />
  );
}

export const temperatureChart: WidgetConfig = {
  header: TemperatureChartHeader,
  content: TemperatureChartWidget,
};
