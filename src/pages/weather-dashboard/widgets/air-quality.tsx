// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import ProgressBar from '@cloudscape-design/components/progress-bar';
import StatusIndicator from '@cloudscape-design/components/status-indicator';

export function AirQuality() {
  return (
    <Container
      header={
        <Header variant="h2" info={<StatusIndicator type="success">Good</StatusIndicator>}>
          Air Quality Index
        </Header>
      }
    >
      <ColumnLayout columns={1}>
        <div>
          <Box variant="awsui-key-label">AQI Score</Box>
          <ProgressBar value={42} additionalInfo="42 out of 500" label="Air Quality" />
        </div>
        <div>
          <ColumnLayout columns={3} variant="text-grid">
            <div>
              <Box variant="awsui-key-label">PM2.5</Box>
              <Box variant="p">8 µg/m³</Box>
            </div>
            <div>
              <Box variant="awsui-key-label">PM10</Box>
              <Box variant="p">15 µg/m³</Box>
            </div>
            <div>
              <Box variant="awsui-key-label">O₃</Box>
              <Box variant="p">32 ppb</Box>
            </div>
          </ColumnLayout>
        </div>
      </ColumnLayout>
    </Container>
  );
}
