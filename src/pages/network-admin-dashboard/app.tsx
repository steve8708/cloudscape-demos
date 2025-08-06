// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useState } from 'react';

import { CustomAppLayout } from '../commons/common-components';
import { NetworkAdminContent } from './components/content';
import { NetworkAdminBreadcrumbs } from './components/breadcrumbs';
import { NetworkAdminNavigation } from './components/navigation';
import { NetworkAdminNotifications } from './components/notifications';

export function App() {
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);

  return (
    <CustomAppLayout
      content={<NetworkAdminContent />}
      breadcrumbs={<NetworkAdminBreadcrumbs />}
      navigation={<NetworkAdminNavigation />}
      navigationOpen={navigationOpen}
      toolsHide={true}
      onNavigationChange={({ detail }) => setNavigationOpen(detail.open)}
      notifications={<NetworkAdminNotifications />}
    />
  );
}
