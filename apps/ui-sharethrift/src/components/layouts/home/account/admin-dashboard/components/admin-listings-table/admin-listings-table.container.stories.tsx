import type { Meta, StoryObj } from '@storybook/react';
import { expect } from 'storybook/test';
import { AdminListings } from './admin-listings-table.container.tsx';
import {
	withMockApolloClient,
	withMockRouter,
} from '../../../../../../../test-utils/storybook-decorators.tsx';
import {
	AdminListingsTableContainerAdminListingsDocument,
	AdminListingsTableContainerDeleteListingDocument,
	AdminListingsTableContainerUnblockListingDocument,
} from '../../../../../../../generated.tsx';

const meta: Meta<typeof AdminListings> = {
	title: 'Containers/AdminListingsTableContainer',
	component: AdminListings,
	parameters: {
		layout: 'fullscreen',
		apolloClient: {
			mocks: [
				{
					request: {
						query: AdminListingsTableContainerAdminListingsDocument,
						variables: {
							page: 1,
							pageSize: 6,
							statusFilters: ['Appeal Requested', 'Blocked'],
						},
					},
					result: {
						data: {
							adminListings: {
								__typename: 'AdminListingSearchResults',
								items: [
									{
										__typename: 'ListingAll',
										id: 'listing-1',
										title: 'Mountain Bike',
									images: ['https://example.com/bike.jpg'],
										state: 'Blocked',
										createdAt: '2024-11-01T10:00:00Z',
										sharingPeriodStart: '2024-12-01',
										sharingPeriodEnd: '2024-12-15',
									},
								],
								total: 1,
								page: 1,
								pageSize: 6,
							},
						},
					},
				},
				{
					request: {
						query: AdminListingsTableContainerUnblockListingDocument,
					},
					result: {
						data: {
							unblockItemListing: {
								__typename: 'MutationStatus',
								success: true,
								errorMessage: null,
							},
						},
					},
				},
				{
					request: {
						query: AdminListingsTableContainerDeleteListingDocument,
					},
					result: {
						data: {
							deleteItemListing: {
								__typename: 'ItemListingMutationResult',
								status: {
									__typename: 'MutationStatus',
									success: true,
									errorMessage: null,
								},
							},
						},
					},
				},
			],
		},
	},
	decorators: [
		withMockApolloClient,
		withMockRouter('/account/admin-dashboard/listings'),
	],
};

export default meta;
type Story = StoryObj<typeof AdminListings>;

export const Default: Story = {
	play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		expect(canvasElement).toBeTruthy();
	},
};

export const WithSearchText: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: AdminListingsTableContainerAdminListingsDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							adminListings: {
								__typename: 'AdminListingSearchResults',
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
	play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		expect(canvasElement).toBeTruthy();
	},
};

export const WithSorting: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: AdminListingsTableContainerAdminListingsDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							adminListings: {
								__typename: 'AdminListingSearchResults',
								items: [
									{
										__typename: 'ListingAll',
										id: 'listing-1',
										title: 'Mountain Bike',
										images: ['https://example.com/bike.jpg'],
										state: 'Blocked',
										createdAt: '2024-11-01T10:00:00Z',
										sharingPeriodStart: '2024-12-01',
										sharingPeriodEnd: '2024-12-15',
									},
								],
								total: 1,
								page: 1,
								pageSize: 6,
							},
						},
					},
				},
			],
		},
	},
	play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		expect(canvasElement).toBeTruthy();
	},
};

export const LoadingState: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: AdminListingsTableContainerAdminListingsDocument,
					},
					delay: Infinity,
				},
			],
		},
	},
	play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		expect(canvasElement).toBeTruthy();
	},
};

export const ErrorState: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: AdminListingsTableContainerAdminListingsDocument,
					},
					error: new Error('Failed to fetch listings'),
				},
			],
		},
	},
	play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		expect(canvasElement).toBeTruthy();
	},
};

export const DeleteSuccess: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: AdminListingsTableContainerAdminListingsDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							adminListings: {
								__typename: 'AdminListingSearchResults',
								items: [
									{
										__typename: 'ListingAll',
										id: 'listing-1',
										title: 'Mountain Bike',
										images: ['https://example.com/bike.jpg'],
										state: 'Blocked',
										createdAt: '2024-11-01T10:00:00Z',
										sharingPeriodStart: '2024-12-01',
										sharingPeriodEnd: '2024-12-15',
									},
								],
								total: 1,
								page: 1,
								pageSize: 6,
							},
						},
					},
				},
				{
					request: {
						query: AdminListingsTableContainerDeleteListingDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							deleteItemListing: {
								__typename: 'ItemListingMutationResult',
								status: {
									__typename: 'MutationStatus',
									success: true,
									errorMessage: null,
								},
							},
						},
					},
				},
			],
		},
	},
	play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		expect(canvasElement).toBeTruthy();
	},
};

