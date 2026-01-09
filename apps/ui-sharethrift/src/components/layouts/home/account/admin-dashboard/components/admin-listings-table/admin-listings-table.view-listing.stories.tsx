import type { Meta, StoryObj } from '@storybook/react';
import { expect } from 'storybook/test';
import { AdminViewListing } from './admin-listings-table.view-listing.tsx';
import { withMockApolloClient, withMockRouter } from '../../../../../../../test-utils/storybook-decorators.tsx';
import {
	AdminListingsTableContainerAdminListingsDocument,
	AdminListingsTableContainerDeleteListingDocument,
	BlockListingContainerUnblockListingDocument,
    AdminListingsTableContainerUnblockListingDocument
} from '../../../../../../../generated.tsx';

const meta = {
	title: 'Components/AdminViewListing',
	component: AdminViewListing,
	parameters: {
		layout: 'fullscreen',
		apolloClient: {
			mocks: [
				{
					request: {
						query: AdminListingsTableContainerAdminListingsDocument,
						variables: {
							page: 1,
							pageSize: 100,
							statusFilters: ['Blocked', 'Active'],
						},
					},
					result: {
						data: {
							adminListings: {
								__typename: 'AdminListingSearchResults',
								items: [
									{
										__typename: 'ListingAll',
										id: 'listing-123',
										title: 'Mountain Bike for Weekend',
										images: [
											'https://via.placeholder.com/300',
										],
										state: 'Blocked',
										createdAt: '2024-11-01T10:00:00Z',
										sharingPeriodStart: '2024-12-01',
										sharingPeriodEnd: '2024-12-15',
									},
								],
								total: 1,
							},
						},
					},
				},
				{
					request: {
						query: BlockListingContainerUnblockListingDocument,
					},
					result: {
						data: {
							unblockListing: {
								__typename: 'BlockListingResult',
								id: 'listing-123',
								state: 'Published',
								success: true,
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
	decorators: [withMockApolloClient, withMockRouter('/account/admin-dashboard/listings/listing-123')],
} satisfies Meta<typeof AdminViewListing>;

export default meta;
type Story = StoryObj<typeof AdminViewListing>;

export const Default: Story = {
	play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		expect(canvasElement).toBeTruthy();
	},
};

export const ListingNotFound: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: AdminListingsTableContainerAdminListingsDocument,
						variables: {
							page: 1,
							pageSize: 100,
							statusFilters: ['Appeal Requested', 'Blocked', 'Published'],
						},
					},
					result: {
						data: {
							adminListings: {
								__typename: 'AdminListingSearchResults',
								items: [],
								total: 0,
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
						variables: {
							page: 1,
							pageSize: 100,
							statusFilters: ['Appeal Requested', 'Blocked', 'Published'],
						},
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

export const UnblockSuccess: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: AdminListingsTableContainerAdminListingsDocument,
						variables: {
							page: 1,
							pageSize: 100,
							statusFilters: ['Appeal Requested', 'Blocked', 'Published'],
						},
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							adminListings: {
								__typename: 'AdminListingSearchResults',
								items: [
									{
										__typename: 'ListingAll',
										id: 'listing-123',
										title: 'Mountain Bike for Weekend',
										images: ['https://via.placeholder.com/300'],
										state: 'Blocked',
										createdAt: '2024-11-01T10:00:00Z',
										sharingPeriodStart: '2024-12-01',
										sharingPeriodEnd: '2024-12-15',
									},
								],
								total: 1,
							},
						},
					},
				},
				{
					request: {
						query: AdminListingsTableContainerUnblockListingDocument,
						variables: () => true,
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
						variables: {
							page: 1,
							pageSize: 100,
							statusFilters: ['Appeal Requested', 'Blocked', 'Published'],
						},
					},
					result: {
						data: {
							adminListings: {
								__typename: 'AdminListingSearchResults',
								items: [
									{
										__typename: 'ListingAll',
										id: 'listing-123',
										title: 'Mountain Bike for Weekend',
										images: ['https://via.placeholder.com/300'],
										state: 'Blocked',
										createdAt: '2024-11-01T10:00:00Z',
										sharingPeriodStart: '2024-12-01',
										sharingPeriodEnd: '2024-12-15',
									},
								],
								total: 1,
							},
						},
					},
				},
				{
					request: {
						query: AdminListingsTableContainerUnblockListingDocument,
						variables: () => true,
					},
					error: new Error('Network error'),
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
						variables: {
							page: 1,
							pageSize: 100,
							statusFilters: ['Appeal Requested', 'Blocked', 'Published'],
						},
					},
					result: {
						data: {
							adminListings: {
								__typename: 'AdminListingSearchResults',
								items: [
									{
										__typename: 'ListingAll',
										id: 'listing-123',
										title: 'Mountain Bike for Weekend',
										images: ['https://via.placeholder.com/300'],
										state: 'Blocked',
										createdAt: '2024-11-01T10:00:00Z',
										sharingPeriodStart: '2024-12-01',
										sharingPeriodEnd: '2024-12-15',
									},
								],
								total: 1,
							},
						},
					},
				},
				{
					request: {
						query: AdminListingsTableContainerDeleteListingDocument,
						variables: () => true,
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
						variables: {
							page: 1,
							pageSize: 100,
							statusFilters: ['Appeal Requested', 'Blocked', 'Published'],
						},
					},
					result: {
						data: {
							adminListings: {
								__typename: 'AdminListingSearchResults',
								items: [
									{
										__typename: 'ListingAll',
										id: 'listing-123',
										title: 'Mountain Bike for Weekend',
										images: ['https://via.placeholder.com/300'],
										state: 'Blocked',
										createdAt: '2024-11-01T10:00:00Z',
										sharingPeriodStart: '2024-12-01',
										sharingPeriodEnd: '2024-12-15',
									},
								],
								total: 1,
							},
						},
					},
				},
				{
					request: {
						query: AdminListingsTableContainerDeleteListingDocument,
						variables: () => true,
					},
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
						variables: {
							page: 1,
							pageSize: 100,
							statusFilters: ['Appeal Requested', 'Blocked', 'Published'],
						},
					},
					result: {
						data: {
							adminListings: {
								__typename: 'AdminListingSearchResults',
								items: [
									{
										__typename: 'ListingAll',
										id: 'listing-123',
										title: 'Mountain Bike for Weekend',
										images: ['https://via.placeholder.com/300'],
										state: 'Blocked',
										createdAt: '2024-11-01T10:00:00Z',
										sharingPeriodStart: '2024-12-01',
										sharingPeriodEnd: '2024-12-15',
									},
								],
								total: 1,
							},
						},
					},
				},
				{
					request: {
						query: AdminListingsTableContainerDeleteListingDocument,
						variables: () => true,
					},
					error: new Error('Network error'),
				},
			],
		},
	},
	play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		expect(canvasElement).toBeTruthy();
	},
};

