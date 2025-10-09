// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Box from '@cloudscape-design/components/box';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import KeyValuePairs from '@cloudscape-design/components/key-value-pairs';

interface LocationSummaryProps {
  locations: Array<{
    name: string;
    latitude: number;
    longitude: number;
    timezone: string;
  }>;
}

export function LocationSummary({ locations }: LocationSummaryProps) {
  return (
    <Container header={<Header variant="h2">Monitored Locations</Header>}>
      <KeyValuePairs
        columns={2}
        items={[
          {
            label: 'Total locations',
            value: <Box variant="awsui-value-large">{locations.length}</Box>,
          },
          {
            label: 'Primary location',
            value: <Box variant="awsui-value-large">{locations[0]?.name || 'N/A'}</Box>,
          },
          {
            label: 'Data source',
            value: <Box variant="awsui-value-large">Open-Meteo API</Box>,
          },
          {
            label: 'Update frequency',
            value: <Box variant="awsui-value-large">Hourly</Box>,
          },
        ]}
      />
    </Container>
  );
}
