import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn } from 'storybook/test';
import { MemoryRouter } from 'react-router-dom';
import { AdminListingsTable } from './admin-listings-table';
import type { MyListingData } from '../../../../my-listings/components/my-listings-dashboard.types';

const mockListings: MyListingData[] = [
	{
		id: '1',
		title: 'Camping Tent',
		image: 'https://via.placeholder.com/150',
		createdAt: '2024-01-15',
		reservationPeriod: '2024-06-01 - 2024-08-31',
		status: 'Active',
		pendingRequestsCount: 2,
	},
	{
		id: '2',
		title: 'Mountain Bike',
		image: 'https://via.placeholder.com/150',
		createdAt: '2024-02-20',
		reservationPeriod: '2024-06-01 - 2024-12-31',
		status: 'Blocked',
		pendingRequestsCount: 0,
	},
	{
		id: '3',
		title: 'Kayak',
		image: 'https://via.placeholder.com/150',
		createdAt: '2024-03-10',
		reservationPeriod: '2024-07-01 - 2024-09-30',
		status: 'Blocked',
		pendingRequestsCount: 1,
	},
];

const meta: Meta<typeof AdminListingsTable> = {
	title: 'Components/AdminListingsTable',
	component: AdminListingsTable,
	parameters: {
		layout: 'fullscreen',
	},
	decorators: [
		(Story) => (
			<MemoryRouter>
				<Story />
			</MemoryRouter>
		),
	],
};

export default meta;
type Story = StoryObj<typeof AdminListingsTable>;

export const WithListings: Story = {
	args: {
		data: mockListings,
		searchText: '',
		statusFilters: [],
		sorter: { field: null, order: null },
		currentPage: 1,
		pageSize: 10,
		total: 3,
		loading: false,
		onSearch: fn(),
		onStatusFilter: fn(),
		onTableChange: fn(),
		onPageChange: fn(),
		onAction: fn(),
	},
	play: async ({ canvasElement }) => {
		expect(canvasElement).toBeTruthy();
	},
};

export const LoadingState: Story = {
	args: {
		data: [],
		searchText: '',
		statusFilters: [],
		sorter: { field: null, order: null },
		currentPage: 1,
		pageSize: 10,
		total: 0,
		loading: true,
		onSearch: fn(),
		onStatusFilter: fn(),
		onTableChange: fn(),
		onPageChange: fn(),
		onAction: fn(),
	},
	play: async ({ canvasElement }) => {
		expect(canvasElement).toBeTruthy();
	},
};

export const WithBlockedListings: Story = {
	args: {
		data: mockListings.filter((l) => l.status === 'Blocked'),
		searchText: '',
		statusFilters: ['Blocked'],
		sorter: { field: null, order: null },
		currentPage: 1,
		pageSize: 10,
		total: 2,
		loading: false,
		onSearch: fn(),
		onStatusFilter: fn(),
		onTableChange: fn(),
		onPageChange: fn(),
		onAction: fn(),
	},
	play: async ({ canvasElement }) => {
		expect(canvasElement).toBeTruthy();
	},
};

export const EmptyState: Story = {
	args: {
		data: [],
		searchText: '',
		statusFilters: [],
		sorter: { field: null, order: null },
		currentPage: 1,
		pageSize: 10,
		total: 0,
		loading: false,
		onSearch: fn(),
		onStatusFilter: fn(),
		onTableChange: fn(),
		onPageChange: fn(),
		onAction: fn(),
	},
	play: async ({ canvasElement }) => {
		expect(canvasElement).toBeTruthy();
	},
};
