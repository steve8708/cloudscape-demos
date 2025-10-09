// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import SpaceBetween from '@cloudscape-design/components/space-between';

import { CurrentWeather } from './widgets/current-weather';
import { ForecastChart } from './widgets/forecast-chart';
import { LocationSummary } from './widgets/location-summary';

const locations = [
  { name: 'New York', latitude: 40.7128, longitude: -74.006, timezone: 'America/New_York' },
  { name: 'London', latitude: 51.5074, longitude: -0.1278, timezone: 'Europe/London' },
  { name: 'Tokyo', latitude: 35.6762, longitude: 139.6503, timezone: 'Asia/Tokyo' },
];

export function WeatherContent() {
  return (
    <SpaceBetween size="l">
      <LocationSummary locations={locations} />
      {locations.map(location => (
        <React.Fragment key={location.name}>
          <CurrentWeather latitude={location.latitude} longitude={location.longitude} locationName={location.name} />
          <ForecastChart latitude={location.latitude} longitude={location.longitude} locationName={location.name} />
        </React.Fragment>
      ))}
    </SpaceBetween>
  );
}
