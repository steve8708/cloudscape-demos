// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import Container from '@cloudscape-design/components/container';
import Box from '@cloudscape-design/components/box';
import Spinner from '@cloudscape-design/components/spinner';

export default function WeatherLoadingState() {
  return (
    <Container>
      <Box textAlign="center" padding="xl">
        <Spinner size="large" />
        <Box variant="p" padding={{ top: 's' }}>
          Loading weather data...
        </Box>
      </Box>
    </Container>
  );
}
