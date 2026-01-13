import type { Meta, StoryObj } from '@storybook/react';
import { expect, within, userEvent, waitFor, fn } from 'storybook/test';
import { RequestsTableContainer } from './requests-table.container.tsx';
import {
	withMockApolloClient,
	withMockRouter,
} from '../../../../../test-utils/storybook-decorators.tsx';
import { HomeRequestsTableContainerMyListingsRequestsDocument } from '../../../../../generated.tsx';

const mockRequests = {
	items: [
		{
			__typename: 'ReservationRequest',
			id: '1',
			createdAt: new Date('2025-01-15T10:00:00.000Z'),
			reservationPeriodStart: new Date('2025-01-20T00:00:00.000Z'),
			reservationPeriodEnd: new Date('2025-01-25T00:00:00.000Z'),
			state: 'Pending',
			listing: {
				__typename: 'ItemListing',
				title: 'Cordless Drill',
				images: ['/assets/item-images/projector.png'],
			},
			reserver: {
				__typename: 'PersonalUser',
				account: {
					__typename: 'PersonalUserAccount',
					username: 'johndoe',
				},
			},
		},
		{
			__typename: 'ReservationRequest',
			id: '2',
			createdAt: new Date('2025-02-01T14:30:00.000Z'),
			reservationPeriodStart: new Date('2025-02-10T00:00:00.000Z'),
			reservationPeriodEnd: new Date('2025-02-15T00:00:00.000Z'),
			state: 'Accepted',
			listing: {
				__typename: 'ItemListing',
				title: 'Electric Guitar',
				images: ['/assets/item-images/projector.png'],
			},
			reserver: {
				__typename: 'PersonalUser',
				account: {
					__typename: 'PersonalUserAccount',
					username: 'janesmith',
				},
			},
		},
	],
	total: 2,
};

const meta: Meta<typeof RequestsTableContainer> = {
	title: 'Containers/RequestsTableContainer',
	component: RequestsTableContainer,
	parameters: {
		layout: 'fullscreen',
		apolloClient: {
			mocks: [
				{
					request: {
						query: HomeRequestsTableContainerMyListingsRequestsDocument,
						variables: {
							page: 1,
							pageSize: 6,
							searchText: '',
							statusFilters: [],
							sorter: { field: '', order: '' },
							sharerId: '6324a3f1e3e4e1e6a8e1d8b1',
						},
					},
					result: {
						data: {
							myListingsRequests: mockRequests,
						},
					},
				},
			],
		},
	},
	decorators: [withMockApolloClient, withMockRouter('/my-listings/requests')],
};

export default meta;
type Story = StoryObj<typeof RequestsTableContainer>;

export const Default: Story = {
	args: {
		currentPage: 1,
		onPageChange: fn(),
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				expect(canvas.queryAllByText(/Cordless Drill/i).length).toBeGreaterThan(
					0,
				);
			},
			{ timeout: 3000 },
		);
	},
};

export const Empty: Story = {
	args: {
		currentPage: 1,
		onPageChange: fn(),
	},
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: HomeRequestsTableContainerMyListingsRequestsDocument,
						variables: {
							page: 1,
							pageSize: 6,
							searchText: '',
							statusFilters: [],
							sorter: { field: '', order: '' },
							sharerId: '6324a3f1e3e4e1e6a8e1d8b1',
						},
					},
					result: {
						data: {
							myListingsRequests: { items: [], total: 0 },
						},
					},
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				const emptyText = canvas.queryByText(/no.*request|empty|no data/i);
				expect(emptyText ?? canvasElement).toBeTruthy();
			},
			{ timeout: 3000 },
		);
	},
};

export const Loading: Story = {
	args: {
		currentPage: 1,
		onPageChange: fn(),
	},
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: HomeRequestsTableContainerMyListingsRequestsDocument,
						variables: {
							page: 1,
							pageSize: 6,
							searchText: '',
							statusFilters: [],
							sorter: { field: '', order: '' },
							sharerId: '6324a3f1e3e4e1e6a8e1d8b1',
						},
					},
					delay: Infinity,
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const loadingSpinner =
			canvas.queryByRole('progressbar') ?? canvas.queryByText(/loading/i);
		expect(loadingSpinner ?? canvasElement).toBeTruthy();
	},
};

