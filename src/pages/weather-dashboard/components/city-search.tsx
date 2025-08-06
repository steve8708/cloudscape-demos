// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useState, useEffect, useCallback } from 'react';

import Alert from '@cloudscape-design/components/alert';
import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import Modal from '@cloudscape-design/components/modal';
import Select from '@cloudscape-design/components/select';
import SpaceBetween from '@cloudscape-design/components/space-between';
import StatusIndicator from '@cloudscape-design/components/status-indicator';

import { GeocodingResult, geocodingService } from '../services/geocoding-service';
import { LocationData, weatherService } from '../services/weather-service';

interface CitySearchProps {
  visible: boolean;
  onDismiss: () => void;
  onLocationSelect: (location: LocationData) => void;
  currentLocation: LocationData;
}

interface SelectOption {
  label: string;
  value: string;
  description?: string;
  iconName?: string;
  tags?: string[];
  labelTag?: string;
}

export function CitySearch({ visible, onDismiss, onLocationSelect, currentLocation }: CitySearchProps) {
  const [searchResults, setSearchResults] = useState<GeocodingResult[]>([]);
  const [selectedOption, setSelectedOption] = useState<SelectOption | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchCities = useCallback(async (query: string) => {
    if (!query.trim() || query.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const results = await geocodingService.searchCities(query, 15);
      setSearchResults(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search cities');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Convert geocoding results to select options
  const options: SelectOption[] = searchResults.map(result => ({
    label: geocodingService.formatCityName(result),
    value: `${result.latitude},${result.longitude}`,
    description: geocodingService.formatCityDescription(result),
    tags: [result.country_code, result.timezone || ''].filter(Boolean),
    labelTag: result.population ? `${Math.round(result.population / 1000)}K` : undefined
  }));

  const handleLocationSelect = () => {
    if (!selectedOption) return;

    const [lat, lng] = selectedOption.value.split(',').map(Number);
    const selectedResult = searchResults.find(
      result => result.latitude === lat && result.longitude === lng
    );

    if (selectedResult) {
      const newLocation: LocationData = {
        latitude: selectedResult.latitude,
        longitude: selectedResult.longitude,
        name: selectedResult.name,
        country: selectedResult.country
      };

      onLocationSelect(newLocation);
      setSelectedOption(null);
      onDismiss();
    }
  };

  const handleDismiss = () => {
    setSelectedOption(null);
    setSearchResults([]);
    setError(null);
    onDismiss();
  };

  return (
    <Modal
      onDismiss={handleDismiss}
      visible={visible}
      closeAriaLabel="Close city search"
      size="medium"
      header="Search for a City"
      footer={
        <Box float="right">
          <SpaceBetween direction="horizontal" size="xs">
            <Button variant="link" onClick={handleDismiss}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleLocationSelect}
              disabled={!selectedOption}
            >
              Select City
            </Button>
          </SpaceBetween>
        </Box>
      }
    >
      <SpaceBetween size="m">
        <Box variant="p">
          Search for a city to view its weather forecast. Start typing a city name to see available options.
        </Box>

        <Box>
          <Box variant="h3" padding={{ bottom: 's' }}>
            Current Location
          </Box>
          <StatusIndicator type="success">
            {currentLocation.name}, {currentLocation.country}
          </StatusIndicator>
        </Box>

        {error && (
          <Alert type="error" header="Search Error">
            {error}
          </Alert>
        )}

        <Box>
          <Box variant="h3" padding={{ bottom: 's' }}>
            Search Cities
          </Box>
          <Select
            selectedOption={selectedOption}
            onChange={({ detail }) => setSelectedOption(detail.selectedOption)}
            options={options}
            placeholder="Type to search for cities..."
            loadingText="Searching cities..."
            statusType={loading ? 'loading' : 'finished'}
            empty="No cities found. Try a different search term."
            filteringType="manual"
            onLoadItems={({ detail }) => {
              if (detail.filteringText !== undefined) {
                searchCities(detail.filteringText);
              }
            }}
            ariaLabel="City search"
            expandToViewport={true}
          />
        </Box>

        {selectedOption && (
          <Box>
            <Box variant="h3" padding={{ bottom: 's' }}>
              Selected City
            </Box>
            <StatusIndicator type="info">
              {selectedOption.label}
            </StatusIndicator>
            {selectedOption.description && (
              <Box variant="small" color="text-status-subdued" padding={{ top: 'xs' }}>
                {selectedOption.description}
              </Box>
            )}
          </Box>
        )}
      </SpaceBetween>
    </Modal>
  );
}
