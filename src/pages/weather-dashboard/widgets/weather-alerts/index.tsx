// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Header from '@cloudscape-design/components/header';
import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Alert from '@cloudscape-design/components/alert';
import { WidgetConfig } from '../interfaces';

function WeatherAlertsHeader() {
  return <Header variant="h2">Weather Alerts</Header>;
}

function WeatherAlertsWidget() {
  return (
    <SpaceBetween size="s">
      <Alert type="info" header="Air Quality Advisory">
        Moderate air quality expected today. Sensitive groups should consider limiting outdoor activities.
      </Alert>
      <Box color="text-status-inactive" textAlign="center" padding={{ vertical: 'm' }}>
        No severe weather alerts at this time
      </Box>
    </SpaceBetween>
  );
}

export const weatherAlerts: WidgetConfig = {
  header: WeatherAlertsHeader,
  content: WeatherAlertsWidget,
};
