import type { Meta, StoryObj } from '@storybook/react';
import { expect, within, userEvent, waitFor } from 'storybook/test';
import AdminViewListing from './admin-listings-table.view-listing';
import { withMockRouter, withMockApolloClient } from '../../../../../../test-utils/storybook-decorators.tsx';
import {
	AdminListingsTableContainerAdminListingsDocument,
	AdminListingsTableContainerDeleteListingDocument,
	AdminListingsTableContainerUnblockListingDocument,
} from '../../../../../../generated.tsx';

const meta = {
	title: 'Components/AdminViewListing',
	component: AdminViewListing,
	decorators: [withMockApolloClient, withMockRouter('/listing-123')],
	parameters: {
		layout: 'fullscreen',
	},
} satisfies Meta<typeof AdminViewListing>;

export default meta;
type Story = StoryObj<typeof AdminViewListing>;

export const Default: Story = {
	parameters: {
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
										images: ['https://via.placeholder.com/300'],
										state: 'Active',
										createdAt: '2024-11-01T10:00:00Z',
										sharingPeriodStart: '2024-12-01',
										sharingPeriodEnd: '2024-12-15',
									},
								],
								total: 1,
								page: 1,
								pageSize: 100,
							},
						},
					},
				},
			],
		},
	},
	play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		expect(canvasElement).toBeTruthy();
		await new Promise(resolve => setTimeout(resolve, 1000));
		expect(canvasElement.textContent).toContain('Mountain Bike for Weekend');
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
							statusFilters: ['Blocked', 'Active'],
						},
					},
					result: {
						data: {
							adminListings: {
								__typename: 'AdminListingSearchResults',
								items: [],
								total: 0,
								page: 1,
								pageSize: 100,
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
							statusFilters: ['Blocked', 'Active'],
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
							statusFilters: ['Blocked', 'Active'],
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
								page: 1,
								pageSize: 100,
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
		const canvas = within(canvasElement);
		await waitFor(() => {
			expect(canvas.queryByText('Unblock Listing')).toBeInTheDocument();
		});
		const unblockBtn = canvas.getByText('Unblock Listing');
		await userEvent.click(unblockBtn);
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
										images: ['https://via.placeholder.com/300'],
										state: 'Blocked',
										createdAt: '2024-11-01T10:00:00Z',
										sharingPeriodStart: '2024-12-01',
										sharingPeriodEnd: '2024-12-15',
									},
								],
								total: 1,
								page: 1,
								pageSize: 100,
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
		const canvas = within(canvasElement);
		await waitFor(() => {
			expect(canvas.queryByText('Unblock Listing')).toBeInTheDocument();
		});
		const unblockBtn = canvas.getByText('Unblock Listing');
		await userEvent.click(unblockBtn);
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
							statusFilters: ['Blocked', 'Active'],
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
								page: 1,
								pageSize: 100,
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
										images: ['https://via.placeholder.com/300'],
										state: 'Blocked',
										createdAt: '2024-11-01T10:00:00Z',
										sharingPeriodStart: '2024-12-01',
										sharingPeriodEnd: '2024-12-15',
									},
								],
								total: 1,
								page: 1,
								pageSize: 100,
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
							statusFilters: ['Blocked', 'Active'],
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
								page: 1,
								pageSize: 100,
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
										title: 'Camping Gear Set',
										images: ['https://via.placeholder.com/300'],
										state: 'Active',
										createdAt: '2024-11-01T10:00:00Z',
										sharingPeriodStart: '2024-12-01',
										sharingPeriodEnd: '2024-12-15',
									},
								],
								total: 1,
								page: 1,
								pageSize: 100,
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
										title: 'Electronics Bundle',
										images: ['https://via.placeholder.com/300'],
										state: 'Active',
										createdAt: '2024-11-01T10:00:00Z',
										sharingPeriodStart: '2024-12-01',
										sharingPeriodEnd: '2024-12-15',
									},
								],
								total: 1,
								page: 1,
								pageSize: 100,
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

export const ActiveListing: Story = {
	parameters: {
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
										title: 'Active Listing Item',
										images: ['https://via.placeholder.com/300'],
										state: 'Active',
										createdAt: '2024-11-01T10:00:00Z',
										sharingPeriodStart: '2024-12-01',
										sharingPeriodEnd: '2024-12-15',
									},
								],
								total: 1,
								page: 1,
								pageSize: 100,
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

export const ListingWithNullDates: Story = {
	parameters: {
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
										title: 'Listing with Missing Dates',
										images: ['https://via.placeholder.com/300'],
										state: 'Blocked',
										createdAt: null,
										sharingPeriodStart: null,
										sharingPeriodEnd: null,
									},
								],
								total: 1,
								page: 1,
								pageSize: 100,
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

export const ListingWithoutImages: Story = {
	parameters: {
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
										title: 'Listing Without Images',
										images: [],
										state: 'Active',
										createdAt: '2024-11-01T10:00:00Z',
										sharingPeriodStart: '2024-12-01',
										sharingPeriodEnd: '2024-12-15',
									},
								],
								total: 1,
								page: 1,
								pageSize: 100,
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

export const UnknownStateListing: Story = {
	parameters: {
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
										title: 'Unknown State Listing',
										images: ['https://via.placeholder.com/300'],
										state: null,
										createdAt: '2024-11-01T10:00:00Z',
										sharingPeriodStart: '2024-12-01',
										sharingPeriodEnd: '2024-12-15',
									},
								],
								total: 1,
								page: 1,
								pageSize: 100,
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
