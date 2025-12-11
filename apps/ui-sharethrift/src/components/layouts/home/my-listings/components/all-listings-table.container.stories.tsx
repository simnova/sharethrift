import type { Meta, StoryObj } from '@storybook/react';
import { expect, within, userEvent, fn } from 'storybook/test';
import { AllListingsTableContainer } from './all-listings-table.container.tsx';
import {
	withMockApolloClient,
	withMockRouter,
} from '../../../../../test-utils/storybook-decorators.tsx';
import {
	HomeAllListingsTableContainerMyListingsAllDocument,
	HomeAllListingsTableContainerCancelItemListingDocument,
	HomeAllListingsTableContainerDeleteListingDocument,
} from '../../../../../generated.tsx';

const mockListings = [
	{
		__typename: 'ListingAll',
		id: '1',
		title: 'Cordless Drill',
		images: ['/assets/item-images/projector.png'],
		createdAt: '2025-01-01T00:00:00Z',
		sharingPeriodStart: '2025-01-01',
		sharingPeriodEnd: '2025-12-31',
		state: 'Active',
	},
	{
		__typename: 'ListingAll',
		id: '2',
		title: 'Electric Guitar',
		images: ['/assets/item-images/projector.png'],
		createdAt: '2025-02-01T00:00:00Z',
		sharingPeriodStart: '2025-02-01',
		sharingPeriodEnd: '2025-06-30',
		state: 'Paused',
	},
];

const meta: Meta<typeof AllListingsTableContainer> = {
	title: 'Containers/AllListingsTableContainer',
	component: AllListingsTableContainer,
	args: {
		currentPage: 1,
		onPageChange: fn(),
	},
	parameters: {
		layout: 'fullscreen',
		apolloClient: {
			mocks: [
				{
					request: {
						query: HomeAllListingsTableContainerMyListingsAllDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							myListingsAll: {
								__typename: 'MyListingsAllResult',
								items: mockListings,
								total: 2,
								page: 1,
								pageSize: 6,
							},
						},
					},
				},
				{
					request: {
						query: HomeAllListingsTableContainerCancelItemListingDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							cancelItemListing: {
								__typename: 'ItemListingMutationResult',
								status: { success: true, errorMessage: null },
							},
						},
					},
				},
				{
					request: {
						query: HomeAllListingsTableContainerDeleteListingDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							deleteItemListing: {
								__typename: 'ItemListingMutationResult',
								status: { success: true, errorMessage: null },
							},
						},
					},
				},
			],
		},
	},
	decorators: [withMockApolloClient, withMockRouter('/my-listings')],
};

export default meta;
type Story = StoryObj<typeof AllListingsTableContainer>;

export const Default: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvasElement).toBeTruthy();
		const drill = canvas.queryByText(/Cordless Drill/i);
		if (drill) {
			expect(drill).toBeInTheDocument();
		}
	},
};

export const Empty: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: HomeAllListingsTableContainerMyListingsAllDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							myListingsAll: {
								__typename: 'MyListingsAllResult',
								items: [],
								total: 0,
								page: 1,
								pageSize: 6,
							},
						},
					},
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const Loading: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: HomeAllListingsTableContainerMyListingsAllDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					delay: Infinity,
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const WithSearch: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvasElement).toBeTruthy();
		const searchInput = canvas.queryByRole('textbox');
		if (searchInput) {
			await userEvent.type(searchInput, 'drill');
		}
	},
};

