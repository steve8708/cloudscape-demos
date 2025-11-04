// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useState } from 'react';
import AppLayout from '@cloudscape-design/components/app-layout';
import ContentLayout from '@cloudscape-design/components/content-layout';
import Header from '@cloudscape-design/components/header';
import Grid from '@cloudscape-design/components/grid';
import Box from '@cloudscape-design/components/box';
import Cards from '@cloudscape-design/components/cards';
import Badge from '@cloudscape-design/components/badge';
import Button from '@cloudscape-design/components/button';
import SpaceBetween from '@cloudscape-design/components/space-between';
import TextFilter from '@cloudscape-design/components/text-filter';
import Pagination from '@cloudscape-design/components/pagination';
import Tabs from '@cloudscape-design/components/tabs';
import Container from '@cloudscape-design/components/container';
import Icon from '@cloudscape-design/components/icon';
import Flashbar from '@cloudscape-design/components/flashbar';
import Link from '@cloudscape-design/components/link';

// Dashboard and application definitions with category information
const dashboards = [
  {
    route: '/cards',
    title: 'Card View',
    description: 'Comprehensive card-based data visualization and management.',
    category: 'Components',
  },
  {
    route: '/chat',
    title: 'Chat Interface',
    description: 'Real-time chat and collaboration platform.',
    category: 'Applications',
  },
  {
    route: '/configurable-dashboard',
    title: 'Configurable Dashboard',
    description: 'Customizable dashboard with dynamic widget management.',
    category: 'Dashboards',
  },
  {
    route: '/dashboard',
    title: 'Service Dashboard',
    description: 'Operational service monitoring and metrics overview.',
    category: 'Dashboards',
  },
  {
    route: '/delete-one-click',
    title: 'Quick Delete',
    description: 'Streamlined resource deletion workflow.',
    category: 'Forms',
  },
  {
    route: '/delete-with-additional-confirmation',
    title: 'Secure Delete',
    description: 'Multi-step resource deletion with confirmation.',
    category: 'Forms',
  },
  {
    route: '/delete-with-simple-confirmation',
    title: 'Standard Delete',
    description: 'Resource deletion with confirmation dialog.',
    category: 'Forms',
  },
  {
    route: '/details',
    title: 'Resource Details',
    description: 'Comprehensive resource information and management.',
    category: 'Details',
  },
  {
    route: '/details-hub',
    title: 'Details Hub',
    description: 'Centralized resource details and insights.',
    category: 'Details',
  },
  {
    route: '/details-tabs',
    title: 'Tabbed Details',
    description: 'Multi-section resource details view.',
    category: 'Details',
  },
  {
    route: '/edit',
    title: 'Resource Editor',
    description: 'Advanced resource configuration and editing.',
    category: 'Forms',
  },
  {
    route: '/form',
    title: 'Resource Creation',
    description: 'Single-page resource creation workflow.',
    category: 'Forms',
  },
  {
    route: '/form-unsaved-changes',
    title: 'Change Protection',
    description: 'Unsaved changes detection and protection.',
    category: 'Forms',
  },
  {
    route: '/form-validation',
    title: 'Form Validation',
    description: 'Real-time form validation and error handling.',
    category: 'Forms',
  },
  {
    route: '/manage-tags',
    title: 'Tag Manager',
    description: 'Resource tagging and organization system.',
    category: 'Components',
  },
  {
    route: '/non-console',
    title: 'Application Navigation',
    description: 'Public-facing application navigation.',
    category: 'Navigation',
  },
  {
    route: '/onboarding',
    title: 'User Onboarding',
    description: 'Interactive user onboarding and tutorials.',
    category: 'Onboarding',
  },
  {
    route: '/product-detail-page',
    title: 'Product Details',
    description: 'Complete product information and specifications.',
    category: 'Applications',
  },
  {
    route: '/read-from-s3',
    title: 'S3 Data Reader',
    description: 'Amazon S3 data retrieval and visualization.',
    category: 'Integration',
  },
  {
    route: '/server-side-table',
    title: 'Server Table',
    description: 'Server-side data table with pagination.',
    category: 'Tables',
  },
  {
    route: '/server-side-table-property-filter',
    title: 'Advanced Table Filter',
    description: 'Server-side table with property-based filtering.',
    category: 'Tables',
  },
  {
    route: '/split-panel-comparison',
    title: 'Comparison View',
    description: 'Side-by-side resource comparison panel.',
    category: 'Panels',
  },
  {
    route: '/split-panel-multiple',
    title: 'Multi-Panel View',
    description: 'Multiple split panel layout.',
    category: 'Panels',
  },
  {
    route: '/table',
    title: 'Data Table',
    description: 'Advanced data table with sorting and filtering.',
    category: 'Tables',
  },
  {
    route: '/table-date-filter',
    title: 'Time-Series Table',
    description: 'Data table with date range filtering.',
    category: 'Tables',
  },
  {
    route: '/table-editable',
    title: 'Editable Table',
    description: 'Inline table editing and data management.',
    category: 'Tables',
  },
  {
    route: '/table-expandable',
    title: 'Expandable Table',
    description: 'Hierarchical data table with expandable rows.',
    category: 'Tables',
  },
  {
    route: '/table-property-filter',
    title: 'Property Filter Table',
    description: 'Advanced property-based table filtering.',
    category: 'Tables',
  },
  {
    route: '/table-saved-filters',
    title: 'Saved Filters Table',
    description: 'Table with saved filter configurations.',
    category: 'Tables',
  },
  {
    route: '/table-select-filter',
    title: 'Select Filter Table',
    description: 'Table with dropdown-based filtering.',
    category: 'Tables',
  },
  { route: '/wizard', title: 'Setup Wizard', description: 'Multi-step configuration wizard.', category: 'Forms' },
  {
    route: '/write-to-s3',
    title: 'S3 Data Writer',
    description: 'Amazon S3 data upload and storage.',
    category: 'Integration',
  },
];

