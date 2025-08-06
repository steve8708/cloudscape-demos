// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import SideNavigation from '@cloudscape-design/components/side-navigation';

export function WeatherSideNavigation() {
  return (
    <SideNavigation
      activeHref="/weather-dashboard"
      header={{ href: '/weather-dashboard', text: 'Weather Dashboard' }}
      items={[
        { type: 'link', text: 'Overview', href: '/weather-dashboard' },
        { type: 'divider' },
        {
          type: 'section',
          text: 'Weather Data',
          items: [
            { type: 'link', text: 'Current Conditions', href: '/weather-dashboard#current' },
            { type: 'link', text: 'Hourly Forecast', href: '/weather-dashboard#hourly' },
            { type: 'link', text: 'Temperature Trends', href: '/weather-dashboard#temperature' },
            { type: 'link', text: 'Wind & Humidity', href: '/weather-dashboard#wind-humidity' },
          ],
        },
        { type: 'divider' },
        {
          type: 'section',
          text: 'Settings',
          items: [
            { type: 'link', text: 'Location Settings', href: '/weather-dashboard#location' },
            { type: 'link', text: 'Units', href: '/weather-dashboard#units' },
          ],
        },
      ]}
    />
  );
}
