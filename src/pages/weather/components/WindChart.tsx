// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import LineChart from '@cloudscape-design/components/line-chart';
import Box from '@cloudscape-design/components/box';
import { HourlyWeatherData } from '../types';
import { formatTime } from '../utils';

interface WindChartProps {
  hourlyData: HourlyWeatherData;
}

export default function WindChart({ hourlyData }: WindChartProps) {
  // Get next 24 hours of data
  const next24Hours = hourlyData.time.slice(0, 24);
  const windSpeeds = hourlyData.windspeed_10m.slice(0, 24);

  const series = [
    {
      title: 'Wind Speed',
      type: 'line' as const,
      data: next24Hours.map((time, index) => ({
        x: new Date(time).getTime(),
        y: windSpeeds[index],
      })),
    },
  ];

  return (
    <LineChart
      series={series}
      xDomain={[new Date(next24Hours[0]).getTime(), new Date(next24Hours[next24Hours.length - 1]).getTime()]}
      yDomain={[0, Math.max(...windSpeeds) + 5]}
      i18nStrings={{
        xTickFormatter: (value) => formatTime(new Date(value as number).toISOString()),
        yTickFormatter: (value) => `${Math.round(value as number)} km/h`,
      }}
      ariaLabel="24-hour wind speed forecast"
      height={300}
      hideFilter
      hideLegend
      xScaleType="time"
      yTitle="Wind Speed (km/h)"
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
