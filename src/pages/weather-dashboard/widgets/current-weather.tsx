// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Icon from '@cloudscape-design/components/icon';

export function CurrentWeather() {
  return (
    <Container
      header={
        <Header variant="h2" description="San Francisco, CA">
          Current Weather
        </Header>
      }
    >
      <ColumnLayout columns={2} variant="text-grid">
        <div>
          <Box variant="awsui-key-label">Temperature</Box>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '48px', fontWeight: 'bold' }}>72°F</span>
            <Icon name="status-positive" variant="success" />
          </div>
          <Box variant="p" color="text-body-secondary">
            Feels like 70°F
          </Box>
        </div>
        <div>
          <Box variant="awsui-key-label">Conditions</Box>
          <Box variant="p" fontSize="heading-xl">
            Partly Cloudy
          </Box>
          <Box variant="p" color="text-body-secondary">
            Humidity: 65%
          </Box>
        </div>
        <div>
          <Box variant="awsui-key-label">Wind</Box>
          <Box variant="p" fontSize="heading-m">
            12 mph NW
          </Box>
        </div>
        <div>
          <Box variant="awsui-key-label">Pressure</Box>
          <Box variant="p" fontSize="heading-m">
            30.12 in
          </Box>
        </div>
      </ColumnLayout>
    </Container>
  );
}
