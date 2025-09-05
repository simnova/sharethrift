import type { Meta, StoryObj } from '@storybook/react';
import { AllListingsTable } from './all-listings-table';
import { MOCK_MY_LISTINGS } from '../mock-data';

const meta: Meta<typeof AllListingsTable> = {
  title: 'My Listings/All Listings Table',
  component: AllListingsTable,
  parameters: {
    layout: 'padded',
  },
  args: {
    data: MOCK_MY_LISTINGS.slice(0, 6),
    searchText: '',
    statusFilters: [],
    sorter: { field: null, order: null },
    currentPage: 1,
    pageSize: 6,
    total: MOCK_MY_LISTINGS.length,
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