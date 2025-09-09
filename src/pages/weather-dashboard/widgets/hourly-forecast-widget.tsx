// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Table from '@cloudscape-design/components/table';
import Box from '@cloudscape-design/components/box';

import { HourlyWeather, weatherAPI } from '../services/weather-api';
import { useTemperatureUnit } from '../context/temperature-unit-context';

interface HourlyForecastWidgetProps {
  data: HourlyWeather;
}

export function HourlyForecastWidget({ data }: HourlyForecastWidgetProps) {
  const { convertTemperature, getUnitSymbol } = useTemperatureUnit();

  const tableItems = data.time.slice(0, 8).map((time, index) => {
    const weatherInfo = weatherAPI.getWeatherDescription(data.weatherCode[index]);
    return {
      time: new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      temperature: Math.round(convertTemperature(data.temperature[index])),
      weather: weatherInfo,
      precipitation: data.precipitation[index],
      humidity: data.humidity[index],
      windSpeed: Math.round(data.windSpeed[index]),
    };
  });

  return (
    <Container
      header={
        <Header description="Next 8 hours detailed forecast">
          Hourly Forecast
        </Header>
      }
    >
      <Table
        columnDefinitions={[
          {
            id: 'time',
            header: 'Time',
            cell: item => item.time,
            sortingField: 'time',
          },
          {
            id: 'weather',
            header: 'Conditions',
            cell: item => (
              <Box>
                <span style={{ marginRight: '8px' }}>{item.weather.icon}</span>
                {item.weather.description}
              </Box>
            ),
          },
          {
            id: 'temperature',
            header: 'Temp',
            cell: item => `${item.temperature}${getUnitSymbol()}`,
          },
          {
            id: 'precipitation',
            header: 'Precip',
            cell: item => `${item.precipitation}mm`,
          },
          {
            id: 'humidity',
            header: 'Humidity',
            cell: item => `${item.humidity}%`,
          },
          {
            id: 'windSpeed',
            header: 'Wind',
            cell: item => `${item.windSpeed}km/h`,
          },
        ]}
        items={tableItems}
        variant="borderless"
        wrapLines
      />
    </Container>
  );
}
