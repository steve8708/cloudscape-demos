# Network Administration Dashboard

This dashboard provides a comprehensive view of network administration including:

## Features

- **Network Traffic Visualization**: Real-time area chart showing traffic patterns across multiple sites
- **Credit Usage Monitoring**: Bar chart displaying credit consumption over time
- **Device Management**: Interactive table for managing network devices with:
  - Device name, IP address, and status monitoring
  - Location and bandwidth tracking
  - Last seen timestamps
  - Multi-select capabilities for batch operations

## Design

The dashboard follows the Cloudscape Design System patterns and matches the provided Figma design, featuring:

- Responsive layout that works on all screen sizes
- Custom chart legends matching the design specifications
- Warning notification banner
- Consistent navigation and breadcrumbs
- Proper spacing and typography

## Usage

Navigate to `/network-admin-dashboard` to view the dashboard. The interface includes:

1. Search functionality for filtering devices
2. Pagination controls for large device lists
3. Sortable columns in the device table
4. Interactive charts with performance indicators
5. Action buttons for adding new devices and refreshing data

## Components

- `app.tsx` - Main application wrapper
- `components/content.tsx` - Main dashboard content with charts and table
- `components/breadcrumbs.tsx` - Navigation breadcrumbs
- `components/navigation.tsx` - Side navigation menu
- `components/notifications.tsx` - Warning banner
- `styles.module.scss` - Custom styling to match Figma design
