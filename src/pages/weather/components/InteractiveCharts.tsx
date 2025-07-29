// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useState } from 'react';
import Container from '@cloudscape-design/components/container';
import Box from '@cloudscape-design/components/box';
import Grid from '@cloudscape-design/components/grid';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Button from '@cloudscape-design/components/button';
import ButtonGroup from '@cloudscape-design/components/button-group';
import Badge from '@cloudscape-design/components/badge';

interface WeatherData {
  current: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    weather_code: number;
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weather_code: number[];
    precipitation_sum: number[];
    wind_speed_10m_max: number[];
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    relative_humidity_2m: number[];
    precipitation: number[];
  };
}

interface InteractiveChartsProps {
  weatherData: WeatherData;
}

type ChartType = 'temperature' | 'humidity' | 'wind' | 'precipitation';

export default function InteractiveCharts({ weatherData }: InteractiveChartsProps) {
  const [activeChart, setActiveChart] = useState<ChartType>('temperature');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const formatTime = (timeStr: string) => {
    const date = new Date(timeStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const getChartData = (type: ChartType) => {
    switch (type) {
      case 'temperature':
        return {
          title: 'Daily Temperature Range',
          data: weatherData.daily.time.map((time, index) => ({
            label: formatTime(time),
            high: weatherData.daily.temperature_2m_max[index],
            low: weatherData.daily.temperature_2m_min[index],
            unit: '°F',
          })),
          color: '#0073bb',
        };
      case 'humidity':
        return {
          title: 'Hourly Humidity (Next 24h)',
          data: weatherData.hourly.time.slice(0, 24).map((time, index) => ({
            label: new Date(time).getHours() + ':00',
            value: weatherData.hourly.relative_humidity_2m[index],
            unit: '%',
          })),
          color: '#037f0c',
        };
      case 'wind':
        return {
          title: 'Daily Wind Speed',
          data: weatherData.daily.time.map((time, index) => ({
            label: formatTime(time),
            value: weatherData.daily.wind_speed_10m_max[index],
            unit: ' mph',
          })),
          color: '#8b2635',
        };
      case 'precipitation':
        return {
          title: 'Daily Precipitation',
          data: weatherData.daily.time.map((time, index) => ({
            label: formatTime(time),
            value: weatherData.daily.precipitation_sum[index],
            unit: '"',
          })),
          color: '#1d8102',
        };
    }
  };

  const chartData = getChartData(activeChart);

  const renderChart = () => {
    if (activeChart === 'temperature') {
      const maxHigh = Math.max(...chartData.data.map(d => d.high));
      const minLow = Math.min(...chartData.data.map(d => d.low));
      const range = maxHigh - minLow;

      return (
        <div
          style={{
            height: '250px',
            display: 'flex',
            alignItems: 'end',
            gap: '8px',
            border: '1px solid #e1e5e9',
            borderRadius: '8px',
            padding: '16px',
            backgroundColor: '#fafbfc',
            position: 'relative',
          }}
        >
          {chartData.data.map((item, index) => {
            const highHeight = ((item.high - minLow) / range) * 180 + 20;
            const lowHeight = ((item.low - minLow) / range) * 180 + 20;
            const isHovered = hoveredIndex === index;

            return (
              <div
                key={item.label}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  flex: 1,
                  cursor: 'pointer',
                  transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                  transition: 'transform 0.2s ease',
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div
                  style={{
                    height: `${highHeight}px`,
                    backgroundColor: isHovered ? '#005e9a' : chartData.color,
                    width: '100%',
                    borderRadius: '4px 4px 0 0',
                    position: 'relative',
                    minHeight: '20px',
                  }}
                >
                  {isHovered && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '-30px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: '#232f3e',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      H: {Math.round(item.high)}°F
                    </div>
                  )}
                </div>
                <div
                  style={{
                    height: `${lowHeight}px`,
                    backgroundColor: isHovered ? '#004d7a' : '#5294cf',
                    width: '100%',
                    borderRadius: '0 0 4px 4px',
                    position: 'relative',
                    minHeight: '20px',
                  }}
                >
                  {isHovered && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '-30px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: '#232f3e',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      L: {Math.round(item.low)}°F
                    </div>
                  )}
                </div>
                <Box variant="small" textAlign="center" padding={{ top: 'xs' }}>
                  {item.label.split(' ')[0]}
                </Box>
              </div>
            );
          })}
        </div>
      );
    }

    // For other chart types (single value charts)
    const maxValue = Math.max(...chartData.data.map(d => d.value));
    const minValue = Math.min(...chartData.data.map(d => d.value));
    const range = maxValue - minValue || 1;

    return (
      <div
        style={{
          height: '250px',
          display: 'flex',
          alignItems: 'end',
          gap: '4px',
          border: '1px solid #e1e5e9',
          borderRadius: '8px',
          padding: '16px',
          backgroundColor: '#fafbfc',
        }}
      >
        {chartData.data.map((item, index) => {
          const height = range > 0 ? ((item.value - minValue) / range) * 180 + 20 : 50;
          const isHovered = hoveredIndex === index;

          return (
            <div
              key={`${item.label}-${index}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flex: 1,
                cursor: 'pointer',
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div
                style={{
                  height: `${height}px`,
                  backgroundColor: isHovered ? '#005e9a' : chartData.color,
                  width: '100%',
                  borderRadius: '4px',
                  position: 'relative',
                  minHeight: '10px',
                  transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                  transition: 'all 0.2s ease',
                }}
              >
                {isHovered && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-35px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: '#232f3e',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      whiteSpace: 'nowrap',
                      zIndex: 10,
                    }}
                  >
                    {item.value.toFixed(1)}{item.unit}
                  </div>
                )}
              </div>
              <Box variant="small" textAlign="center" padding={{ top: 'xs' }}>
                {typeof item.label === 'string' && item.label.length > 6 
                  ? item.label.substring(0, 3) 
                  : item.label}
              </Box>
            </div>
          );
        })}
      </div>
    );
  };

  const getChartStats = () => {
    const data = chartData.data;
    if (activeChart === 'temperature') {
      const avgHigh = data.reduce((sum, item) => sum + item.high, 0) / data.length;
      const avgLow = data.reduce((sum, item) => sum + item.low, 0) / data.length;
      return [
        { label: 'Avg High', value: `${Math.round(avgHigh)}°F`, color: 'blue' },
        { label: 'Avg Low', value: `${Math.round(avgLow)}°F`, color: 'grey' },
      ];
    } else {
      const avg = data.reduce((sum, item) => sum + item.value, 0) / data.length;
      const max = Math.max(...data.map(item => item.value));
      const min = Math.min(...data.map(item => item.value));
      return [
        { label: 'Average', value: `${avg.toFixed(1)}${chartData.data[0].unit}`, color: 'blue' },
        { label: 'Maximum', value: `${max.toFixed(1)}${chartData.data[0].unit}`, color: 'red' },
        { label: 'Minimum', value: `${min.toFixed(1)}${chartData.data[0].unit}`, color: 'green' },
      ];
    }
  };

  return (
    <Container>
      <SpaceBetween size="m">
        <Box variant="h2">Interactive Weather Charts</Box>
        
        <ButtonGroup
          items={[
            { text: 'Temperature', id: 'temperature' },
            { text: 'Humidity', id: 'humidity' },
            { text: 'Wind Speed', id: 'wind' },
            { text: 'Precipitation', id: 'precipitation' },
          ]}
          variant="primary"
          ariaLabel="Chart type selection"
        />

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['temperature', 'humidity', 'wind', 'precipitation'].map((type) => (
            <Button
              key={type}
              variant={activeChart === type ? 'primary' : 'normal'}
              onClick={() => setActiveChart(type as ChartType)}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Button>
          ))}
        </div>

        <Grid gridDefinition={[{ colspan: 8 }, { colspan: 4 }]}>
          <SpaceBetween size="s">
            <Box variant="h3">{chartData.title}</Box>
            {renderChart()}
            <Box variant="small" textAlign="center" color="text-status-inactive">
              Hover over bars to see detailed values
            </Box>
          </SpaceBetween>

          <SpaceBetween size="s">
            <Box variant="h3">Statistics</Box>
            <Box padding="s" style={{ border: '1px solid #e1e5e9', borderRadius: '8px' }}>
              <SpaceBetween size="s">
                {getChartStats().map((stat, index) => (
                  <div key={index} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box variant="small">{stat.label}:</Box>
                    <Badge color={stat.color as any}>{stat.value}</Badge>
                  </div>
                ))}
              </SpaceBetween>
            </Box>
          </SpaceBetween>
        </Grid>
      </SpaceBetween>
    </Container>
  );
}
