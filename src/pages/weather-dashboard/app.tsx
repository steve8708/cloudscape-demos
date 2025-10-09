// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useRef, useState } from 'react';

import { AppLayoutProps } from '@cloudscape-design/components/app-layout';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Header from '@cloudscape-design/components/header';

import { Breadcrumbs, HelpPanelProvider } from '../commons';
import { CustomAppLayout } from '../commons/common-components';
import { WeatherContent } from './components/content';

import '@cloudscape-design/global-styles/dark-mode-utils.css';

const MainInfo = () => (
  <div>
    <h3>Weather Dashboard</h3>
    <p>
      Real-time weather data powered by <strong>Open-Meteo.com</strong>. This dashboard displays current weather
      conditions and forecasts for major cities worldwide.
    </p>
    <p>Weather data by Open-Meteo.com</p>
  </div>
);

export function App() {
  const [toolsOpen, setToolsOpen] = useState(false);
  const [toolsContent, setToolsContent] = useState<React.ReactNode>(() => <MainInfo />);
  const appLayout = useRef<AppLayoutProps.Ref>(null);

  const handleToolsContentChange = (content: React.ReactNode) => {
    setToolsOpen(true);
    setToolsContent(content);
    appLayout.current?.focusToolsClose();
  };

  return (
    <HelpPanelProvider value={handleToolsContentChange}>
      <CustomAppLayout
        ref={appLayout}
        content={
          <SpaceBetween size="m">
            <Header variant="h1" description="Real-time weather monitoring and forecasts">
              Weather Dashboard
            </Header>
            <WeatherContent />
          </SpaceBetween>
        }
        breadcrumbs={<Breadcrumbs items={[{ text: 'Weather Dashboard', href: '#/' }]} />}
        tools={toolsContent}
        toolsOpen={toolsOpen}
        onToolsChange={({ detail }) => setToolsOpen(detail.open)}
        navigationHide
      />
    </HelpPanelProvider>
  );
}
