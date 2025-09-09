// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Header from '@cloudscape-design/components/header';
import HelpPanel from '@cloudscape-design/components/help-panel';
import SpaceBetween from '@cloudscape-design/components/space-between';

import { ExternalLinkGroup, InfoLink, useHelpPanel } from '../../commons';
import { TemperatureUnitPicker } from './temperature-unit-picker';

export function WeatherDashboardMainInfo() {
  return (
    <HelpPanel
      header={<h2>Weather Dashboard</h2>}
      footer={
        <ExternalLinkGroup
          items={[
            { href: 'https://open-meteo.com/en/docs', text: 'Open-Meteo API Documentation' },
            { href: 'https://open-meteo.com/en/features', text: 'Weather Data Features' },
            { href: 'https://cloudscape.design/components/', text: 'Cloudscape Components' },
          ]}
        />
      }
    >
      <p>
        This weather dashboard displays real-time weather information and forecasts using the Open-Meteo API. 
        It provides current conditions, hourly forecasts, and daily weather predictions for any location worldwide.
      </p>
      <p>
        The dashboard includes temperature trends, precipitation data, weather conditions, and interactive charts 
        to help you monitor weather patterns effectively.
      </p>
    </HelpPanel>
  );
}

export function WeatherDashboardHeader({ actions }: { actions: React.ReactNode }) {
  const loadHelpPanelContent = useHelpPanel();
  return (
    <Header
      variant="h1"
      info={<InfoLink onFollow={() => loadHelpPanelContent(<WeatherDashboardMainInfo />)} />}
      actions={
        <SpaceBetween direction="horizontal" size="m">
          <TemperatureUnitPicker />
          {actions}
        </SpaceBetween>
      }
    >
      Weather Dashboard
    </Header>
  );
}
