// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import ProgressBar from '@cloudscape-design/components/progress-bar';

import { CurrentWeather, HourlyWeather } from '../services/weather-api';

interface WindWidgetProps {
  current: CurrentWeather;
  hourly: HourlyWeather;
}

function getWindDirection(degrees: number): string {
  const directions = [
    'N',
    'NNE',
    'NE',
    'ENE',
    'E',
    'ESE',
    'SE',
    'SSE',
    'S',
    'SSW',
    'SW',
    'WSW',
    'W',
    'WNW',
    'NW',
    'NNW',
  ];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

function getWindSpeedCategory(speed: number): { category: string; color: string } {
  if (speed < 5) return { category: 'Light', color: 'green' };
  if (speed < 15) return { category: 'Moderate', color: 'blue' };
  if (speed < 30) return { category: 'Strong', color: 'orange' };
  return { category: 'Very Strong', color: 'red' };
}

export function WindWidget({ current, hourly }: WindWidgetProps) {
  const currentWindCategory = getWindSpeedCategory(current.windSpeed);
  const avgWindSpeed = hourly.windSpeed.slice(0, 12).reduce((a, b) => a + b, 0) / 12;
  const maxWindSpeed = Math.max(...hourly.windSpeed.slice(0, 12));

  return (
    <Container header={<Header description="Current wind conditions and 12-hour trend">Wind Information</Header>}>
      <SpaceBetween size="l">
        <ColumnLayout columns={2} variant="text-grid">
          <div>
            <Box variant="awsui-key-label">Current Speed</Box>
            <Box fontSize="heading-s">{Math.round(current.windSpeed)} km/h</Box>
            <Box variant="small" color={currentWindCategory.color as any}>
              {currentWindCategory.category}
            </Box>
          </div>
          <div>
            <Box variant="awsui-key-label">Direction</Box>
            <Box fontSize="heading-s">
              {getWindDirection(current.windDirection)} ({Math.round(current.windDirection)}°)
            </Box>
          </div>
        </ColumnLayout>

        <div>
          <Box variant="awsui-key-label" margin={{ bottom: 's' }}>
            12-Hour Wind Speed Range
          </Box>
          <ProgressBar
            value={current.windSpeed}
            additionalInfo={`Average: ${Math.round(avgWindSpeed)} km/h`}
            description={`Current: ${Math.round(current.windSpeed)} km/h | Max: ${Math.round(maxWindSpeed)} km/h`}
            label="Wind Speed"
            resultButtonText="Current"
            status="success"
          />
        </div>

        <div style={{ transform: `rotate(${current.windDirection}deg)`, textAlign: 'center', fontSize: '2rem' }}>↑</div>
        <Box variant="small" textAlign="center" color="text-body-secondary">
          Wind direction indicator
        </Box>
      </SpaceBetween>
    </Container>
  );
}
