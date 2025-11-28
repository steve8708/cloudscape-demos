// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useRef, useState } from 'react';

import { AppLayoutProps } from '@cloudscape-design/components/app-layout';
import Button from '@cloudscape-design/components/button';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Input from '@cloudscape-design/components/input';
import FormField from '@cloudscape-design/components/form-field';

import { Breadcrumbs, HelpPanelProvider, Notifications } from '../commons';
import { CustomAppLayout } from '../commons/common-components';
import { WeatherContent } from './components/weather-content';
import { WeatherHeader, WeatherHelpInfo } from './components/weather-header';

import '@cloudscape-design/global-styles/dark-mode-utils.css';

export function App() {
  const [toolsOpen, setToolsOpen] = useState(false);
  const [toolsContent, setToolsContent] = useState<React.ReactNode>(() => <WeatherHelpInfo />);
  const [latitude, setLatitude] = useState('52.52');
  const [longitude, setLongitude] = useState('13.41');
  const [location, setLocation] = useState('Berlin');
  const appLayout = useRef<AppLayoutProps.Ref>(null);

  const handleToolsContentChange = (content: React.ReactNode) => {
    setToolsOpen(true);
    setToolsContent(content);
    appLayout.current?.focusToolsClose();
  };

  const locationActions = (
    <SpaceBetween direction="horizontal" size="s">
      <FormField label="Location">
        <Input value={location} onChange={({ detail }) => setLocation(detail.value)} placeholder="Enter city name" />
      </FormField>
      <FormField label="Latitude">
        <Input value={latitude} onChange={({ detail }) => setLatitude(detail.value)} placeholder="52.52" />
      </FormField>
      <FormField label="Longitude">
        <Input value={longitude} onChange={({ detail }) => setLongitude(detail.value)} placeholder="13.41" />
      </FormField>
      <Button variant="primary">Update location</Button>
    </SpaceBetween>
  );

  return (
    <HelpPanelProvider value={handleToolsContentChange}>
      <CustomAppLayout
        ref={appLayout}
        content={
          <SpaceBetween size="m">
            <WeatherHeader actions={locationActions} location={location} />
            <WeatherContent latitude={parseFloat(latitude)} longitude={parseFloat(longitude)} />
          </SpaceBetween>
        }
        breadcrumbs={<Breadcrumbs items={[{ text: 'Weather Dashboard', href: '#/' }]} />}
        tools={toolsContent}
        toolsOpen={toolsOpen}
        onToolsChange={({ detail }) => setToolsOpen(detail.open)}
        notifications={<Notifications />}
        navigationHide
      />
    </HelpPanelProvider>
  );
}
