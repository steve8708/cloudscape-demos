// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import SideNavigation, { SideNavigationProps } from '@cloudscape-design/components/side-navigation';

const items: SideNavigationProps.Item[] = [
  {
    type: 'section',
    text: 'Weather Dashboard',
    items: [
      { type: 'link', text: 'Current Conditions', href: '#current' },
      { type: 'link', text: 'Hourly Forecast', href: '#hourly' },
      { type: 'link', text: 'Daily Forecast', href: '#daily' },
      { type: 'link', text: 'Charts & Graphs', href: '#charts' },
    ]
  },
  {
    type: 'section',
    text: 'Data Sources',
    items: [
      { type: 'link', text: 'Open Meteo API', href: 'https://open-meteo.com', external: true },
      { type: 'link', text: 'Documentation', href: 'https://open-meteo.com/en/docs', external: true },
    ]
  }
];

export function WeatherSideNavigation() {
  return (
    <SideNavigation
      activeHref="#current"
      header={{ href: '#/', text: 'Weather Dashboard' }}
      items={items}
    />
  );
}
