// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Header from '@cloudscape-design/components/header';
import BarChart from '@cloudscape-design/components/bar-chart';
import { WidgetConfig } from '../interfaces';

function WindChartHeader() {
  return <Header variant="h2">Wind Speed (mph)</Header>;
}

function WindChartWidget() {
  const data = [
    { x: '12 AM', y: 5 },
    { x: '3 AM', y: 4 },
    { x: '6 AM', y: 3 },
    { x: '9 AM', y: 6 },
    { x: '12 PM', y: 8 },
    { x: '3 PM', y: 10 },
    { x: '6 PM', y: 9 },
    { x: '9 PM', y: 7 },
  ];

  return (
    <BarChart
      series={[
        {
          title: 'Wind Speed',
          type: 'bar',
          data,
        },
      ]}
      xDomain={data.map(d => d.x)}
      yDomain={[0, 12]}
      i18nStrings={{
        xTickFormatter: (value: string) => value,
        yTickFormatter: (value: number) => `${value} mph`,
      }}
      ariaLabel="Wind speed chart"
      height={180}
      hideFilter
      hideLegend
      xScaleType="categorical"
      yTitle="Speed (mph)"
    />
  );
}

export const windChart: WidgetConfig = {
  header: WindChartHeader,
  content: WindChartWidget,
};
