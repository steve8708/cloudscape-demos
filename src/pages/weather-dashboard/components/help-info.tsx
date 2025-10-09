// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import HelpPanel from '@cloudscape-design/components/help-panel';
import SpaceBetween from '@cloudscape-design/components/space-between';

export function WeatherMainInfo() {
  return (
    <HelpPanel header={<h2>Weather Dashboard</h2>}>
      <SpaceBetween size="m">
        <div>
          <h3>About this dashboard</h3>
          <p>
            This dashboard displays real-time weather information from the Open-Meteo API, a free weather API service
            that provides accurate forecast and current weather data.
          </p>
        </div>
        <div>
          <h3>Data sources</h3>
          <p>
            Weather data is fetched from Open-Meteo API endpoints, including temperature, precipitation, wind speed, and
            other meteorological information for various locations.
          </p>
        </div>
      </SpaceBetween>
    </HelpPanel>
  );
}
