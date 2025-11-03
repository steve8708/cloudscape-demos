// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

export interface WidgetConfig {
  header: React.JSXElementConstructor<Record<string, never>>;
  content: React.JSXElementConstructor<Record<string, never>>;
}
