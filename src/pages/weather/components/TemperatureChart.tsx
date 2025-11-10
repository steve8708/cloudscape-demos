// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import LineChart from '@cloudscape-design/components/line-chart';
import Box from '@cloudscape-design/components/box';
import { HourlyWeatherData } from '../types';
import { formatTime } from '../utils';

interface TemperatureChartProps {
  hourlyData: HourlyWeatherData;
}

export default function TemperatureChart({ hourlyData }: TemperatureChartProps) {
  // Get next 24 hours of data
  const next24Hours = hourlyData.time.slice(0, 24);
  const temperatures = hourlyData.temperature_2m.slice(0, 24);

  const series = [
    {
      title: 'Temperature',
      type: 'line' as const,
      data: next24Hours.map((time, index) => ({
        x: new Date(time).getTime(),
        y: temperatures[index],
      })),
    },
  ];

  return (
    <LineChart
      series={series}
      xDomain={[new Date(next24Hours[0]).getTime(), new Date(next24Hours[next24Hours.length - 1]).getTime()]}
      yDomain={[Math.min(...temperatures) - 2, Math.max(...temperatures) + 2]}
      i18nStrings={{
        xTickFormatter: value => formatTime(new Date(value as number).toISOString()),
        yTickFormatter: value => `${Math.round(value as number)}°C`,
      }}
      ariaLabel="24-hour temperature forecast"
      height={300}
      hideFilter
      hideLegend
      xScaleType="time"
      yTitle="Temperature (°C)"
      empty={
        <Box textAlign="center" color="inherit">
          <b>No data available</b>
          <Box variant="p" color="inherit">
            There is no data available
          </Box>
        </Box>
      }
      noMatch={
        <Box textAlign="center" color="inherit">
          <b>No matching data</b>
          <Box variant="p" color="inherit">
            There is no matching data to display
          </Box>
        </Box>
      }
    />
  );
}
