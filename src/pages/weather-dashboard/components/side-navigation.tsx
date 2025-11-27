// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import SideNavigation from '@cloudscape-design/components/side-navigation';

export function WeatherSideNavigation() {
  return (
    <SideNavigation
      activeHref="#/weather-dashboard"
      header={{ href: '#/', text: 'Weather Service' }}
      items={[
        { type: 'link', text: 'Dashboard', href: '#/weather-dashboard' },
        { type: 'divider' },
        {
          type: 'section',
          text: 'Weather Data',
          items: [
            { type: 'link', text: 'Current conditions', href: '#/current' },
            { type: 'link', text: 'Hourly forecast', href: '#/hourly' },
            { type: 'link', text: 'Daily forecast', href: '#/daily' },
          ],
        },
        {
          type: 'section',
          text: 'Analytics',
          items: [
            { type: 'link', text: 'Temperature trends', href: '#/temperature-trends' },
            { type: 'link', text: 'Precipitation analysis', href: '#/precipitation' },
            { type: 'link', text: 'Wind patterns', href: '#/wind-patterns' },
          ],
        },
        { type: 'divider' },
        { type: 'link', text: 'Settings', href: '#/settings' },
        { type: 'link', text: 'Locations', href: '#/locations' },
      ]}
    />
  );
}
