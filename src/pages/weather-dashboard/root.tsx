// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import { createRoot } from 'react-dom/client';
import '@cloudscape-design/global-styles/index.css';
import WeatherDashboard from './index';
import { applyMode, applyDensity } from '@cloudscape-design/global-styles';

applyMode(localStorage.getItem('cloudscape-mode') as any);
applyDensity(localStorage.getItem('cloudscape-density') as any);

const App = () => <WeatherDashboard />;

createRoot(document.getElementById('app')!).render(<App />);
