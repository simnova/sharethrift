import type { Meta, StoryObj } from '@storybook/react';
import { RequestsTable } from './requests-table';
import { MOCK_LISTING_REQUESTS } from '../mock-data';

const meta: Meta<typeof RequestsTable> = {
  title: 'My Listings/Requests Table',
  component: RequestsTable,
  parameters: {
    layout: 'padded',
  },
  args: {
    data: MOCK_LISTING_REQUESTS.slice(0, 6),
    searchText: '',
    statusFilters: [],
    sorter: { field: null, order: null },
    currentPage: 1,
    pageSize: 6,
    total: MOCK_LISTING_REQUESTS.length,
    onSearch: (value: string) => console.log('Search:', value),
    onStatusFilter: (values: string[]) => console.log('Status filter:', values),
    onTableChange: (pagination, filters, sorter) => console.log('Table change:', { pagination, filters, sorter }),
    onPageChange: (page: number) => console.log('Page change:', page),
    onAction: (action: string, requestId: string) => console.log('Action:', action, 'Request:', requestId),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithFilters: Story = {
  args: {
    searchText: 'tent',
    statusFilters: ['Pending', 'Accepted'],
  },
};