// Get unique categories
const categories = [...new Set(dashboards.map(dashboard => dashboard.category))];

export default function Home() {
  const [filterText, setFilterText] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentPageIndex, setCurrentPageIndex] = useState(1);
  const itemsPerPage = 12;

  // Filter dashboards based on filter text and selected category
  const filteredDashboards = dashboards.filter(
    dashboard =>
      (dashboard.title.toLowerCase().includes(filterText.toLowerCase()) ||
        dashboard.description.toLowerCase().includes(filterText.toLowerCase())) &&
      (activeCategory === 'All' || dashboard.category === activeCategory),
  );

  // Paginate the filtered dashboards
  const paginatedDashboards = filteredDashboards.slice(
    (currentPageIndex - 1) * itemsPerPage,
    currentPageIndex * itemsPerPage,
  );

  return (
    <AppLayout
      navigationHide
      toolsHide
      content={
        <ContentLayout
          header={
            <SpaceBetween size="m">
              <Flashbar
                items={[
                  {
                    type: 'success',
                    content:
                      'All systems operational. Your infrastructure is running smoothly with 99.9% uptime this month.',
                    dismissible: true,
                    buttonText: 'View metrics',
                    onButtonClick: () => (window.location.href = '/dashboard'),
                  },
                ]}
              />

              <Container>
                <Grid
                  gridDefinition={[
                    { colspan: { default: 12, s: 7, m: 7, l: 8 } },
                    { colspan: { default: 12, s: 5, m: 5, l: 4 } },
                  ]}
                >
                  <SpaceBetween size="m">
                    <Header variant="h1" description="Production-grade cloud application patterns and interfaces">
                      Dashboard Hub
                    </Header>
                    <Box variant="p" color="text-body-secondary">
                      Access powerful, enterprise-ready dashboards and tools designed for modern cloud operations.
                      Monitor services, manage resources, and gain actionable insights across your infrastructure.
                    </Box>
                    <Button variant="primary" iconAlign="right" iconName="add-plus">
                      Create new dashboard
                    </Button>
                  </SpaceBetween>
                  <Box>
                    <img
                      src="https://cdn.builder.io/api/v1/image/assets%2Fc5b47d20f6a943e485717e5895739988%2F6756eeeef8ab4c40a5a532cd42c054cf"
                      alt="Analytics dashboard visualization"
                      style={{
                        width: '100%',
                        height: 'auto',
                        maxHeight: '220px',
                        objectFit: 'cover',
                        objectPosition: 'top',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      }}
                    />
                  </Box>
                </Grid>
              </Container>
            </SpaceBetween>
          }
        >
          <SpaceBetween size="l">
            <Container>
              <Box variant="h2">Application Catalog</Box>
              <Box variant="p" padding={{ bottom: 'm' }}>
                Explore {dashboards.length} production-ready applications and dashboards. Each solution is built with
                enterprise best practices for scalability, security, and user experience.
              </Box>

              <Grid gridDefinition={[{ colspan: { default: 12, xs: 12, s: 12, m: 8, l: 8, xl: 8 } }]}>
                <TextFilter
                  filteringText={filterText}
                  filteringPlaceholder="Search applications"
                  filteringAriaLabel="Filter applications"
                  countText={`${filteredDashboards.length} results`}
                  onChange={({ detail }) => {
                    setFilterText(detail.filteringText);
                    setCurrentPageIndex(1);
                  }}
                />
              </Grid>
            </Container>

            <Tabs
              tabs={[
                {
                  id: 'All',
                  label: 'All',
                  content: null,
                },
                ...categories.map(category => ({
                  id: category,
                  label: category,
                  content: null,
                })),
              ]}
              activeTabId={activeCategory}
              onChange={({ detail }) => {
                setActiveCategory(detail.activeTabId);
                setCurrentPageIndex(1);
              }}
            />

            <Cards
              ariaLabels={{
                itemSelectionLabel: (e, n) => `select ${n.title}`,
                selectionGroupLabel: 'Application selection',
              }}
              cardDefinition={{
                header: item => <Link href={item.route}>{item.title}</Link>,
                sections: [
                  {
                    id: 'description',
                    content: item => item.description,
                  },

                  {
                    id: 'actions',
                    content: item => (
                      <Button href={item.route} variant="primary">
                        Launch
                      </Button>
                    ),
                  },
                ],
              }}
              cardsPerRow={[
                { cards: 1, minWidth: 0 },
                { cards: 2, minWidth: 600 },
                { cards: 3, minWidth: 900 },
                { cards: 4, minWidth: 1200 },
              ]}
              items={paginatedDashboards}
              loadingText="Loading applications"
              trackBy="title"
              visibleSections={['description', 'type', 'actions']}
              empty={
                <Box textAlign="center" color="inherit" margin={{ top: 'xxl', bottom: 'xxl' }}>
                  <Box padding={{ bottom: 's' }} variant="p" color="inherit">
                    <Icon name="search" size="large" />
                  </Box>
                  <Box variant="h3" padding={{ bottom: 'xs' }}>
                    No applications match your search
                  </Box>
                  <Box variant="p">Try adjusting your filters or search criteria</Box>
                </Box>
              }
            />

            <Pagination
              currentPageIndex={currentPageIndex}
              onChange={({ detail }) => setCurrentPageIndex(detail.currentPageIndex)}
              pagesCount={Math.ceil(filteredDashboards.length / itemsPerPage)}
              ariaLabels={{
                nextPageLabel: 'Next page',
                previousPageLabel: 'Previous page',
                pageLabel: pageNumber => `Page ${pageNumber} of all pages`,
              }}
            />
          </SpaceBetween>
        </ContentLayout>
      }
    />
  );
}