export const PublishedListing: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: AdminListingsTableContainerAdminListingsDocument,
						variables: {
							page: 1,
							pageSize: 100,
							statusFilters: ['Appeal Requested', 'Blocked', 'Published'],
						},
					},
					result: {
						data: {
							adminListings: {
								__typename: 'AdminListingSearchResults',
								items: [
									{
										__typename: 'ListingAll',
										id: 'listing-123',
										title: 'Camping Gear Set',
										images: ['https://via.placeholder.com/300'],
										state: 'Published',
										createdAt: '2024-11-01T10:00:00Z',
										sharingPeriodStart: '2024-12-01',
										sharingPeriodEnd: '2024-12-15',
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
	play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		expect(canvasElement).toBeTruthy();
	},
};

export const AppealRequestedListing: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: AdminListingsTableContainerAdminListingsDocument,
						variables: {
							page: 1,
							pageSize: 100,
							statusFilters: ['Appeal Requested', 'Blocked', 'Published'],
						},
					},
					result: {
						data: {
							adminListings: {
								__typename: 'AdminListingSearchResults',
								items: [
									{
										__typename: 'ListingAll',
										id: 'listing-123',
										title: 'Electronics Bundle',
										images: ['https://via.placeholder.com/300'],
										state: 'Appeal Requested',
										createdAt: '2024-11-01T10:00:00Z',
										sharingPeriodStart: '2024-12-01',
										sharingPeriodEnd: '2024-12-15',
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
	play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		expect(canvasElement).toBeTruthy();
	},
};
