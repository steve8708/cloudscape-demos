// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useState } from 'react';

import Header from '@cloudscape-design/components/header';
import Select from '@cloudscape-design/components/select';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Button from '@cloudscape-design/components/button';
import Box from '@cloudscape-design/components/box';

import { Location, defaultLocations } from '../services/weather-api';

interface WeatherHeaderProps {
  selectedLocation?: Location;
  onLocationChange?: (location: Location) => void;
  onRefresh?: () => void;
  isLoading?: boolean;
}

export function WeatherHeader({
  selectedLocation = defaultLocations[0],
  onLocationChange,
  onRefresh,
  isLoading = false,
}: WeatherHeaderProps) {
  const [selectedOption, setSelectedOption] = useState({
    label: `${selectedLocation.name}, ${selectedLocation.country}`,
    value: selectedLocation.name,
    description: `${selectedLocation.latitude.toFixed(2)}, ${selectedLocation.longitude.toFixed(2)}`,
  });

  const locationOptions = defaultLocations.map(location => ({
    label: `${location.name}, ${location.country}`,
    value: location.name,
    description: `${location.latitude.toFixed(2)}, ${location.longitude.toFixed(2)}`,
  }));

  const handleLocationChange = (option: any) => {
    setSelectedOption(option);
    const location = defaultLocations.find(loc => loc.name === option.value);
    if (location && onLocationChange) {
      onLocationChange(location);
    }
  };

  return (
    <Header
      variant="h1"
      description="Real-time weather data and forecasts powered by Open Meteo"
      actions={
        <SpaceBetween direction="horizontal" size="s">
          <Select
            selectedOption={selectedOption}
            onChange={({ detail }) => handleLocationChange(detail.selectedOption)}
            options={locationOptions}
            placeholder="Choose a location"
            loadingText="Loading locations"
            statusType={isLoading ? 'loading' : 'finished'}
          />
          <Button iconName="refresh" variant="normal" onClick={onRefresh} loading={isLoading}>
            Refresh
          </Button>
        </SpaceBetween>
      }
    >
      <SpaceBetween direction="horizontal" size="s" alignItems="center">
        Weather Dashboard
        <Box variant="span" color="text-status-info">
          {selectedLocation.name}
        </Box>
      </SpaceBetween>
    </Header>
  );
}
