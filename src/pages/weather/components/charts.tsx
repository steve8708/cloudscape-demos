// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useMemo } from 'react';

import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import LineChart from '@cloudscape-design/components/line-chart';
import BarChart from '@cloudscape-design/components/bar-chart';
import ColumnLayout from '@cloudscape-design/components/column-layout';

import { commonChartProps } from '../chart-commons';

interface WeatherChartsProps {
  hourlyData: {
    time: string[];
    temperature_2m: number[];
    precipitation: number[];
    windspeed_10m: number[];
    relativehumidity_2m: number[];
    pressure_msl: number[];
  };
  dailyData: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    windspeed_10m_max: number[];
  };
}

export function WeatherCharts({ hourlyData, dailyData }: WeatherChartsProps) {
  const hourlyTemperatureSeries = useMemo(() => {
    const next24Hours = hourlyData.time.slice(0, 24);
    return [
      {
        title: 'Temperature',
        type: 'line' as const,
        data: next24Hours.map((time, index) => ({
          x: new Date(time),
          y: hourlyData.temperature_2m[index],
        })),
      },
    ];
  }, [hourlyData]);

  const precipitationSeries = useMemo(() => {
    const next24Hours = hourlyData.time.slice(0, 24);
    return [
      {
        title: 'Precipitation',
        type: 'bar' as const,
        data: next24Hours.map((time, index) => ({
          x: new Date(time),
          y: hourlyData.precipitation[index],
        })),
      },
    ];
  }, [hourlyData]);

  const windSpeedSeries = useMemo(() => {
    const next24Hours = hourlyData.time.slice(0, 24);
    return [
      {
        title: 'Wind Speed',
        type: 'line' as const,
        data: next24Hours.map((time, index) => ({
          x: new Date(time),
          y: hourlyData.windspeed_10m[index],
        })),
      },
    ];
  }, [hourlyData]);

  const humidityPressureSeries = useMemo(() => {
    const next24Hours = hourlyData.time.slice(0, 24);
    return [
      {
        title: 'Humidity',
        type: 'line' as const,
        data: next24Hours.map((time, index) => ({
          x: new Date(time),
          y: hourlyData.relativehumidity_2m[index],
        })),
      },
    ];
  }, [hourlyData]);

  const dailyTemperatureBars = useMemo(() => {
    return dailyData.time.map((date, index) => ({
      x: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      y: dailyData.temperature_2m_max[index],
    }));
  }, [dailyData]);

  const dailyPrecipitationBars = useMemo(() => {
    return dailyData.time.map((date, index) => ({
      x: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      y: dailyData.precipitation_sum[index],
    }));
  }, [dailyData]);

  const dateTimeFormatter = (date: Date) =>
    date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      hour12: false,
    }) + ':00';

  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header variant="h2" description="Hourly temperature forecast for the next 24 hours">
            24-Hour Temperature Trend
          </Header>
        }
      >
        <LineChart
          {...commonChartProps}
          series={hourlyTemperatureSeries}
          xScaleType="time"
          yTitle="Temperature (°C)"
          xTitle="Time"
          height={300}
          hideFilter
          ariaLabel="24-hour temperature forecast"
          i18nStrings={{
            ...commonChartProps.i18nStrings,
            xTickFormatter: dateTimeFormatter,
            yTickFormatter: value => `${value}°C`,
          }}
        />
      </Container>

      <ColumnLayout columns={2}>
        <Container
          header={
            <Header variant="h2" description="Hourly precipitation for the next 24 hours">
              Precipitation Forecast
            </Header>
          }
        >
          <LineChart
            {...commonChartProps}
            series={precipitationSeries}
            xScaleType="time"
            yTitle="Precipitation (mm)"
            xTitle="Time"
            height={250}
            hideFilter
            ariaLabel="24-hour precipitation forecast"
            i18nStrings={{
              ...commonChartProps.i18nStrings,
              xTickFormatter: dateTimeFormatter,
              yTickFormatter: value => `${value} mm`,
            }}
          />
        </Container>

        <Container
          header={
            <Header variant="h2" description="Hourly wind speed for the next 24 hours">
              Wind Speed Forecast
            </Header>
          }
        >
          <LineChart
            {...commonChartProps}
            series={windSpeedSeries}
            xScaleType="time"
            yTitle="Wind Speed (km/h)"
            xTitle="Time"
            height={250}
            hideFilter
            ariaLabel="24-hour wind speed forecast"
            i18nStrings={{
              ...commonChartProps.i18nStrings,
              xTickFormatter: dateTimeFormatter,
              yTickFormatter: value => `${value} km/h`,
            }}
          />
        </Container>
      </ColumnLayout>

      <ColumnLayout columns={2}>
        <Container
          header={
            <Header variant="h2" description="Hourly relative humidity for the next 24 hours">
              Humidity Levels
            </Header>
          }
        >
          <LineChart
            {...commonChartProps}
            series={humidityPressureSeries}
            xScaleType="time"
            yTitle="Humidity (%)"
            xTitle="Time"
            height={250}
            hideFilter
            ariaLabel="24-hour humidity forecast"
            i18nStrings={{
              ...commonChartProps.i18nStrings,
              xTickFormatter: dateTimeFormatter,
              yTickFormatter: value => `${value}%`,
            }}
          />
        </Container>

        <Container
          header={
            <Header variant="h2" description="7-day maximum temperature forecast">
              Weekly Temperature Overview
            </Header>
          }
        >
          <BarChart
            {...commonChartProps}
            series={[
              {
                title: 'Max Temperature',
                type: 'bar',
                data: dailyTemperatureBars,
              },
            ]}
            xScaleType="categorical"
            yTitle="Temperature (°C)"
            xTitle="Date"
            height={250}
            hideFilter
            ariaLabel="7-day maximum temperature forecast"
            i18nStrings={{
              ...commonChartProps.i18nStrings,
              yTickFormatter: value => `${value}°C`,
            }}
          />
        </Container>
      </ColumnLayout>

      <Container
        header={
          <Header variant="h2" description="Total precipitation for the next 7 days">
            7-Day Precipitation Total
          </Header>
        }
      >
        <BarChart
          {...commonChartProps}
          series={[
            {
              title: 'Precipitation',
              type: 'bar',
              data: dailyPrecipitationBars,
            },
          ]}
          xScaleType="categorical"
          yTitle="Precipitation (mm)"
          xTitle="Date"
          height={300}
          hideFilter
          ariaLabel="7-day precipitation forecast"
          i18nStrings={{
            ...commonChartProps.i18nStrings,
            yTickFormatter: value => `${value} mm`,
          }}
        />
      </Container>
    </SpaceBetween>
  );
}
