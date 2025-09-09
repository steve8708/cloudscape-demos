// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import BarChart from '@cloudscape-design/components/bar-chart';

import { HourlyWeather } from '../services/weather-api';

interface PrecipitationWidgetProps {
  data: HourlyWeather;
}

export function PrecipitationWidget({ data }: PrecipitationWidgetProps) {
  const chartData = data.time.slice(0, 12).map((time, index) => ({
    x: new Date(time).toLocaleTimeString([], { hour: '2-digit' }),
    y: data.precipitation[index],
  }));

  const maxPrecipitation = Math.max(...data.precipitation.slice(0, 12));

  return (
    <Container header={<Header description="Next 12 hours precipitation forecast">Precipitation</Header>}>
      <BarChart
        series={[
          {
            title: 'Precipitation',
            type: 'bar',
            data: chartData,
            valueFormatter: value => `${value}mm`,
          },
        ]}
        xTitle="Time"
        yTitle="Precipitation (mm)"
        height={250}
        hideFilter
        hideLegend
        yDomain={[0, Math.max(maxPrecipitation * 1.1, 1)]}
        emphasizeBaselineAxis={false}
      />
    </Container>
  );
}
