// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Header from '@cloudscape-design/components/header';
import LineChart from '@cloudscape-design/components/line-chart';
import { LineChartProps } from '@cloudscape-design/components/line-chart';

interface TemperatureChartProps {
  data: Array<{ x: Date; y: number }>;
  title?: string;
  height?: number;
}

const commonChartProps: Partial<LineChartProps<Date>> = {
  hideLegend: false,
  hideFilter: true,
  fitHeight: true,
  i18nStrings: {
    filterLabel: 'Filter displayed data',
    filterPlaceholder: 'Filter data',
    legendAriaLabel: 'Legend',
    chartAriaRoleDescription: 'line chart',
    xTickFormatter: (value: Date) =>
      value.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
    yTickFormatter: (value: number) => `${value.toFixed(1)}°C`,
  },
};

export function TemperatureChart({ data, title = 'Temperature Trend', height = 300 }: TemperatureChartProps) {
  const series: LineChartProps<Date>['series'] = [
    {
      title: 'Temperature',
      type: 'line',
      data: data,
      color: '#ff6b6b',
    },
  ];

  const xDomain = data.length > 0 ? [data[0].x, data[data.length - 1].x] : undefined;
  const yValues = data.map(point => point.y);
  const yMin = Math.min(...yValues) - 2;
  const yMax = Math.max(...yValues) + 2;

  return (
    <div>
      <Header variant="h3" description="24-hour temperature forecast">
        {title}
      </Header>
      <LineChart
        {...commonChartProps}
        height={height}
        series={series}
        xDomain={xDomain}
        yDomain={[yMin, yMax]}
        xScaleType="time"
        xTitle="Time"
        yTitle="Temperature (°C)"
        ariaLabel="Temperature trend chart"
        ariaDescription="Line chart showing temperature changes over the next 24 hours"
      />
    </div>
  );
}
