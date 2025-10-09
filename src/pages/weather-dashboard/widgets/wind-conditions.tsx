// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';

export function WindConditions() {
  return (
    <Container header={<Header variant="h2">Wind Conditions</Header>}>
      <ColumnLayout columns={2} variant="text-grid">
        <div>
          <Box variant="awsui-key-label">Wind Speed</Box>
          <Box variant="p" fontSize="heading-xl">
            12 mph
          </Box>
        </div>
        <div>
          <Box variant="awsui-key-label">Wind Direction</Box>
          <Box variant="p" fontSize="heading-xl">
            NW
          </Box>
        </div>
        <div>
          <Box variant="awsui-key-label">Gusts</Box>
          <Box variant="p" fontSize="heading-m">
            18 mph
          </Box>
        </div>
        <div>
          <Box variant="awsui-key-label">Wind Chill</Box>
          <Box variant="p" fontSize="heading-m">
            68°F
          </Box>
        </div>
      </ColumnLayout>
    </Container>
  );
}
