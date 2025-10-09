// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Header from '@cloudscape-design/components/header';
import Button from '@cloudscape-design/components/button';
import ButtonDropdown from '@cloudscape-design/components/button-dropdown';
import SpaceBetween from '@cloudscape-design/components/space-between';

export function WeatherDashboardHeader() {
  return (
    <Header
      variant="h1"
      description="Real-time weather monitoring and forecasting"
      actions={
        <SpaceBetween direction="horizontal" size="xs">
          <ButtonDropdown
            items={[
              { id: 'new-york', text: 'New York, NY' },
              { id: 'san-francisco', text: 'San Francisco, CA' },
              { id: 'london', text: 'London, UK' },
              { id: 'tokyo', text: 'Tokyo, Japan' },
              { id: 'sydney', text: 'Sydney, Australia' },
            ]}
          >
            Change Location
          </ButtonDropdown>
          <Button iconName="refresh">Refresh</Button>
          <Button variant="primary" iconName="settings">
            Settings
          </Button>
        </SpaceBetween>
      }
    >
      Weather Dashboard
    </Header>
  );
}
