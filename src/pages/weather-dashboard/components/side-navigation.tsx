// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import SideNavigation, { SideNavigationProps } from '@cloudscape-design/components/side-navigation';

const navigationItems: SideNavigationProps['items'] = [
  { type: 'link', text: 'Current Weather', href: '#/weather-dashboard' },
  { type: 'link', text: 'Hourly Forecast', href: '#/weather-dashboard/hourly' },
  { type: 'link', text: 'Daily Forecast', href: '#/weather-dashboard/daily' },
  { type: 'divider' },
  {
    type: 'section',
    text: 'Weather Data',
    items: [
      { type: 'link', text: 'Temperature', href: '#/weather-dashboard/temperature' },
      { type: 'link', text: 'Precipitation', href: '#/weather-dashboard/precipitation' },
      { type: 'link', text: 'Wind', href: '#/weather-dashboard/wind' },
      { type: 'link', text: 'Atmospheric', href: '#/weather-dashboard/atmospheric' },
    ],
  },
  { type: 'divider' },
  {
    type: 'section',
    text: 'Settings',
    items: [
      { type: 'link', text: 'Location Settings', href: '#/weather-dashboard/settings' },
      { type: 'link', text: 'Units', href: '#/weather-dashboard/units' },
    ],
  },
];

export function WeatherDashboardSideNavigation() {
  return (
    <SideNavigation
      activeHref="#/weather-dashboard"
      header={{ href: '#/', text: 'Weather Service' }}
      items={navigationItems}
    />
  );
}
