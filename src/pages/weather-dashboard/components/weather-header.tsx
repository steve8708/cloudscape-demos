// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Box from '@cloudscape-design/components/box';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';

export function WeatherHeader({ actions }: { actions?: React.ReactNode }) {
  return (
    <Header variant="h1" actions={actions}>
      Weather Dashboard
    </Header>
  );
}

export function WeatherMainInfo() {
  return (
    <SpaceBetween size="l">
      <div>
        <Box variant="h2">Weather Dashboard</Box>
        <Box variant="p">Real-time weather data powered by Open Meteo API</Box>
      </div>
      <div>
        <Box variant="h3">Features</Box>
        <SpaceBetween size="s">
          <Box variant="p">• Current weather conditions</Box>
          <Box variant="p">• 7-day weather forecast</Box>
          <Box variant="p">• Multiple location support</Box>
          <Box variant="p">• Interactive weather charts</Box>
        </SpaceBetween>
      </div>
    </SpaceBetween>
  );
}
