import type { Meta, StoryObj } from '@storybook/react';
import { AllListingsTable } from '../components/all-listings-table';

// Mock data for Storybook
const MOCK_LISTING_DATA = [
  {
    id: '1',
    title: 'Cordless Drill',
    image: '/assets/item-images/projector.png',
    publishedAt: '2025-12-23',
    reservationPeriod: '2020-11-08 - 2020-12-23',
    status: 'Paused',
    pendingRequestsCount: 0,
  },
  {
    id: '2',
    title: 'Electric Guitar',
    image: '/assets/item-images/projector.png',
    publishedAt: '2025-08-30',
    reservationPeriod: '2025-09-01 - 2025-09-30',
    status: 'Active',
    pendingRequestsCount: 3,
  },
  {
    id: '3',
    title: 'Stand Mixer',
    image: '/assets/item-images/sewing-machine.png',
    publishedAt: '2025-09-28',
    reservationPeriod: '2025-10-01 - 2025-10-15',
    status: 'Reserved',
    pendingRequestsCount: 1,
  },
  {
    id: '4',
    title: 'Bubble Chair',
    image: '/assets/item-images/bubble-chair.png',
    publishedAt: '2025-10-30',
    reservationPeriod: '2025-11-01 - 2025-11-15',
    status: 'Draft',
    pendingRequestsCount: 0,
  },
];

const meta: Meta<typeof AllListingsTable> = {
  title: 'My Listings/All Listings Table',
  component: AllListingsTable,
  parameters: {
    layout: 'padded',
  },
  args: {
    data: MOCK_LISTING_DATA,
    searchText: '',
    statusFilters: [],
    sorter: { field: null, order: null },
    currentPage: 1,
    pageSize: 6,
    total: MOCK_LISTING_DATA.length,
    onSearch: (value: string) => console.log('Search:', value),
    onStatusFilter: (values: string[]) => console.log('Status filter:', values),
    onTableChange: (pagination, filters, sorter) => console.log('Table change:', { pagination, filters, sorter }),
    onPageChange: (page: number) => console.log('Page change:', page),
    onAction: (action: string, listingId: string) => console.log('Action:', action, 'Listing:', listingId),
    onViewAllRequests: (listingId: string) => console.log('View all requests:', listingId),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithFilters: Story = {
  args: {
    searchText: 'bike',
    statusFilters: ['Active', 'Paused'],
  },
};