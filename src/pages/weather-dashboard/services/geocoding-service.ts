// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string; // State/Province
  admin2?: string; // County/District
  country_code: string;
  population?: number;
  timezone?: string;
}

export interface GeocodingResponse {
  results: GeocodingResult[];
  generationtime_ms: number;
}

class GeocodingService {
  private readonly baseUrl = 'https://geocoding-api.open-meteo.com/v1/search';

  async searchCities(query: string, count: number = 10): Promise<GeocodingResult[]> {
    if (!query.trim()) {
      return [];
    }

    const params = new URLSearchParams({
      name: query,
      count: count.toString(),
      language: 'en',
      format: 'json',
    });

    try {
      const response = await fetch(`${this.baseUrl}?${params}`);

      if (!response.ok) {
        throw new Error(`Geocoding API error: ${response.status}`);
      }

      const data: GeocodingResponse = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('Error searching cities:', error);
      throw error;
    }
  }

  formatCityName(result: GeocodingResult): string {
    let displayName = result.name;

    if (result.admin1) {
      displayName += `, ${result.admin1}`;
    }

    displayName += `, ${result.country}`;

    return displayName;
  }

  formatCityDescription(result: GeocodingResult): string {
    const parts = [];

    if (result.admin2 && result.admin2 !== result.admin1) {
      parts.push(result.admin2);
    }

    if (result.admin1) {
      parts.push(result.admin1);
    }

    parts.push(result.country);

    let description = parts.join(', ');

    if (result.population) {
      description += ` • Population: ${result.population.toLocaleString()}`;
    }

    return description;
  }
}

export const geocodingService = new GeocodingService();
