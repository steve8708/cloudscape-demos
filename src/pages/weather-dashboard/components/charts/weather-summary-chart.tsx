// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import BarChart from '@cloudscape-design/components/bar-chart';
import Header from '@cloudscape-design/components/header';
import { BarChartProps } from '@cloudscape-design/components/bar-chart';

interface WeatherSummaryChartProps {
  temperatureData: Array<{ x: Date; y: number }>;
  title?: string;
  height?: number;
}

export function WeatherSummaryChart({ 
  temperatureData, 
  title = 'Daily Temperature Overview', 
  height = 250 
}: WeatherSummaryChartProps) {
  // Group data by day and calculate daily averages
  const dailyData = temperatureData.reduce((acc, point) => {
    const day = point.x.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
    
    if (!acc[day]) {
      acc[day] = { temps: [], count: 0 };
    }
    
    acc[day].temps.push(point.y);
    acc[day].count++;
    
    return acc;
  }, {} as Record<string, { temps: number[]; count: number }>);

  const barData = Object.entries(dailyData).map(([day, data]) => {
    const avgTemp = data.temps.reduce((sum, temp) => sum + temp, 0) / data.count;
    return { x: day, y: Math.round(avgTemp * 10) / 10 };
  }).slice(0, 7); // Show only next 7 days

  const series: BarChartProps<string>['series'] = [
    {
      title: 'Average Temperature',
      type: 'bar',
      data: barData,
      color: '#ff6b6b',
    },
  ];

  const yValues = barData.map(point => point.y);
  const yMin = Math.min(...yValues) - 2;
  const yMax = Math.max(...yValues) + 2;

  return (
    <div>
      <Header variant="h3" description="7-day average temperature overview">
        {title}
      </Header>
      <BarChart
        hideFilter={true}
        hideLegend={true}
        fitHeight={true}
        height={height}
        series={series}
        yDomain={[yMin, yMax]}
        xScaleType="categorical"
        xTitle="Day"
        yTitle="Temperature (°C)"
        ariaLabel="Weekly temperature overview"
        ariaDescription="Bar chart showing average daily temperatures for the next 7 days"
        i18nStrings={{
          filterLabel: 'Filter displayed data',
          filterPlaceholder: 'Filter data',
          legendAriaLabel: 'Legend',
          chartAriaRoleDescription: 'bar chart',
          yTickFormatter: (value: number) => `${value}°C`,
        }}
      />
    </div>
  );
}
