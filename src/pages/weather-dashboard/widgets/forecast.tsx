// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Box from '@cloudscape-design/components/box';
import Cards from '@cloudscape-design/components/cards';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';

const forecastData = [
  { day: 'Monday', high: 75, low: 58, condition: 'Sunny', icon: '☀️' },
  { day: 'Tuesday', high: 73, low: 56, condition: 'Partly Cloudy', icon: '⛅' },
  { day: 'Wednesday', high: 68, low: 54, condition: 'Cloudy', icon: '☁️' },
  { day: 'Thursday', high: 71, low: 55, condition: 'Sunny', icon: '☀️' },
  { day: 'Friday', high: 74, low: 59, condition: 'Clear', icon: '☀️' },
];

export function Forecast() {
  return (
    <Container header={<Header variant="h2">5-Day Forecast</Header>}>
      <Cards
        cardDefinition={{
          header: item => (
            <div style={{ textAlign: 'center' }}>
              <Box variant="h3">{item.day}</Box>
            </div>
          ),
          sections: [
            {
              id: 'icon',
              content: item => <div style={{ textAlign: 'center', fontSize: '48px' }}>{item.icon}</div>,
            },
            {
              id: 'condition',
              content: item => (
                <div style={{ textAlign: 'center' }}>
                  <Box variant="p">{item.condition}</Box>
                </div>
              ),
            },
            {
              id: 'temp',
              content: item => (
                <div style={{ textAlign: 'center' }}>
                  <Box variant="p">
                    <strong>{item.high}°</strong> / {item.low}°
                  </Box>
                </div>
              ),
            },
          ],
        }}
        cardsPerRow={[{ cards: 5 }]}
        items={forecastData}
        variant="full-page"
      />
    </Container>
  );
}
