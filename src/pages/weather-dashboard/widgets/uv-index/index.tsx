// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Header from '@cloudscape-design/components/header';
import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';
import ProgressBar from '@cloudscape-design/components/progress-bar';
import { WidgetConfig } from '../interfaces';

function UVIndexHeader() {
  return <Header variant="h2">UV Index</Header>;
}

function UVIndexWidget() {
  const uvIndex = 6;
  const uvLevel = uvIndex >= 8 ? 'Very High' : uvIndex >= 6 ? 'High' : uvIndex >= 3 ? 'Moderate' : 'Low';
  const uvStatus = uvIndex >= 8 ? 'error' : uvIndex >= 6 ? 'warning' : 'success';

  return (
    <SpaceBetween size="m">
      <Box textAlign="center">
        <Box fontSize="display-l" fontWeight="bold">
          {uvIndex}
        </Box>
        <Box fontSize="heading-s" color={`text-status-${uvStatus}`}>
          {uvLevel}
        </Box>
      </Box>
      
      <ProgressBar
        value={(uvIndex / 11) * 100}
        variant="standalone"
        status={uvStatus}
        additionalInfo="Protection recommended from 10 AM - 4 PM"
        description="UV radiation level"
      />

      <Box variant="small" color="text-body-secondary">
        Wear sunscreen (SPF 30+) and protective clothing during peak hours.
      </Box>
    </SpaceBetween>
  );
}

export const uvIndex: WidgetConfig = {
  header: UVIndexHeader,
  content: UVIndexWidget,
};
