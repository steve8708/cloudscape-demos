// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import SegmentedControl from '@cloudscape-design/components/segmented-control';

import { useTemperatureUnit } from '../context/temperature-unit-context';

export function TemperatureUnitPicker() {
  const { unit, setUnit } = useTemperatureUnit();

  return (
    <SegmentedControl
      selectedId={unit}
      onChange={({ detail }) => setUnit(detail.selectedId as 'celsius' | 'fahrenheit')}
      label="Temperature unit"
      options={[
        { id: 'celsius', text: '°C' },
        { id: 'fahrenheit', text: '°F' },
      ]}
    />
  );
}
