// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import Badge from '@cloudscape-design/components/badge';

import { InfoLink } from '../../commons';

interface WeatherHeaderProps {
  actions?: React.ReactNode;
}

export function WeatherHeader({ actions }: WeatherHeaderProps) {
  return (
    <Header variant="h1" actions={actions}>
      Weather Dashboard <Badge color="green">Live</Badge>
    </Header>
  );
}

export function WeatherMainInfo() {
  return (
    <Container>
      <SpaceBetween size="l">
        <Box>
          <Box variant="awsui-key-label">About</Box>
          <Box>
            A comprehensive weather dashboard powered by the Open-Meteo API, providing real-time weather data,
            forecasts, and historical trends with interactive charts and visualizations.
          </Box>
        </Box>
        <Box>
          <Box variant="awsui-key-label">Features</Box>
          <ul>
            <li>Real-time current weather conditions</li>
            <li>24-hour temperature forecast with line charts</li>
            <li>7-day weather outlook with detailed metrics</li>
            <li>Interactive charts for temperature, humidity, and wind speed</li>
            <li>Precipitation and pressure data visualization</li>
          </ul>
        </Box>
        <Box>
          <Box variant="awsui-key-label">Data source</Box>
          <Box>
            Weather data is sourced from{' '}
            <InfoLink external={true} href="https://open-meteo.com" ariaLabel="Learn more about Open-Meteo API">
              Open-Meteo API
            </InfoLink>
            , a free and open-source weather API that provides accurate weather forecasts worldwide.
          </Box>
        </Box>
      </SpaceBetween>
    </Container>
  );
}
