// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import BarChart from '@cloudscape-design/components/bar-chart';
import Box from '@cloudscape-design/components/box';
import { DailyWeatherData } from '../types';
import { formatDate } from '../utils';

interface PrecipitationChartProps {
  dailyData: DailyWeatherData;
}

export default function PrecipitationChart({ dailyData }: PrecipitationChartProps) {
  const series = [
    {
      title: 'Precipitation',
      type: 'bar' as const,
      data: dailyData.time.map((time, index) => ({
        x: formatDate(time),
        y: dailyData.precipitation_sum[index],
      })),
    },
  ];

  return (
    <BarChart
      series={series}
      i18nStrings={{
        yTickFormatter: (value) => `${value} mm`,
      }}
      ariaLabel="7-day precipitation forecast"
      height={300}
      hideFilter
      hideLegend
      yTitle="Precipitation (mm)"
      xTitle="Date"
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
