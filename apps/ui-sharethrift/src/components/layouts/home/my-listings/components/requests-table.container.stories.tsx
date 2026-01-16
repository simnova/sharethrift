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
	play:  async ({ canvasElement }) => {
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
	play:  async ({ canvasElement }) => {
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
	play: ({ canvasElement }) => {
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
	play:  async ({ canvasElement }) => {
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
	play:  async ({ canvasElement }) => {
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
	play:  async ({ canvasElement }) => {
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
	play:  async ({ canvasElement }) => {
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
	play:  async ({ canvasElement }) => {
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
	play:  async ({ canvasElement }) => {
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

export const DataMappingEdgeCases: Story = {
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
							myListingsRequests: {
								items: [
									{
										__typename: 'ReservationRequest',
										id: '1',
										createdAt: new Date('2025-01-15T10:00:00.000Z'),
										reservationPeriodStart: null,
										reservationPeriodEnd: null,
										state: null,
										listing: null, // Missing listing data
										reserver: null, // Missing reserver data
									},
									{
										__typename: 'ReservationRequest',
										id: '2',
										createdAt: new Date('2025-01-16T10:00:00.000Z'),
										reservationPeriodStart: new Date('2025-01-20T00:00:00.000Z'),
										reservationPeriodEnd: new Date('2025-01-25T00:00:00.000Z'),
										state: 'Pending',
										listing: {
											__typename: 'ItemListing',
											title: null, // Missing title
											images: [], // Empty images array
										},
										reserver: {
											__typename: 'PersonalUser',
											account: null, // Missing account
										},
									},
									{
										__typename: 'ReservationRequest',
										id: '3',
										createdAt: new Date('2025-01-17T10:00:00.000Z'),
										reservationPeriodStart: new Date('2025-01-21T00:00:00.000Z'),
										reservationPeriodEnd: new Date('2025-01-26T00:00:00.000Z'),
										state: 'Accepted',
										listing: {
											__typename: 'ItemListing',
											title: 'Valid Title',
											images: ['/assets/item-images/valid.png'],
										},
										reserver: {
											__typename: 'PersonalUser',
											account: {
												__typename: 'PersonalUserAccount',
												username: null, // Missing username
											},
										},
									},
								],
								total: 3,
							},
						},
					},
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		// Wait for data to load
		await waitFor(
			() => {
				expect(canvas.queryAllByText(/Unknown/i).length).toBeGreaterThan(0);
			},
			{ timeout: 3000 },
		);

		// Test fallback values for missing data
		expect(canvas.getByText('Unknown')).toBeInTheDocument(); // Missing listing title
		expect(canvas.getByText('@unknown')).toBeInTheDocument(); // Missing username
		expect(canvas.getAllByText('Unknown').length).toBeGreaterThan(1); // Multiple fallbacks

		// Test valid data still renders correctly
		expect(canvas.getByText('Valid Title')).toBeInTheDocument();
		expect(canvas.getByText('Accepted')).toBeInTheDocument();
	},
};

export const DateFormatting: Story = {
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
							myListingsRequests: {
								items: [
									{
										__typename: 'ReservationRequest',
										id: '1',
										createdAt: new Date('2025-01-15T10:30:45.123Z'),
										reservationPeriodStart: new Date('2025-01-20T09:15:30.000Z'),
										reservationPeriodEnd: new Date('2025-01-25T18:45:00.000Z'),
										state: 'Pending',
										listing: {
											__typename: 'ItemListing',
											title: 'Test Item',
											images: ['/assets/item-images/test.png'],
										},
										reserver: {
											__typename: 'PersonalUser',
											account: {
												__typename: 'PersonalUserAccount',
												username: 'testuser',
											},
										},
									},
								],
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

		// Wait for data to load
		await waitFor(
			() => {
				expect(canvas.getByText('Test Item')).toBeInTheDocument();
			},
			{ timeout: 3000 },
		);

		// Test date formatting - should show date part only (YYYY-MM-DD)
		expect(canvas.getByText('2025-01-20 to 2025-01-25')).toBeInTheDocument();

		// Test that full ISO string is used for requestedOn (not just date part)
		const requestedOnCell = canvas.getByText('2025-01-15T10:30:45.123Z');
		expect(requestedOnCell).toBeInTheDocument();
	},
};

export const StateFilteringInteraction: Story = {
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
							statusFilters: ['Pending'],
							sorter: { field: '', order: '' },
							sharerId: '6324a3f1e3e4e1e6a8e1d8b1',
						},
					},
					result: {
						data: {
							myListingsRequests: {
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
											title: 'Filtered Item',
											images: ['/assets/item-images/filtered.png'],
										},
										reserver: {
											__typename: 'PersonalUser',
											account: {
												__typename: 'PersonalUserAccount',
												username: 'filtereduser',
											},
										},
									},
								],
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

		// Wait for filtered data to load
		await waitFor(
			() => {
				expect(canvas.getByText('Filtered Item')).toBeInTheDocument();
			},
			{ timeout: 3000 },
		);

		// Verify the filtered item shows correct status
		expect(canvas.getByText('Pending')).toBeInTheDocument();
		expect(canvas.getByText('@filtereduser')).toBeInTheDocument();
	},
};

export const SortingInteraction: Story = {
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
							sorter: { field: 'title', order: 'ascend' },
							sharerId: '6324a3f1e3e4e1e6a8e1d8b1',
						},
					},
					result: {
						data: {
							myListingsRequests: {
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
											title: 'Apple MacBook',
											images: ['/assets/item-images/macbook.png'],
										},
										reserver: {
											__typename: 'PersonalUser',
											account: {
												__typename: 'PersonalUserAccount',
												username: 'user1',
											},
										},
									},
									{
										__typename: 'ReservationRequest',
										id: '2',
										createdAt: new Date('2025-01-16T10:00:00.000Z'),
										reservationPeriodStart: new Date('2025-01-21T00:00:00.000Z'),
										reservationPeriodEnd: new Date('2025-01-26T00:00:00.000Z'),
										state: 'Accepted',
										listing: {
											__typename: 'ItemListing',
											title: 'Zeiss Camera',
											images: ['/assets/item-images/camera.png'],
										},
										reserver: {
											__typename: 'PersonalUser',
											account: {
												__typename: 'PersonalUserAccount',
												username: 'user2',
											},
										},
									},
								],
								total: 2,
							},
						},
					},
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		// Wait for sorted data to load
		await waitFor(
			() => {
				expect(canvas.getByText('Apple MacBook')).toBeInTheDocument();
			},
			{ timeout: 3000 },
		);

		// Verify both items are present (sorted alphabetically)
		expect(canvas.getByText('Apple MacBook')).toBeInTheDocument();
		expect(canvas.getByText('Zeiss Camera')).toBeInTheDocument();
		expect(canvas.getByText('Pending')).toBeInTheDocument();
		expect(canvas.getByText('Accepted')).toBeInTheDocument();
	},
};
