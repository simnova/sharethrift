import type { Meta, StoryObj } from '@storybook/react';
import { RequestsTable } from '../components/requests-table';

// Mock data for Storybook
const MOCK_REQUEST_DATA = [
  {
    id: '1',
    title: 'City Bike',
    image: '/assets/item-images/bike.png',
    requestedBy: '@patrickg',
    requestedOn: '2025-12-23',
    reservationPeriod: '2020-11-08 - 2020-12-23',
    status: 'Pending',
  },
  {
    id: '2',
    title: 'Electric Guitar',
    image: '/assets/item-images/projector.png',
    requestedBy: '@musicfan',
    requestedOn: '2025-09-02',
    reservationPeriod: '2025-09-05 - 2025-09-10',
    status: 'Accepted',
  },
  {
    id: '3',
    title: 'Stand Mixer',
    image: '/assets/item-images/sewing-machine.png',
    requestedBy: '@bakerella',
    requestedOn: '2025-10-02',
    reservationPeriod: '2025-10-03 - 2025-10-07',
    status: 'Pending',
  },
  {
    id: '4',
    title: 'Bubble Chair',
    image: '/assets/item-images/bubble-chair.png',
    requestedBy: '@lounger',
    requestedOn: '2025-11-02',
    reservationPeriod: '2025-11-03 - 2025-11-10',
    status: 'Rejected',
  },
];

const meta: Meta<typeof RequestsTable> = {
  title: 'My Listings/Requests Table',
  component: RequestsTable,
  parameters: {
    layout: 'padded',
  },
  args: {
    data: MOCK_REQUEST_DATA,
    searchText: '',
    statusFilters: [],
    sorter: { field: null, order: null },
    currentPage: 1,
    pageSize: 6,
    total: MOCK_REQUEST_DATA.length,
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