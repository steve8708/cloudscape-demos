// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Button from '@cloudscape-design/components/button';
import Container from '@cloudscape-design/components/container';
import SpaceBetween from '@cloudscape-design/components/space-between';

import { LocationData } from '../services/weather-service';

interface LocationControlsProps {
  currentLocation: LocationData;
  onSearchClick: () => void;
  onRefreshClick: () => void;
  loading?: boolean;
}

export function LocationControls({ currentLocation, onSearchClick, onRefreshClick, loading = false }: LocationControlsProps) {
  return (
    <Container>
      <SpaceBetween direction="horizontal" size="s" alignItems="center">
        <SpaceBetween direction="horizontal" size="xs" alignItems="center">
          <span style={{ fontSize: '14px', fontWeight: 'bold' }}>📍</span>
          <span style={{ fontSize: '14px' }}>
            {currentLocation.name}, {currentLocation.country}
          </span>
        </SpaceBetween>
        <Button variant="normal" iconName="search" onClick={onSearchClick}>
          Change Location
        </Button>
        <Button variant="normal" iconName="refresh" onClick={onRefreshClick} loading={loading}>
          Refresh
        </Button>
      </SpaceBetween>
    </Container>
  );
}
