// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type TemperatureUnit = 'celsius' | 'fahrenheit';

interface TemperatureUnitContextType {
  unit: TemperatureUnit;
  setUnit: (unit: TemperatureUnit) => void;
  convertTemperature: (celsius: number) => number;
  getUnitSymbol: () => string;
}

const TemperatureUnitContext = createContext<TemperatureUnitContextType | undefined>(undefined);

export function useTemperatureUnit(): TemperatureUnitContextType {
  const context = useContext(TemperatureUnitContext);
  if (!context) {
    throw new Error('useTemperatureUnit must be used within a TemperatureUnitProvider');
  }
  return context;
}

interface TemperatureUnitProviderProps {
  children: ReactNode;
}

export function TemperatureUnitProvider({ children }: TemperatureUnitProviderProps) {
  const [unit, setUnit] = useState<TemperatureUnit>('celsius');

  const convertTemperature = (celsius: number): number => {
    if (unit === 'fahrenheit') {
      return (celsius * 9) / 5 + 32;
    }
    return celsius;
  };

  const getUnitSymbol = (): string => {
    return unit === 'celsius' ? '°C' : '°F';
  };

  const value: TemperatureUnitContextType = {
    unit,
    setUnit,
    convertTemperature,
    getUnitSymbol,
  };

  return <TemperatureUnitContext.Provider value={value}>{children}</TemperatureUnitContext.Provider>;
}
