// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import SegmentedControl from '@cloudscape-design/components/segmented-control';
import { TemperatureUnit } from './weather-api';

interface TemperatureToggleProps {
  value: TemperatureUnit;
  onChange: (unit: TemperatureUnit) => void;
}

export default function TemperatureToggle({ value, onChange }: TemperatureToggleProps) {
  const options = [
    {
      text: '°C',
      id: 'celsius' as const,
    },
    {
      text: '°F', 
      id: 'fahrenheit' as const,
    },
  ];

  return (
    <SegmentedControl
      selectedId={value}
      onChange={({ detail }) => onChange(detail.selectedId as TemperatureUnit)}
      label="Temperature unit"
      options={options}
    />
  );
}
