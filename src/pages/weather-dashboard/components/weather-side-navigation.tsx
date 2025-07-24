// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import SideNavigation from '@cloudscape-design/components/side-navigation';

export function WeatherSideNavigation() {
  return (
    <SideNavigation
      activeHref="#/"
      header={{ href: "#/", text: "Weather" }}
      items={[
        { type: "link", text: "Current Weather", href: "#/current" },
        { type: "link", text: "Forecast", href: "#/forecast" },
        { type: "link", text: "Historical Data", href: "#/historical" },
        { type: "divider" },
        { type: "link", text: "Settings", href: "#/settings" },
        { type: "link", text: "About API", href: "#/about", external: true },
      ]}
    />
  );
}
