// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useState } from 'react';
import Header from '@cloudscape-design/components/header';
import Button from '@cloudscape-design/components/button';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Grid from '@cloudscape-design/components/grid';
import Container from '@cloudscape-design/components/container';
import ContentLayout from '@cloudscape-design/components/content-layout';
import AreaChart from '@cloudscape-design/components/area-chart';
import BarChart from '@cloudscape-design/components/bar-chart';
import Table from '@cloudscape-design/components/table';
import Box from '@cloudscape-design/components/box';
import TextFilter from '@cloudscape-design/components/text-filter';
import Pagination from '@cloudscape-design/components/pagination';
import CollectionPreferences from '@cloudscape-design/components/collection-preferences';
import styles from '../styles.module.scss';

// Sample data for the charts
const networkTrafficData = [
  { x: 'x1', y: 42 },
  { x: 'x2', y: 35 },
  { x: 'x3', y: 38 },
  { x: 'x4', y: 45 },
  { x: 'x5', y: 40 },
  { x: 'x6', y: 52 },
  { x: 'x7', y: 48 },
  { x: 'x8', y: 44 },
  { x: 'x9', y: 50 },
  { x: 'x10', y: 46 },
  { x: 'x11', y: 42 },
  { x: 'x12', y: 38 },
];

const creditUsageData = [
  { x: 'x1', y: 183 },
  { x: 'x2', y: 257 },
  { x: 'x3', y: 213 },
  { x: 'x4', y: 122 },
  { x: 'x5', y: 210 },
];

// Sample device data
const deviceData = [
  {
    id: '1',
    deviceName: 'Router-001',
    ipAddress: '192.168.1.1',
    status: 'Online',
    type: 'Router',
    location: 'Building A',
    lastSeen: '2024-01-15 10:30:00',
    bandwidth: '1 Gbps',
  },
  {
    id: '2',
    deviceName: 'Switch-002',
    ipAddress: '192.168.1.2',
    status: 'Online',
    type: 'Switch',
    location: 'Building A',
    lastSeen: '2024-01-15 10:29:45',
    bandwidth: '100 Mbps',
  },
  {
    id: '3',
    deviceName: 'AP-003',
    ipAddress: '192.168.1.3',
    status: 'Offline',
    type: 'Access Point',
    location: 'Building B',
    lastSeen: '2024-01-15 09:15:22',
    bandwidth: '300 Mbps',
  },
  {
    id: '4',
    deviceName: 'Router-004',
    ipAddress: '192.168.1.4',
    status: 'Online',
    type: 'Router',
    location: 'Building B',
    lastSeen: '2024-01-15 10:28:12',
    bandwidth: '1 Gbps',
  },
  {
    id: '5',
    deviceName: 'Switch-005',
    ipAddress: '192.168.1.5',
    status: 'Warning',
    type: 'Switch',
    location: 'Building C',
    lastSeen: '2024-01-15 10:25:33',
    bandwidth: '100 Mbps',
  },
];

const columnDefinitions = [
  {
    id: 'deviceName',
    header: 'Device Name',
    cell: (item: any) => item.deviceName,
    sortingField: 'deviceName',
  },
  {
    id: 'ipAddress',
    header: 'IP Address',
    cell: (item: any) => item.ipAddress,
    sortingField: 'ipAddress',
  },
  {
    id: 'status',
    header: 'Status',
    cell: (item: any) => item.status,
    sortingField: 'status',
  },
  {
    id: 'type',
    header: 'Type',
    cell: (item: any) => item.type,
    sortingField: 'type',
  },
  {
    id: 'location',
    header: 'Location',
    cell: (item: any) => item.location,
    sortingField: 'location',
  },
  {
    id: 'lastSeen',
    header: 'Last Seen',
    cell: (item: any) => item.lastSeen,
    sortingField: 'lastSeen',
  },
  {
    id: 'bandwidth',
    header: 'Bandwidth',
    cell: (item: any) => item.bandwidth,
    sortingField: 'bandwidth',
  },
];

