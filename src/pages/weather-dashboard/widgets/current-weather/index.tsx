// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Header from '@cloudscape-design/components/header';
import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import { WidgetConfig } from '../interfaces';

function CurrentWeatherHeader() {
  return (
    <Header variant="h2" description="San Francisco, CA">
      Current Weather
    </Header>
  );
}

function CurrentWeatherWidget() {
  return (
    <SpaceBetween size="l">
      <Box textAlign="center">
        <Box fontSize="display-l" fontWeight="bold" color="text-status-info">
          72°F
        </Box>
        <Box fontSize="heading-m" color="text-status-inactive">
          ☁️ Partly Cloudy
        </Box>
      </Box>

      <ColumnLayout columns={2} variant="text-grid">
        <div>
          <Box variant="awsui-key-label">Feels like</Box>
          <div>70°F</div>
        </div>
        <div>
          <Box variant="awsui-key-label">Wind</Box>
          <div>8 mph NW</div>
        </div>
        <div>
          <Box variant="awsui-key-label">Humidity</Box>
          <div>65%</div>
        </div>
        <div>
          <Box variant="awsui-key-label">Pressure</Box>
          <div>30.12 in</div>
        </div>
      </ColumnLayout>
    </SpaceBetween>
  );
}

export const currentWeather: WidgetConfig = {
  header: CurrentWeatherHeader,
  content: CurrentWeatherWidget,
};
