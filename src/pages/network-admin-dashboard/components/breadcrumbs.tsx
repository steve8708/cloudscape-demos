// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';
import BreadcrumbGroup from '@cloudscape-design/components/breadcrumb-group';

export function NetworkAdminBreadcrumbs() {
  return (
    <BreadcrumbGroup
      items={[
        { text: 'Service', href: '#/' },
        { text: 'Administrative Dashboard', href: '#/network-admin-dashboard' },
      ]}
      ariaLabel="Breadcrumb"
    />
  );
}
