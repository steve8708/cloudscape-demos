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
          type: 'link',
          text: 'Current Weather',
          href: '#/weather-dashboard/current',
        },
        {
          type: 'link',
          text: 'Forecast',
          href: '#/weather-dashboard/forecast',
        },
        {
          type: 'link',
          text: 'Locations',
          href: '#/weather-dashboard/locations',
        },
      ]}
    />
  );
}