export const DeleteFailure: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: AdminListingsTableContainerAdminListingsDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							adminListings: {
								__typename: 'AdminListingSearchResults',
								items: [
									{
										__typename: 'ListingAll',
										id: 'listing-1',
										title: 'Mountain Bike',
										images: ['https://example.com/bike.jpg'],
										state: 'Blocked',
										createdAt: '2024-11-01T10:00:00Z',
										sharingPeriodStart: '2024-12-01',
										sharingPeriodEnd: '2024-12-15',
									},
								],
								total: 1,
								page: 1,
								pageSize: 6,
							},
						},
					},
				},
				{
					request: {
						query: AdminListingsTableContainerDeleteListingDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							deleteItemListing: {
								__typename: 'ItemListingMutationResult',
								status: {
									__typename: 'MutationStatus',
									success: false,
									errorMessage: 'Cannot delete published listing',
								},
							},
						},
					},
				},
			],
		},
	},
	play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		expect(canvasElement).toBeTruthy();
	},
};

export const DeleteError: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: AdminListingsTableContainerAdminListingsDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							adminListings: {
								__typename: 'AdminListingSearchResults',
								items: [
									{
										__typename: 'ListingAll',
										id: 'listing-1',
										title: 'Mountain Bike',
										images: ['https://example.com/bike.jpg'],
										state: 'Blocked',
										createdAt: '2024-11-01T10:00:00Z',
										sharingPeriodStart: '2024-12-01',
										sharingPeriodEnd: '2024-12-15',
									},
								],
								total: 1,
								page: 1,
								pageSize: 6,
							},
						},
					},
				},
				{
					request: {
						query: AdminListingsTableContainerDeleteListingDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					error: new Error('Network error'),
				},
			],
		},
	},
	play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		expect(canvasElement).toBeTruthy();
	},
};

export const UnblockSuccess: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: AdminListingsTableContainerAdminListingsDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							adminListings: {
								__typename: 'AdminListingSearchResults',
								items: [
									{
										__typename: 'ListingAll',
										id: 'listing-1',
										title: 'Mountain Bike',
										images: ['https://example.com/bike.jpg'],
										state: 'Blocked',
										createdAt: '2024-11-01T10:00:00Z',
										sharingPeriodStart: '2024-12-01',
										sharingPeriodEnd: '2024-12-15',
									},
								],
								total: 1,
								page: 1,
								pageSize: 6,
							},
						},
					},
				},
				{
					request: {
						query: AdminListingsTableContainerUnblockListingDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							unblockItemListing: {
								__typename: 'MutationStatus',
								success: true,
								errorMessage: null,
							},
						},
					},
				},
			],
		},
	},
	play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		expect(canvasElement).toBeTruthy();
	},
};

export const UnblockFailure: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: AdminListingsTableContainerAdminListingsDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							adminListings: {
								__typename: 'AdminListingSearchResults',
								items: [
									{
										__typename: 'ListingAll',
										id: 'listing-1',
										title: 'Mountain Bike',
										images: ['https://example.com/bike.jpg'],
										state: 'Blocked',
										createdAt: '2024-11-01T10:00:00Z',
										sharingPeriodStart: '2024-12-01',
										sharingPeriodEnd: '2024-12-15',
									},
								],
								total: 1,
								page: 1,
								pageSize: 6,
							},
						},
					},
				},
				{
					request: {
						query: AdminListingsTableContainerUnblockListingDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							unblockItemListing: {
								__typename: 'MutationStatus',
								success: false,
								errorMessage: 'Cannot unblock listing',
							},
						},
					},
				},
			],
		},
	},
	play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		expect(canvasElement).toBeTruthy();
	},
};

export const UnblockError: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: AdminListingsTableContainerAdminListingsDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							adminListings: {
								__typename: 'AdminListingSearchResults',
								items: [
									{
										__typename: 'ListingAll',
										id: 'listing-1',
										title: 'Mountain Bike',
										images: ['https://example.com/bike.jpg'],
										state: 'Blocked',
										createdAt: '2024-11-01T10:00:00Z',
										sharingPeriodStart: '2024-12-01',
										sharingPeriodEnd: '2024-12-15',
									},
								],
								total: 1,
								page: 1,
								pageSize: 6,
							},
						},
					},
				},
				{
					request: {
						query: AdminListingsTableContainerUnblockListingDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					error: new Error('Network error'),
				},
			],
		},
	},
	play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		expect(canvasElement).toBeTruthy();
	},
};
