// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Box from '@cloudscape-design/components/box';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import ProgressBar from '@cloudscape-design/components/progress-bar';
import StatusIndicator from '@cloudscape-design/components/status-indicator';

export function UVIndex() {
  return (
    <Container
      header={
        <Header variant="h2" info={<StatusIndicator type="warning">Moderate</StatusIndicator>}>
          UV Index
        </Header>
      }
    >
      <div>
        <ProgressBar value={60} additionalInfo="6 out of 11" label="UV Index" resultText="Moderate exposure" />
        <Box variant="p" color="text-body-secondary" padding={{ top: 's' }}>
          Wear sunscreen if you'll be outside for extended periods
        </Box>
      </div>
    </Container>
  );
}
