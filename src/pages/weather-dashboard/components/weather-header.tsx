// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import Container from '@cloudscape-design/components/container';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';

import { ExternalLinkItem } from '../../commons';

export function WeatherHeader({ actions, location }: { actions: React.ReactNode; location: string }) {
  return (
    <Header
      variant="h1"
      actions={actions}
      description="Real-time weather data and forecasts powered by Open Meteo API"
    >
      Weather Dashboard - {location}
    </Header>
  );
}

export function WeatherHelpInfo() {
  return (
    <SpaceBetween size="l">
      <div>
        <Header variant="h3">Weather Dashboard</Header>
        <Box variant="p">
          This dashboard displays comprehensive weather information including current conditions, 
          hourly forecasts, and detailed weather metrics using the Open Meteo API.
        </Box>
      </div>

      <Container header={<Header variant="h4">Features</Header>}>
        <SpaceBetween size="s">
          <Box variant="small">
            • Current weather conditions including temperature, humidity, and wind speed
          </Box>
          <Box variant="small">
            • 24-hour temperature and precipitation forecast charts
          </Box>
          <Box variant="small">
            • 7-day weather forecast with daily highs and lows
          </Box>
          <Box variant="small">
            • Interactive charts and graphs for weather visualization
          </Box>
          <Box variant="small">
            • Support for any global location using latitude and longitude
          </Box>
        </SpaceBetween>
      </Container>

      <ExpandableSection defaultExpanded headerText="API Information">
        <SpaceBetween size="s">
          <ExternalLinkItem
            href="https://open-meteo.com/"
            text="Open Meteo API Documentation"
          />
          <Box variant="small">
            Open Meteo provides free weather forecast APIs for open-source developers and 
            non-commercial use. No API key required.
          </Box>
        </SpaceBetween>
      </ExpandableSection>
    </SpaceBetween>
  );
}
