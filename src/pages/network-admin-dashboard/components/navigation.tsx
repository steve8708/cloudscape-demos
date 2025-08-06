// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';
import SideNavigation from '@cloudscape-design/components/side-navigation';

export function NetworkAdminNavigation() {
  return (
    <SideNavigation
      activeHref="#/network-admin-dashboard"
      header={{ href: '#/', text: 'Service name' }}
      items={[
        { type: 'link', text: 'Network Dashboard', href: '#/network-admin-dashboard' },
        { type: 'link', text: 'Device Management', href: '#/devices' },
        { type: 'link', text: 'Traffic Analytics', href: '#/traffic' },
        { type: 'link', text: 'Credit Management', href: '#/credits' },
        { type: 'divider' },
        { type: 'link', text: 'Settings', href: '#/settings' },
        { type: 'link', text: 'Help', href: '#/help' },
      ]}
    />
  );
}
