// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { App } from './app';

export default function WeatherDashboardRoot() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
