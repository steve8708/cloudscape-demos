// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useState, useCallback, useRef } from 'react';
import Autosuggest from '@cloudscape-design/components/autosuggest';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import { searchCities, GeocodingResult, Location } from './weather-api';

interface CitySearchProps {
  onLocationSelect: (location: Location) => void;
  placeholder?: string;
}

export default function CitySearch({ onLocationSelect, placeholder = "Search for any city..." }: CitySearchProps) {
  const [value, setValue] = useState('');
  const [options, setOptions] = useState<{ value: string; label: string; description?: string; data: GeocodingResult }[]>([]);
  const [status, setStatus] = useState<'pending' | 'loading' | 'finished' | 'error'>('finished');
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  const handleLoadItems = useCallback(async (query: string) => {
    if (query.length < 2) {
      setOptions([]);
      setStatus('finished');
      return;
    }

    setStatus('loading');
    
    try {
      const results = await searchCities(query);
      const formattedOptions = results.map(result => ({
        value: `${result.name}, ${result.country}`,
        label: result.name,
        description: `${result.admin1 ? `${result.admin1}, ` : ''}${result.country}`,
        data: result,
      }));
      
      setOptions(formattedOptions);
      setStatus('finished');
    } catch (error) {
      console.error('Error loading cities:', error);
      setOptions([]);
      setStatus('error');
    }
  }, []);

  const debouncedLoadItems = useCallback((query: string) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      handleLoadItems(query);
    }, 300);
  }, [handleLoadItems]);

  const handleChange = (event: any) => {
    const newValue = event.detail.value;
    setValue(newValue);
    debouncedLoadItems(newValue);
  };

  const handleSelect = (event: any) => {
    const selectedOption = event.detail.selectedOption;
    if (selectedOption?.data) {
      const result = selectedOption.data as GeocodingResult;
      const location: Location = {
        latitude: result.latitude,
        longitude: result.longitude,
        name: result.name,
        country: result.country,
        admin1: result.admin1,
      };
      
      onLocationSelect(location);
      setValue(selectedOption.value);
      setOptions([]);
    }
  };

  const handleKeyDown = (event: any) => {
    // Clear search when Escape is pressed
    if (event.detail.key === 'Escape') {
      setValue('');
      setOptions([]);
    }
  };

  return (
    <Autosuggest
      onChange={handleChange}
      onSelect={handleSelect}
      onKeyDown={handleKeyDown}
      value={value}
      options={options}
      loadingText="Searching cities..."
      errorText="Error occurred while searching"
      recoveryText="Retry"
      finishedText={options.length === 0 && value.length >= 2 ? "No cities found" : undefined}
      placeholder={placeholder}
      empty={
        value.length < 2 ? (
          <Box textAlign="center" color="inherit" padding="s">
            <Box variant="p">Type at least 2 characters to search for cities</Box>
          </Box>
        ) : undefined
      }
      statusType={status}
      enteredTextLabel={(value) => `Use "${value}"`}
      ariaLabel="City search"
      renderHighlightedAriaLive={(option) => option.label}
      expandToViewport={true}
    />
  );
}
