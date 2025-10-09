// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Header from '@cloudscape-design/components/header';
import BarChart from '@cloudscape-design/components/bar-chart';
import { WidgetConfig } from '../interfaces';

function PrecipitationChartHeader() {
  return <Header variant="h2">Precipitation Forecast</Header>;
}

function PrecipitationChartWidget() {
  const data = [
    { x: 'Mon', y: 0 },
    { x: 'Tue', y: 0.1 },
    { x: 'Wed', y: 0.8 },
    { x: 'Thu', y: 0.3 },
    { x: 'Fri', y: 0 },
  ];

  return (
    <BarChart
      series={[
        {
          title: 'Precipitation',
          type: 'bar',
          data,
        },
      ]}
      xDomain={data.map(d => d.x)}
      yDomain={[0, 1]}
      i18nStrings={{
        xTickFormatter: (value: string) => value,
        yTickFormatter: (value: number) => `${value}"`,
      }}
      ariaLabel="Precipitation forecast chart"
      height={180}
      hideFilter
      hideLegend
      xScaleType="categorical"
      yTitle="Precipitation (inches)"
    />
  );
}

export const precipitationChart: WidgetConfig = {
  header: PrecipitationChartHeader,
  content: PrecipitationChartWidget,
};