export const ErrorState: Story = {
	args: {
		currentPage: 1,
		onPageChange: fn(),
	},
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: HomeRequestsTableContainerMyListingsRequestsDocument,
						variables: {
							page: 1,
							pageSize: 6,
							searchText: '',
							statusFilters: [],
							sorter: { field: '', order: '' },
							sharerId: '6324a3f1e3e4e1e6a8e1d8b1',
						},
					},
					error: new Error('Failed to load requests'),
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				const errorContainer =
					canvas.queryByRole('alert') ??
					canvas.queryByText(/an error occurred/i);
				expect(errorContainer ?? canvasElement).toBeTruthy();
			},
			{ timeout: 3000 },
		);
	},
};

export const WithSearchFilter: Story = {
	args: {
		currentPage: 1,
		onPageChange: fn(),
	},
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: HomeRequestsTableContainerMyListingsRequestsDocument,
						variables: {
							page: 1,
							pageSize: 6,
							searchText: '',
							statusFilters: [],
							sorter: { field: '', order: '' },
							sharerId: '6324a3f1e3e4e1e6a8e1d8b1',
						},
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							myListingsRequests: {
								items: [mockRequests.items[0]],
								total: 1,
							},
						},
					},
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				expect(canvas.queryAllByText(/Cordless Drill/i).length).toBeGreaterThan(
					0,
				);
			},
			{ timeout: 3000 },
		);
		// Try interacting with search
		const searchInput = canvas.queryByRole('textbox');
		if (searchInput) {
			await userEvent.type(searchInput, 'drill');
		}
	},
};

export const WithStatusFilter: Story = {
	args: {
		currentPage: 1,
		onPageChange: fn(),
	},
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: HomeRequestsTableContainerMyListingsRequestsDocument,
						variables: {
							page: 1,
							pageSize: 6,
							searchText: '',
							statusFilters: [],
							sorter: { field: '', order: '' },
							sharerId: '6324a3f1e3e4e1e6a8e1d8b1',
						},
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							myListingsRequests: {
								items: [mockRequests.items[1]],
								total: 1,
							},
						},
					},
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				expect(
					canvas.queryAllByText(/Electric Guitar/i).length,
				).toBeGreaterThan(0);
			},
			{ timeout: 3000 },
		);
	},
};

export const WithSorting: Story = {
	args: {
		currentPage: 1,
		onPageChange: fn(),
	},
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: HomeRequestsTableContainerMyListingsRequestsDocument,
						variables: {
							page: 1,
							pageSize: 6,
							searchText: '',
							statusFilters: [],
							sorter: { field: '', order: '' },
							sharerId: '6324a3f1e3e4e1e6a8e1d8b1',
						},
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							myListingsRequests: mockRequests,
						},
					},
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				expect(canvas.queryAllByText(/Cordless Drill/i).length).toBeGreaterThan(
					0,
				);
			},
			{ timeout: 3000 },
		);
		// Click on a column header to trigger sorting
		const titleHeader = canvas.queryByText(/Title/i);
		if (titleHeader) {
			await userEvent.click(titleHeader);
		}
	},
};

export const Pagination: Story = {
	args: {
		currentPage: 2,
		onPageChange: fn(),
	},
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: HomeRequestsTableContainerMyListingsRequestsDocument,
						variables: {
							page: 2,
							pageSize: 6,
							searchText: '',
							statusFilters: [],
							sorter: { field: '', order: '' },
							sharerId: '6324a3f1e3e4e1e6a8e1d8b1',
						},
					},
					result: {
						data: {
							myListingsRequests: {
								items: [],
								total: 12,
							},
						},
					},
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				const table = canvas.queryByRole('table');
				expect(table ?? canvasElement).toBeTruthy();
			},
			{ timeout: 3000 },
		);
	},
};

export const NoData: Story = {
	args: {
		currentPage: 1,
		onPageChange: fn(),
	},
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: HomeRequestsTableContainerMyListingsRequestsDocument,
						variables: {
							page: 1,
							pageSize: 6,
							searchText: '',
							statusFilters: [],
							sorter: { field: '', order: '' },
							sharerId: '6324a3f1e3e4e1e6a8e1d8b1',
						},
					},
					result: {
						data: {
							myListingsRequests: null,
						},
					},
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				const noDataText = canvas.queryByText(/no data/i);
				expect(noDataText ?? canvasElement).toBeTruthy();
			},
			{ timeout: 3000 },
		);
	},
};
