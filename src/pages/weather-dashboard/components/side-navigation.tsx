// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import SideNavigation from '@cloudscape-design/components/side-navigation';

export function WeatherSideNavigation() {
  return (
    <SideNavigation
      header={{ text: 'Weather', href: '#/' }}
      items={[
        { type: 'link', text: 'Dashboard', href: '#/' },
        { type: 'divider' },
        {
          type: 'section',
          text: 'Locations',
          items: [
            { type: 'link', text: 'San Francisco', href: '#/sf' },
            { type: 'link', text: 'New York', href: '#/ny' },
            { type: 'link', text: 'London', href: '#/london' },
            { type: 'link', text: 'Tokyo', href: '#/tokyo' },
          ],
        },
        { type: 'divider' },
        {
          type: 'section',
          text: 'Settings',
          items: [
            { type: 'link', text: 'Preferences', href: '#/preferences' },
            { type: 'link', text: 'Alerts', href: '#/alerts' },
          ],
        },
      ]}
    />
  );
}
