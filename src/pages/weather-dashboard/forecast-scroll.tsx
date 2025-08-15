// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Badge from '@cloudscape-design/components/badge';
import { WeatherData, formatTemperature, weatherCodes, TemperatureUnit } from './weather-api';
import './forecast-scroll.scss';

interface ForecastScrollProps {
  weatherData: WeatherData | null;
  temperatureUnit: TemperatureUnit;
}

export default function ForecastScroll({ weatherData, temperatureUnit }: ForecastScrollProps) {
  if (!weatherData || !weatherData.daily) {
    return null;
  }

  const dailyData = weatherData.daily.time.map((time, index) => {
    const date = new Date(time);
    const isToday = date.toDateString() === new Date().toDateString();
    const weatherCode = weatherData.daily.weather_code[index];
    const weatherInfo = weatherCodes[weatherCode];

    return {
      date,
      isToday,
      dayName: isToday ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' }),
      dayMonth: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      maxTemp: weatherData.daily.temperature_2m_max[index],
      minTemp: weatherData.daily.temperature_2m_min[index],
      precipitation: weatherData.daily.precipitation_sum[index],
      windSpeed: weatherData.daily.wind_speed_10m_max[index],
      weatherIcon: weatherInfo?.icon || '🌤️',
      weatherDescription: weatherInfo?.description || 'Unknown',
    };
  });

  return (
    <Container header={<Header variant="h2">7-Day Forecast</Header>}>
      <div className="forecast-scroll-container">
        <div className="forecast-scroll">
          {dailyData.map((day, index) => (
            <div key={index} className={`forecast-card ${day.isToday ? 'forecast-card-today' : ''}`}>
              <SpaceBetween size="xs">
                <Box textAlign="center">
                  <Box variant="small" color={day.isToday ? 'text-status-info' : 'text-body-secondary'}>
                    {day.dayName}
                  </Box>
                  <Box variant="small" color="text-body-secondary">
                    {day.dayMonth}
                  </Box>
                </Box>

                <Box textAlign="center" fontSize="display-l">
                  {day.weatherIcon}
                </Box>

                <Box textAlign="center">
                  <Box variant="small" color="text-body-secondary">
                    {day.weatherDescription}
                  </Box>
                </Box>

                <SpaceBetween size="xxs">
                  <Box textAlign="center">
                    <Box variant="small" fontWeight="bold">
                      {formatTemperature(day.maxTemp, temperatureUnit)}
                    </Box>
                  </Box>
                  <Box textAlign="center">
                    <Box variant="small" color="text-body-secondary">
                      {formatTemperature(day.minTemp, temperatureUnit)}
                    </Box>
                  </Box>
                </SpaceBetween>

                {day.precipitation > 0 && (
                  <Box textAlign="center">
                    <Badge color="blue">
                      {day.precipitation.toFixed(1)}mm
                    </Badge>
                  </Box>
                )}

                <Box textAlign="center">
                  <Box variant="small" color="text-body-secondary">
                    {Math.round(day.windSpeed)} km/h
                  </Box>
                </Box>
              </SpaceBetween>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}
