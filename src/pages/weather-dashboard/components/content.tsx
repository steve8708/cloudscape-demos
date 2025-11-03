// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Grid from '@cloudscape-design/components/grid';
import Container from '@cloudscape-design/components/container';

import {
  currentWeather,
  forecast,
  temperatureChart,
  weatherMetrics,
  weatherAlerts,
  windChart,
  precipitationChart,
  uvIndex,
} from '../widgets';

export function Content() {
  return (
    <Grid
      gridDefinition={[
        { colspan: { l: 4, m: 6, default: 12 } },
        { colspan: { l: 8, m: 6, default: 12 } },
        { colspan: { l: 12, m: 12, default: 12 } },
        { colspan: { l: 6, m: 6, default: 12 } },
        { colspan: { l: 6, m: 6, default: 12 } },
        { colspan: { l: 4, m: 4, default: 12 } },
        { colspan: { l: 4, m: 4, default: 12 } },
        { colspan: { l: 4, m: 4, default: 12 } },
      ]}
    >
      <Container header={<currentWeather.header />} fitHeight={true}>
        <currentWeather.content />
      </Container>

      <Container header={<weatherAlerts.header />} fitHeight={true}>
        <weatherAlerts.content />
      </Container>

      <Container header={<temperatureChart.header />} fitHeight={true}>
        <temperatureChart.content />
      </Container>

      <Container header={<forecast.header />} fitHeight={true}>
        <forecast.content />
      </Container>

      <Container header={<weatherMetrics.header />} fitHeight={true}>
        <weatherMetrics.content />
      </Container>

      <Container header={<windChart.header />} fitHeight={true}>
        <windChart.content />
      </Container>

      <Container header={<precipitationChart.header />} fitHeight={true}>
        <precipitationChart.content />
      </Container>

      <Container header={<uvIndex.header />} fitHeight={true}>
        <uvIndex.content />
      </Container>
    </Grid>
  );
}
