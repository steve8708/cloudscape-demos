// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Header from '@cloudscape-design/components/header';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import { WidgetConfig } from '../interfaces';

function ForecastHeader() {
  return <Header variant="h2">5-Day Forecast</Header>;
}

function ForecastWidget() {
  const forecast = [
    { day: 'Mon', icon: '☀️', high: 75, low: 58 },
    { day: 'Tue', icon: '⛅', high: 73, low: 60 },
    { day: 'Wed', icon: '🌧️', high: 68, low: 55 },
    { day: 'Thu', icon: '☁️', high: 70, low: 57 },
    { day: 'Fri', icon: '☀️', high: 76, low: 61 },
  ];

  return (
    <ColumnLayout columns={5} variant="text-grid">
      {forecast.map(day => (
        <Box key={day.day} textAlign="center">
          <Box variant="strong">{day.day}</Box>
          <Box fontSize="heading-xl">{day.icon}</Box>
          <Box>
            <Box component="span" fontWeight="bold">
              {day.high}°
            </Box>
            {' / '}
            <Box component="span" color="text-status-inactive">
              {day.low}°
            </Box>
          </Box>
        </Box>
      ))}
    </ColumnLayout>
  );
}

export const forecast: WidgetConfig = {
  header: ForecastHeader,
  content: ForecastWidget,
};