export function NetworkAdminContent() {
  const [selectedItems, setSelectedItems] = useState([]);
  const [filteringText, setFilteringText] = useState('');
  const [currentPageIndex, setCurrentPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortingColumn, setSortingColumn] = useState(columnDefinitions[0]);
  const [isDescending, setIsDescending] = useState(false);

  const filteredItems = deviceData.filter(
    item =>
      item.deviceName.toLowerCase().includes(filteringText.toLowerCase()) ||
      item.ipAddress.toLowerCase().includes(filteringText.toLowerCase()) ||
      item.type.toLowerCase().includes(filteringText.toLowerCase()) ||
      item.location.toLowerCase().includes(filteringText.toLowerCase()),
  );

  const sortedItems = [...filteredItems].sort((a, b) => {
    const aVal = a[sortingColumn.sortingField as keyof typeof a];
    const bVal = b[sortingColumn.sortingField as keyof typeof b];

    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return isDescending ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal);
    }
    return 0;
  });

  const paginatedItems = sortedItems.slice((currentPageIndex - 1) * pageSize, currentPageIndex * pageSize);

  return (
    <ContentLayout
      header={
        <Header
          variant="h1"
          description="Network Traffic, Credit Usage, and Your Devices"
          actions={
            <Button variant="primary" iconName="external" iconAlign="right">
              Refresh Data
            </Button>
          }
        >
          Network Administration Dashboard
        </Header>
      }
    >
      <SpaceBetween size="l">
        {/* Charts Section */}
        <Grid
          gridDefinition={[
            { colspan: { default: 12, xxs: 12, xs: 12, s: 12, m: 6, l: 6, xl: 6 } },
            { colspan: { default: 12, xxs: 12, xs: 12, s: 12, m: 6, l: 6, xl: 6 } },
          ]}
        >
          <Container header={<Header variant="h2">Network traffic</Header>}>
            <SpaceBetween size="m">
              <AreaChart
                series={[
                  {
                    title: 'Site 1',
                    type: 'area',
                    data: networkTrafficData.map(item => ({ x: item.x, y: item.y + 10 })),
                    color: '#688AE8',
                  },
                  {
                    title: 'Site 2',
                    type: 'area',
                    data: networkTrafficData,
                    color: '#C33D69',
                  },
                ]}
                xDomain={networkTrafficData.map(item => item.x)}
                yDomain={[0, 60]}
                i18nStrings={{
                  filterLabel: 'Filter displayed data',
                  filterPlaceholder: 'Filter data',
                  filterSelectedAriaLabel: 'selected',
                  legendAriaLabel: 'Legend',
                  chartAriaRoleDescription: 'area chart',
                  xTickFormatter: value => value,
                  yTickFormatter: value => `y${value}`,
                }}
                ariaLabel="Network traffic area chart"
                errorText="Error loading data."
                height={300}
                loadingText="Loading chart"
                recoveryText="Retry"
                xScaleType="categorical"
                xTitle="Day"
                yTitle=""
                hideLegend={true}
                hideFilter={true}
                empty={
                  <Box textAlign="center" color="inherit">
                    <b>No data available</b>
                    <Box variant="p" color="inherit">
                      There is no data available
                    </Box>
                  </Box>
                }
                noMatch={
                  <Box textAlign="center" color="inherit">
                    <b>No matching data</b>
                    <Box variant="p" color="inherit">
                      There is no matching data to display
                    </Box>
                  </Box>
                }
              />
              <div className={styles.chartLegend}>
                <div className={styles.legendItem}>
                  <div className={`${styles.legendColor} ${styles.areaLegend} ${styles.site1}`}></div>
                  <span className={styles.legendText}>Site 1</span>
                </div>
                <div className={styles.legendItem}>
                  <div className={`${styles.legendColor} ${styles.areaLegend} ${styles.site2}`}></div>
                  <span className={styles.legendText}>Site 2</span>
                </div>
                <div className={styles.legendItem}>
                  <div className={styles.thresholdLegend}>
                    <div className={styles.thresholdSegment}></div>
                    <div className={styles.thresholdSegment}></div>
                  </div>
                  <span className={styles.legendText}>Performance goal</span>
                </div>
              </div>
            </SpaceBetween>
          </Container>

          <Container header={<Header variant="h2">Credit Usage</Header>}>
            <SpaceBetween size="m">
              <BarChart
                series={[
                  {
                    title: 'Site 1',
                    type: 'bar',
                    data: creditUsageData,
                    color: '#688AE8',
                  },
                ]}
                xDomain={creditUsageData.map(item => item.x)}
                yDomain={[0, 300]}
                i18nStrings={{
                  filterLabel: 'Filter displayed data',
                  filterPlaceholder: 'Filter data',
                  filterSelectedAriaLabel: 'selected',
                  legendAriaLabel: 'Legend',
                  chartAriaRoleDescription: 'bar chart',
                  xTickFormatter: value => value,
                  yTickFormatter: value => `y${Math.floor(value / 50) + 1}`,
                }}
                ariaLabel="Credit usage bar chart"
                errorText="Error loading data."
                height={300}
                loadingText="Loading chart"
                recoveryText="Retry"
                xScaleType="categorical"
                xTitle="Day"
                yTitle=""
                hideLegend={true}
                hideFilter={true}
                empty={
                  <Box textAlign="center" color="inherit">
                    <b>No data available</b>
                    <Box variant="p" color="inherit">
                      There is no data available
                    </Box>
                  </Box>
                }
                noMatch={
                  <Box textAlign="center" color="inherit">
                    <b>No matching data</b>
                    <Box variant="p" color="inherit">
                      There is no matching data to display
                    </Box>
                  </Box>
                }
              />
              <div className={styles.chartLegend}>
                <div className={styles.legendItem}>
                  <div className={`${styles.legendColor} ${styles.barLegend}`}></div>
                  <span className={styles.legendText}>Site 1</span>
                </div>
                <div className={styles.legendItem}>
                  <div className={styles.thresholdLegend}>
                    <div className={styles.thresholdSegment}></div>
                    <div className={styles.thresholdSegment}></div>
                  </div>
                  <span className={styles.legendText}>Performance goal</span>
                </div>
              </div>
            </SpaceBetween>
          </Container>
        </Grid>

        {/* My Devices Section */}
        <div className={styles.devicesSection}>
          <SpaceBetween size="m">
            <Header
              variant="h1"
              description="Devices on your local network"
              actions={
                <Button variant="primary" iconName="external" iconAlign="right">
                  Add Device
                </Button>
              }
            >
              My Devices
            </Header>

            <Container>
              <Table
                columnDefinitions={columnDefinitions}
                items={paginatedItems}
                loadingText="Loading devices"
                selectedItems={selectedItems}
                onSelectionChange={({ detail }) => setSelectedItems(detail.selectedItems)}
                selectionType="multi"
                trackBy="id"
                empty={
                  <Box margin={{ vertical: 'xs' }} textAlign="center" color="inherit">
                    <SpaceBetween size="m">
                      <b>No devices</b>
                      <Button>Add Device</Button>
                    </SpaceBetween>
                  </Box>
                }
                filter={
                  <TextFilter
                    filteringText={filteringText}
                    filteringPlaceholder="Placeholder"
                    filteringAriaLabel="Filter devices"
                    onChange={({ detail }) => setFilteringText(detail.filteringText)}
                  />
                }
                pagination={
                  <Pagination
                    currentPageIndex={currentPageIndex}
                    onChange={({ detail }) => setCurrentPageIndex(detail.currentPageIndex)}
                    pagesCount={Math.ceil(filteredItems.length / pageSize)}
                    ariaLabels={{
                      nextPageLabel: 'Next page',
                      previousPageLabel: 'Previous page',
                      pageLabel: pageNumber => `Page ${pageNumber} of all pages`,
                    }}
                  />
                }
                preferences={
                  <CollectionPreferences
                    title="Preferences"
                    confirmLabel="Confirm"
                    cancelLabel="Cancel"
                    preferences={{
                      pageSize,
                      visibleContent: [
                        'deviceName',
                        'ipAddress',
                        'status',
                        'type',
                        'location',
                        'lastSeen',
                        'bandwidth',
                      ],
                    }}
                    pageSizePreference={{
                      title: 'Page size',
                      options: [
                        { value: 10, label: '10 devices' },
                        { value: 20, label: '20 devices' },
                        { value: 50, label: '50 devices' },
                      ],
                    }}
                    onConfirm={({ detail }) => {
                      setPageSize(detail.pageSize);
                    }}
                  />
                }
                sortingColumn={sortingColumn}
                sortingDescending={isDescending}
                onSortingChange={({ detail }) => {
                  setSortingColumn(detail.sortingColumn);
                  setIsDescending(detail.isDescending);
                }}
              />
            </Container>
          </SpaceBetween>
        </div>
      </SpaceBetween>
    </ContentLayout>
  );
}