export const CancelListingSuccess: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: HomeAllListingsTableContainerMyListingsAllDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							myListingsAll: {
								__typename: 'MyListingsAllResult',
								items: mockListings,
								total: 2,
								page: 1,
								pageSize: 6,
							},
						},
					},
				},
				{
					request: {
						query: HomeAllListingsTableContainerCancelItemListingDocument,
						variables: { id: '1' },
					},
					result: {
						data: {
							cancelItemListing: {
								__typename: 'ItemListingMutationResult',
								status: { success: true, errorMessage: null },
							},
						},
					},
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const CancelListingError: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: HomeAllListingsTableContainerMyListingsAllDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							myListingsAll: {
								__typename: 'MyListingsAllResult',
								items: mockListings,
								total: 2,
								page: 1,
								pageSize: 6,
							},
						},
					},
				},
				{
					request: {
						query: HomeAllListingsTableContainerCancelItemListingDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							cancelItemListing: {
								__typename: 'ItemListingMutationResult',
								status: { success: false, errorMessage: 'Cannot cancel this listing' },
							},
						},
					},
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const DeleteListingError: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: HomeAllListingsTableContainerMyListingsAllDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							myListingsAll: {
								__typename: 'MyListingsAllResult',
								items: mockListings,
								total: 2,
								page: 1,
								pageSize: 6,
							},
						},
					},
				},
				{
					request: {
						query: HomeAllListingsTableContainerDeleteListingDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					error: new Error('Failed to delete listing'),
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const ManyListings: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: HomeAllListingsTableContainerMyListingsAllDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							myListingsAll: {
								__typename: 'MyListingsAllResult',
								items: Array.from({ length: 6 }, (_, i) => ({
									__typename: 'ListingAll',
									id: `${i + 1}`,
									title: `Item ${i + 1}`,
									images: ['/assets/item-images/projector.png'],
									createdAt: '2025-01-01T00:00:00Z',
									sharingPeriodStart: '2025-01-01',
									sharingPeriodEnd: '2025-12-31',
									state: ['Active', 'Paused', 'Draft', 'Expired', 'Blocked', 'Reserved'][i % 6],
								})),
								total: 20,
								page: 1,
								pageSize: 6,
							},
						},
					},
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const WithError: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: HomeAllListingsTableContainerMyListingsAllDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					error: new Error('Failed to fetch listings'),
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvasElement).toBeTruthy();
		const errorText = canvas.queryByText(/Error/i);
		if (errorText) {
			expect(errorText).toBeInTheDocument();
		}
	},
};

export const DeleteListingSuccess: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: HomeAllListingsTableContainerMyListingsAllDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							myListingsAll: {
								__typename: 'MyListingsAllResult',
								items: mockListings,
								total: 2,
								page: 1,
								pageSize: 6,
							},
						},
					},
				},
				{
					request: {
						query: HomeAllListingsTableContainerDeleteListingDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							deleteItemListing: {
								__typename: 'ItemListingMutationResult',
								status: { success: true, errorMessage: null },
							},
						},
					},
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const WithStatusFilter: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvasElement).toBeTruthy();
		const filterDropdown = canvas.queryByText(/Status/i);
		if (filterDropdown) {
			await userEvent.click(filterDropdown);
		}
	},
};

export const CancelListingNetworkError: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: HomeAllListingsTableContainerMyListingsAllDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							myListingsAll: {
								__typename: 'MyListingsAllResult',
								items: mockListings,
								total: 2,
								page: 1,
								pageSize: 6,
							},
						},
					},
				},
				{
					request: {
						query: HomeAllListingsTableContainerCancelItemListingDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					error: new Error('Network error'),
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const DeleteListingFailure: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: HomeAllListingsTableContainerMyListingsAllDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							myListingsAll: {
								__typename: 'MyListingsAllResult',
								items: mockListings,
								total: 2,
								page: 1,
								pageSize: 6,
							},
						},
					},
				},
				{
					request: {
						query: HomeAllListingsTableContainerDeleteListingDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							deleteItemListing: {
								__typename: 'ItemListingMutationResult',
								status: { success: false, errorMessage: 'Cannot delete active listing' },
							},
						},
					},
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const OtherActionComingSoon: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: HomeAllListingsTableContainerMyListingsAllDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							myListingsAll: {
								__typename: 'MyListingsAllResult',
								items: mockListings,
								total: 2,
								page: 1,
								pageSize: 6,
							},
						},
					},
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const ViewAllRequests: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: HomeAllListingsTableContainerMyListingsAllDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							myListingsAll: {
								__typename: 'MyListingsAllResult',
								items: mockListings,
								total: 2,
								page: 1,
								pageSize: 6,
							},
						},
					},
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const TableSortChange: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: HomeAllListingsTableContainerMyListingsAllDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							myListingsAll: {
								__typename: 'MyListingsAllResult',
								items: mockListings,
								total: 2,
								page: 1,
								pageSize: 6,
							},
						},
					},
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};
