import type { Meta, StoryObj } from '@storybook/react';
import { AllListingsTable } from '../components/all-listings-table';

const MOCK_LISTINGS = [
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
];

const meta: Meta<typeof AllListingsTable> = {
	title: 'My Listings/All Listings Table',
	component: AllListingsTable,
	args: {
		data: MOCK_LISTINGS,
		searchText: '',
		statusFilters: [],
		sorter: { field: null, order: null },
		currentPage: 1,
		pageSize: 6,
		total: MOCK_LISTINGS.length,
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