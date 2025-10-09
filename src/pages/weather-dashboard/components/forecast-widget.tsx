// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import BarChart from '@cloudscape-design/components/bar-chart';
import Box from '@cloudscape-design/components/box';

interface ForecastWidgetProps {
  forecastData: {
    time: string[];
    temperature_2m: number[];
    precipitation_probability: number[];
  };
}

export function ForecastWidget({ forecastData }: ForecastWidgetProps) {
  // Take the next 24 hours of data, every 3 hours
  const hours = forecastData.time.slice(0, 24).filter((_, i) => i % 3 === 0);
  const temps = forecastData.temperature_2m.slice(0, 24).filter((_, i) => i % 3 === 0);
  const precip = forecastData.precipitation_probability.slice(0, 24).filter((_, i) => i % 3 === 0);

  const chartData = hours.map((time, index) => {
    const date = new Date(time);
    const hour = date.getHours();
    return {
      x: `${hour}:00`,
      temperature: temps[index],
      precipitation: precip[index],
    };
  });

  return (
    <Container header={<Header variant="h2">24-Hour Forecast</Header>}>
      <BarChart
        series={[
          {
            title: 'Temperature (°C)',
            type: 'bar',
            data: chartData.map(d => ({ x: d.x, y: d.temperature })),
          },
          {
            title: 'Precipitation (%)',
            type: 'bar',
            data: chartData.map(d => ({ x: d.x, y: d.precipitation })),
          },
        ]}
        xDomain={chartData.map(d => d.x)}
        yDomain={[0, Math.max(...temps, ...precip) + 10]}
        i18nStrings={{
          filterLabel: 'Filter displayed data',
          filterPlaceholder: 'Filter data',
          filterSelectedAriaLabel: 'selected',
          legendAriaLabel: 'Legend',
          chartAriaRoleDescription: 'bar chart',
          xAxisAriaRoleDescription: 'x axis',
          yAxisAriaRoleDescription: 'y axis',
        }}
        ariaLabel="Weather forecast bar chart"
        height={300}
        xScaleType="categorical"
        xTitle="Time"
        yTitle="Value"
        empty={
          <Box textAlign="center" color="inherit">
            <b>No data available</b>
            <Box variant="p" color="inherit">
              There is no forecast data available
            </Box>
          </Box>
        }
        noMatch={
          <Box textAlign="center" color="inherit">
            <b>No matching data</b>
            <Box variant="p" color="inherit">
              There is no matching data to display
            </Box>
          </Box>
        }
      />
    </Container>
  );
}
