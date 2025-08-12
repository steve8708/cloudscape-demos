// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Tabs from '@cloudscape-design/components/tabs';

interface HourlyForecastProps {
  hourly: {
    time: string[];
    temperature_2m: number[];
    precipitation_probability: number[];
    precipitation: number[];
    wind_speed_10m: number[];
  };
}

const formatTime = (timeString: string): string => {
  const date = new Date(timeString);
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });
};

const formatDate = (timeString: string): string => {
  const date = new Date(timeString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });
};

function SimpleChart({
  data,
  label,
  unit,
  color = '#0073bb',
  maxValue,
  times
}: {
  data: number[];
  label: string;
  unit: string;
  color?: string;
  maxValue?: number;
  times: string[];
}) {
  const next24Hours = data.slice(0, 24);
  const max = maxValue || Math.max(...next24Hours);
  const min = Math.min(...next24Hours);
  const range = max - min || 1;

  return (
    <div style={{ position: 'relative', height: '200px', width: '100%' }}>
      <Box variant="small" color="text-status-inactive" padding={{ bottom: 's' }}>
        {label}
      </Box>
      <div style={{ 
        display: 'flex', 
        alignItems: 'end', 
        height: '150px', 
        gap: '2px',
        marginBottom: '20px'
      }}>
        {next24Hours.map((value, index) => {
          const height = ((value - min) / range) * 100;
          return (
            <div
              key={index}
              style={{
                flex: 1,
                height: `${Math.max(height, 2)}%`,
                backgroundColor: color,
                opacity: 0.8,
                borderRadius: '2px 2px 0 0',
                position: 'relative',
                minHeight: '2px'
              }}
              title={`${Math.round(value)}${unit}`}
            >
              {index % 4 === 0 && (
                <Box 
                  variant="small" 
                  style={{ 
                    position: 'absolute', 
                    top: '-15px', 
                    left: '50%', 
                    transform: 'translateX(-50%)',
                    whiteSpace: 'nowrap',
                    fontSize: '10px'
                  }}
                >
                  {Math.round(value)}{unit}
                </Box>
              )}
            </div>
          );
        })}
      </div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        fontSize: '10px'
      }}>
        {next24Hours.map((_, index) => (
          index % 6 === 0 ? (
            <Box key={index} variant="small" color="text-status-inactive">
              {formatTime(times[index])}
            </Box>
          ) : null
        ))}
      </div>
    </div>
  );
}

export function HourlyForecastChart({ hourly }: HourlyForecastProps) {
  const temperatureTab = (
    <SpaceBetween size="m">
      <SimpleChart
        data={hourly.temperature_2m}
        label="Temperature (°C)"
        unit="°C"
        color="#e74c3c"
        times={hourly.time}
      />
    </SpaceBetween>
  );

  const precipitationTab = (
    <SpaceBetween size="m">
      <SimpleChart
        data={hourly.precipitation_probability}
        label="Precipitation Probability (%)"
        unit="%"
        color="#3498db"
        maxValue={100}
        times={hourly.time}
      />
      <SimpleChart
        data={hourly.precipitation}
        label="Precipitation (mm)"
        unit="mm"
        color="#2ecc71"
        times={hourly.time}
      />
    </SpaceBetween>
  );

  const windTab = (
    <SpaceBetween size="m">
      <SimpleChart
        data={hourly.wind_speed_10m}
        label="Wind Speed (km/h)"
        unit="km/h"
        color="#9b59b6"
        times={hourly.time}
      />
    </SpaceBetween>
  );

  return (
    <Tabs
      tabs={[
        {
          id: 'temperature',
          label: 'Temperature',
          content: temperatureTab
        },
        {
          id: 'precipitation',
          label: 'Precipitation',
          content: precipitationTab
        },
        {
          id: 'wind',
          label: 'Wind',
          content: windTab
        }
      ]}
    />
  );
}
