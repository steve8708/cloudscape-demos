// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useRef, useState } from 'react';

import { AppLayoutProps } from '@cloudscape-design/components/app-layout';
import Button from '@cloudscape-design/components/button';
import SpaceBetween from '@cloudscape-design/components/space-between';

import { Breadcrumbs, HelpPanelProvider, Notifications } from '../commons';
import { CustomAppLayout } from '../commons/common-components';
import { Content } from './components/content';
import { WeatherDashboardHeader, WeatherDashboardMainInfo } from './components/header';
import { WeatherDashboardSideNavigation } from './components/side-navigation';
import { TemperatureUnitProvider } from './context/temperature-unit-context';

import '@cloudscape-design/global-styles/dark-mode-utils.css';

export function App() {
  const [toolsOpen, setToolsOpen] = useState(false);
  const [toolsContent, setToolsContent] = useState<React.ReactNode>(() => <WeatherDashboardMainInfo />);
  const appLayout = useRef<AppLayoutProps.Ref>(null);

  const handleToolsContentChange = (content: React.ReactNode) => {
    setToolsOpen(true);
    setToolsContent(content);
    appLayout.current?.focusToolsClose();
  };

  return (
    <TemperatureUnitProvider>
      <HelpPanelProvider value={handleToolsContentChange}>
        <CustomAppLayout
          ref={appLayout}
          content={
            <SpaceBetween size="m">
              <WeatherDashboardHeader actions={<Button variant="primary">Set Location</Button>} />
              <Content />
            </SpaceBetween>
          }
          breadcrumbs={<Breadcrumbs items={[{ text: 'Weather Dashboard', href: '#/weather-dashboard' }]} />}
          navigation={<WeatherDashboardSideNavigation />}
          tools={toolsContent}
          toolsOpen={toolsOpen}
          onToolsChange={({ detail }) => setToolsOpen(detail.open)}
          notifications={<Notifications />}
        />
      </HelpPanelProvider>
    </TemperatureUnitProvider>
  );
}
