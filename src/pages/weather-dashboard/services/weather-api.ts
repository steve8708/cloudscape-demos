// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

export interface WeatherLocation {
  latitude: number;
  longitude: number;
  name: string;
}

export interface CurrentWeather {
  time: string;
  temperature: number;
  weatherCode: number;
  windSpeed: number;
  windDirection: number;
  humidity: number;
  pressure: number;
  precipitation: number;
}

export interface HourlyWeather {
  time: string[];
  temperature: number[];
  weatherCode: number[];
  precipitation: number[];
  windSpeed: number[];
  humidity: number[];
}

export interface DailyWeather {
  time: string[];
  temperatureMax: number[];
  temperatureMin: number[];
  weatherCode: number[];
  precipitationSum: number[];
  windSpeedMax: number[];
  sunrise: string[];
  sunset: string[];
}

export interface WeatherData {
  current: CurrentWeather;
  hourly: HourlyWeather;
  daily: DailyWeather;
  location: WeatherLocation;
}

// Weather code descriptions
export const WEATHER_CODES: Record<number, { description: string; icon: string }> = {
  0: { description: 'Clear sky', icon: '☀️' },
  1: { description: 'Mainly clear', icon: '🌤️' },
  2: { description: 'Partly cloudy', icon: '⛅' },
  3: { description: 'Overcast', icon: '☁️' },
  45: { description: 'Fog', icon: '🌫️' },
  48: { description: 'Depositing rime fog', icon: '🌫️' },
  51: { description: 'Light drizzle', icon: '🌦️' },
  53: { description: 'Moderate drizzle', icon: '🌦️' },
  55: { description: 'Dense drizzle', icon: '🌧️' },
  56: { description: 'Light freezing drizzle', icon: '🌧️' },
  57: { description: 'Dense freezing drizzle', icon: '🌧️' },
  61: { description: 'Slight rain', icon: '🌧️' },
  63: { description: 'Moderate rain', icon: '🌧️' },
  65: { description: 'Heavy rain', icon: '🌧️' },
  66: { description: 'Light freezing rain', icon: '🌨️' },
  67: { description: 'Heavy freezing rain', icon: '🌨️' },
  71: { description: 'Slight snow fall', icon: '🌨️' },
  73: { description: 'Moderate snow fall', icon: '❄️' },
  75: { description: 'Heavy snow fall', icon: '❄️' },
  77: { description: 'Snow grains', icon: '❄️' },
  80: { description: 'Slight rain showers', icon: '🌦️' },
  81: { description: 'Moderate rain showers', icon: '🌧️' },
  82: { description: 'Violent rain showers', icon: '🌧️' },
  85: { description: 'Slight snow showers', icon: '🌨️' },
  86: { description: 'Heavy snow showers', icon: '❄️' },
  95: { description: 'Thunderstorm', icon: '⛈️' },
  96: { description: 'Thunderstorm with slight hail', icon: '⛈️' },
  99: { description: 'Thunderstorm with heavy hail', icon: '⛈️' },
};

// Default location (New York City)
export const DEFAULT_LOCATION: WeatherLocation = {
  latitude: 40.7128,
  longitude: -74.0060,
  name: 'New York City',
};

export class WeatherAPIService {
  private baseUrl = 'https://api.open-meteo.com/v1/forecast';

  async getCurrentWeather(location: WeatherLocation = DEFAULT_LOCATION): Promise<CurrentWeather> {
    const url = new URL(this.baseUrl);
    url.searchParams.set('latitude', location.latitude.toString());
    url.searchParams.set('longitude', location.longitude.toString());
    url.searchParams.set('current', 'temperature_2m,weather_code,wind_speed_10m,wind_direction_10m,relative_humidity_2m,surface_pressure,precipitation');
    url.searchParams.set('timezone', 'auto');

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      time: data.current.time,
      temperature: data.current.temperature_2m,
      weatherCode: data.current.weather_code,
      windSpeed: data.current.wind_speed_10m,
      windDirection: data.current.wind_direction_10m,
      humidity: data.current.relative_humidity_2m,
      pressure: data.current.surface_pressure,
      precipitation: data.current.precipitation,
    };
  }

  async getHourlyForecast(location: WeatherLocation = DEFAULT_LOCATION, hours: number = 24): Promise<HourlyWeather> {
    const url = new URL(this.baseUrl);
    url.searchParams.set('latitude', location.latitude.toString());
    url.searchParams.set('longitude', location.longitude.toString());
    url.searchParams.set('hourly', 'temperature_2m,weather_code,precipitation,wind_speed_10m,relative_humidity_2m');
    url.searchParams.set('timezone', 'auto');
    url.searchParams.set('forecast_hours', hours.toString());

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      time: data.hourly.time.slice(0, hours),
      temperature: data.hourly.temperature_2m.slice(0, hours),
      weatherCode: data.hourly.weather_code.slice(0, hours),
      precipitation: data.hourly.precipitation.slice(0, hours),
      windSpeed: data.hourly.wind_speed_10m.slice(0, hours),
      humidity: data.hourly.relative_humidity_2m.slice(0, hours),
    };
  }

  async getDailyForecast(location: WeatherLocation = DEFAULT_LOCATION, days: number = 7): Promise<DailyWeather> {
    const url = new URL(this.baseUrl);
    url.searchParams.set('latitude', location.latitude.toString());
    url.searchParams.set('longitude', location.longitude.toString());
    url.searchParams.set('daily', 'temperature_2m_max,temperature_2m_min,weather_code,precipitation_sum,wind_speed_10m_max,sunrise,sunset');
    url.searchParams.set('timezone', 'auto');
    url.searchParams.set('forecast_days', days.toString());

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      time: data.daily.time.slice(0, days),
      temperatureMax: data.daily.temperature_2m_max.slice(0, days),
      temperatureMin: data.daily.temperature_2m_min.slice(0, days),
      weatherCode: data.daily.weather_code.slice(0, days),
      precipitationSum: data.daily.precipitation_sum.slice(0, days),
      windSpeedMax: data.daily.wind_speed_10m_max.slice(0, days),
      sunrise: data.daily.sunrise.slice(0, days),
      sunset: data.daily.sunset.slice(0, days),
    };
  }

  async getCompleteWeatherData(location: WeatherLocation = DEFAULT_LOCATION): Promise<WeatherData> {
    const [current, hourly, daily] = await Promise.all([
      this.getCurrentWeather(location),
      this.getHourlyForecast(location, 24),
      this.getDailyForecast(location, 8),
    ]);

    return {
      current,
      hourly,
      daily,
      location,
    };
  }

  getWeatherDescription(weatherCode: number): { description: string; icon: string } {
    return WEATHER_CODES[weatherCode] || { description: 'Unknown', icon: '❓' };
  }
}

export const weatherAPI = new WeatherAPIService();
