// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Grid from '@cloudscape-design/components/grid';

import { AirQuality } from '../widgets/air-quality';
import { CurrentWeather } from '../widgets/current-weather';
import { Forecast } from '../widgets/forecast';
import { TemperatureChart } from '../widgets/temperature-chart';
import { UVIndex } from '../widgets/uv-index';
import { WindConditions } from '../widgets/wind-conditions';

export function WeatherContent() {
  return (
    <Grid
      gridDefinition={[
        { colspan: { l: 8, m: 12, default: 12 } },
        { colspan: { l: 4, m: 12, default: 12 } },
        { colspan: { l: 12, m: 12, default: 12 } },
        { colspan: { l: 4, m: 12, default: 12 } },
        { colspan: { l: 4, m: 12, default: 12 } },
        { colspan: { l: 4, m: 12, default: 12 } },
      ]}
    >
      <CurrentWeather />
      <TemperatureChart />
      <Forecast />
      <AirQuality />
      <UVIndex />
      <WindConditions />
    </Grid>
  );
}
