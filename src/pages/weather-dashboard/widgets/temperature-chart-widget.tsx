// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import LineChart from '@cloudscape-design/components/line-chart';

import { HourlyWeather } from '../services/weather-api';

interface TemperatureChartWidgetProps {
  data: HourlyWeather;
}

export function TemperatureChartWidget({ data }: TemperatureChartWidgetProps) {
  const chartData = data.time.slice(0, 12).map((time, index) => ({
    x: new Date(time),
    y: data.temperature[index],
  }));

  return (
    <Container
      header={
        <Header description="Next 12 hours temperature trend">
          Temperature Trend
        </Header>
      }
    >
      <LineChart
        series={[
          {
            title: 'Temperature',
            type: 'line',
            data: chartData,
            valueFormatter: (value) => `${Math.round(value)}°C`,
          },
        ]}
        xDomain={[chartData[0]?.x, chartData[chartData.length - 1]?.x]}
        yDomain={[
          Math.min(...data.temperature.slice(0, 12)) - 2,
          Math.max(...data.temperature.slice(0, 12)) + 2,
        ]}
        xTitle="Time"
        yTitle="Temperature (°C)"
        height={300}
        hideFilter
        hideLegend
        xScaleType="time"
        emphasizeBaselineAxis={false}
      />
    </Container>
  );
}
