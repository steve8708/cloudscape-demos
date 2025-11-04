// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useEffect, useState } from 'react';
import { App } from './root';
import DataProvider from '../commons/data-provider';
import { Distribution } from '../../fake-server/types';

export default function TableEditableDemo() {
  const [distributions, setDistributions] = useState<Distribution[] | null>(null);
  useEffect(() => {
    new DataProvider().getData<Distribution>('distributions').then(setDistributions);
  }, []);
  if (!distributions) {
    return <div>Loading...</div>;
  }
  return <App distributions={distributions} />;
}
