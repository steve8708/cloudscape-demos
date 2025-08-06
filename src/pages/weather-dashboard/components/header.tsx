// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Header from '@cloudscape-design/components/header';
import { InfoLink } from '../../commons';

interface WeatherHeaderProps {
  actions: React.ReactNode;
}

export function WeatherHeader({ actions }: WeatherHeaderProps) {
  return (
    <Header
      variant="h1"
      info={<InfoLink onFollow={() => {}} />}
      description="Real-time weather monitoring dashboard powered by Open Meteo API"
      actions={actions}
    >
      Weather Dashboard
    </Header>
  );
}

export function WeatherMainInfo() {
  return (
    <Box variant="h2" padding={{ bottom: 's' }}>
      About Weather Dashboard
      <Box variant="p" padding={{ top: 's' }}>
        This dashboard provides real-time weather information and forecasts using the Open Meteo API. Monitor current
        conditions, hourly forecasts, and weather trends with interactive charts and visualizations.
      </Box>
      <ColumnLayout columns={1} variant="text-grid">
        <div>
          <Box variant="h3">Features</Box>
          <Box variant="p">
            • Current weather conditions
            <br />
            • 7-day hourly forecasts
            <br />
            • Temperature trends
            <br />
            • Wind speed and direction
            <br />
            • Humidity monitoring
            <br />• Interactive charts and graphs
          </Box>
        </div>
      </ColumnLayout>
    </Box>
  );
}
