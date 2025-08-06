// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';
import Flashbar from '@cloudscape-design/components/flashbar';

export function NetworkAdminNotifications() {
  return (
    <Flashbar
      items={[
        {
          type: 'warning',
          content: 'This is a warning message',
          dismissible: true,
          dismissLabel: 'Dismiss',
          statusIconAriaLabel: 'Warning',
          id: 'message_1',
        },
      ]}
    />
  );
}
