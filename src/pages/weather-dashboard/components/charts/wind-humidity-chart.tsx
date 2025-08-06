// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Header from '@cloudscape-design/components/header';
import LineChart from '@cloudscape-design/components/line-chart';
import { LineChartProps } from '@cloudscape-design/components/line-chart';

interface WindHumidityChartProps {
  windData: Array<{ x: Date; y: number }>;
  humidityData: Array<{ x: Date; y: number }>;
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
        minute: '2-digit',
      }),
    yTickFormatter: (value: number, series) => {
      if (series?.title === 'Wind Speed') {
        return `${value.toFixed(1)} km/h`;
      }
      return `${value.toFixed(0)}%`;
    },
  },
};

export function WindHumidityChart({
  windData,
  humidityData,
  title = 'Wind Speed & Humidity',
  height = 300,
}: WindHumidityChartProps) {
  const series: LineChartProps<Date>['series'] = [
    {
      title: 'Wind Speed',
      type: 'line',
      data: windData,
      color: '#4dabf7',
      yAxis: 'left',
    },
    {
      title: 'Humidity',
      type: 'line',
      data: humidityData,
      color: '#51cf66',
      yAxis: 'right',
    },
  ];

  const xDomain = windData.length > 0 ? [windData[0].x, windData[windData.length - 1].x] : undefined;

  const windValues = windData.map(point => point.y);
  const windMin = Math.min(...windValues);
  const windMax = Math.max(...windValues);

  const humidityValues = humidityData.map(point => point.y);
  const humidityMin = Math.min(...humidityValues);
  const humidityMax = Math.max(...humidityValues);

  return (
    <div>
      <Header variant="h3" description="24-hour wind speed and humidity forecast">
        {title}
      </Header>
      <LineChart
        {...commonChartProps}
        height={height}
        series={series}
        xDomain={xDomain}
        yDomain={[Math.max(0, windMin - 2), windMax + 2]}
        secondaryYDomain={[Math.max(0, humidityMin - 5), Math.min(100, humidityMax + 5)]}
        xScaleType="time"
        xTitle="Time"
        yTitle="Wind Speed (km/h)"
        secondaryYTitle="Humidity (%)"
        ariaLabel="Wind speed and humidity chart"
        ariaDescription="Line chart showing wind speed and humidity changes over the next 24 hours"
      />
    </div>
  );
}
