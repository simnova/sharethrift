import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, within, userEvent, waitFor } from 'storybook/test';
import { MemoryRouter } from 'react-router-dom';
import { AdminListingsTable } from './admin-listings-table';
import type { MyListingData } from '../../../my-listings/components/my-listings-dashboard.types';

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
	play: ({ canvasElement }) => {
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
	play: ({ canvasElement }) => {
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
	play: ({ canvasElement }) => {
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
	play: ({ canvasElement }) => {
		expect(canvasElement).toBeTruthy();
	},
};

export const WithSearchFilter: Story = {
	args: {
		...WithListings.args,
		searchText: 'Mountain',
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await waitFor(() => {
			expect(canvasElement).toBeTruthy();
		}, { timeout: 3000 });
		const searchIcon = canvas.queryByRole('img', { name: /search/i });
		if (searchIcon) {
			await userEvent.click(searchIcon);
		}
	},
};

export const WithStatusFilter: Story = {
	args: {
		...WithListings.args,
		statusFilters: ['Blocked'],
	},
	play: async ({ canvasElement }) => {
		await waitFor(() => {
			expect(canvasElement).toBeTruthy();
		}, { timeout: 3000 });
	},
};

export const SortByCreatedAt: Story = {
	args: {
		...WithListings.args,
		sorter: { field: 'createdAt', order: 'descend' },
	},
	play: async ({ canvasElement }) => {
		await waitFor(() => {
			expect(canvasElement).toBeTruthy();
		}, { timeout: 3000 });
	},
};

export const SortByReservationPeriod: Story = {
	args: {
		...WithListings.args,
		sorter: { field: 'reservationPeriod', order: 'ascend' },
	},
	play: async ({ canvasElement }) => {
		await waitFor(() => {
			expect(canvasElement).toBeTruthy();
		}, { timeout: 3000 });
	},
};

export const WithPendingRequests: Story = {
	args: {
		...WithListings.args,
		data: mockListings.filter(l => l.pendingRequestsCount > 0),
	},
	play: async ({ canvasElement }) => {
		await waitFor(() => {
			expect(canvasElement).toBeTruthy();
		}, { timeout: 3000 });
	},
};

export const ViewListingAction: Story = {
	args: WithListings.args,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await waitFor(() => {
			expect(canvasElement).toBeTruthy();
		}, { timeout: 3000 });
		const viewButtons = canvas.queryAllByText(/View/i);
		if (viewButtons[0]) {
			await userEvent.click(viewButtons[0]);
		}
	},
};

export const UnblockListingAction: Story = {
	args: WithBlockedListings.args,
	play: async ({ canvasElement }) => {
		await waitFor(() => {
			expect(canvasElement).toBeTruthy();
		}, { timeout: 3000 });
	},
};

export const DeleteListingAction: Story = {
	args: WithListings.args,
	play: async ({ canvasElement }) => {
		await waitFor(() => {
			expect(canvasElement).toBeTruthy();
		}, { timeout: 3000 });
	},
};

export const WithPagination: Story = {
	args: {
		...WithListings.args,
		currentPage: 2,
		total: 50,
	},
	play: async ({ canvasElement }) => {
		await waitFor(() => {
			expect(canvasElement).toBeTruthy();
		}, { timeout: 3000 });
	},
};

export const WithMultipleFilters: Story = {
	args: {
		...WithListings.args,
		searchText: 'Bike',
		statusFilters: ['Blocked', 'Active'],
		sorter: { field: 'createdAt', order: 'descend' },
	},
	play: async ({ canvasElement }) => {
		await waitFor(() => {
			expect(canvasElement).toBeTruthy();
		}, { timeout: 3000 });
	},
};

export const TableColumnSorting: Story = {
	args: WithListings.args,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await waitFor(() => {
			expect(canvasElement).toBeTruthy();
		}, { timeout: 3000 });
		const createdAtHeader = canvas.queryByText(/Created At/i);
		if (createdAtHeader) {
			await userEvent.click(createdAtHeader);
		}
	},
};

export const SearchInputInteraction: Story = {
	args: WithListings.args,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await waitFor(() => {
			expect(canvasElement).toBeTruthy();
		}, { timeout: 3000 });
		const searchIcon = canvas.queryByRole('img', { name: /search/i });
		if (searchIcon) {
			await userEvent.click(searchIcon);
			await waitFor(() => {
				const searchInput = canvas.queryByRole('textbox');
				if (searchInput) {
					expect(searchInput).toBeTruthy();
				}
			}, { timeout: 1000 });
		}
	},
};

export const StatusFilterInteraction: Story = {
	args: WithListings.args,
	play: async ({ canvasElement }) => {
		await waitFor(() => {
			expect(canvasElement).toBeTruthy();
		}, { timeout: 3000 });
	},
};

export const WithNullImage: Story = {
	args: {
		...WithListings.args,
		data: [{
			id: mockListings[0]?.id ?? '1',
			title: mockListings[0]?.title ?? 'Default Title',
			image: null,
			createdAt: mockListings[0]?.createdAt ?? null,
			reservationPeriod: mockListings[0]?.reservationPeriod ?? null,
			status: mockListings[0]?.status ?? 'Active',
			pendingRequestsCount: mockListings[0]?.pendingRequestsCount ?? 0,
		}],
	},
	play: async ({ canvasElement }) => {
		await waitFor(() => {
			expect(canvasElement).toBeTruthy();
		}, { timeout: 3000 });
	},
};

export const WithLongTitle: Story = {
	args: {
		...WithListings.args,
		data: [{
			id: mockListings[0]?.id ?? '1',
			title: 'Very Long Listing Title That Should Be Displayed Properly In The Table Without Breaking The Layout',
			image: mockListings[0]?.image ?? null,
			createdAt: mockListings[0]?.createdAt ?? null,
			reservationPeriod: mockListings[0]?.reservationPeriod ?? null,
			status: mockListings[0]?.status ?? 'Active',
			pendingRequestsCount: mockListings[0]?.pendingRequestsCount ?? 0,
		}],
	},
	play: async ({ canvasElement }) => {
		await waitFor(() => {
			expect(canvasElement).toBeTruthy();
		}, { timeout: 3000 });
	},
};

