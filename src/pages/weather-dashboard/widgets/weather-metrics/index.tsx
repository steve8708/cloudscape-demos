// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Header from '@cloudscape-design/components/header';
import KeyValuePairs from '@cloudscape-design/components/key-value-pairs';
import { WidgetConfig } from '../interfaces';

function WeatherMetricsHeader() {
  return <Header variant="h2">Weather Metrics</Header>;
}

function WeatherMetricsWidget() {
  return (
    <KeyValuePairs
      columns={2}
      items={[
        {
          label: 'Humidity',
          value: '65%',
        },
        {
          label: 'Dew Point',
          value: '58°F',
        },
        {
          label: 'Visibility',
          value: '10 mi',
        },
        {
          label: 'Pressure',
          value: '30.12 in',
        },
        {
          label: 'Cloud Cover',
          value: '45%',
        },
        {
          label: 'Sunrise',
          value: '6:42 AM',
        },
        {
          label: 'Sunset',
          value: '5:18 PM',
        },
        {
          label: 'Moon Phase',
          value: '🌓 First Quarter',
        },
      ]}
    />
  );
}

export const weatherMetrics: WidgetConfig = {
  header: WeatherMetricsHeader,
  content: WeatherMetricsWidget,
};
