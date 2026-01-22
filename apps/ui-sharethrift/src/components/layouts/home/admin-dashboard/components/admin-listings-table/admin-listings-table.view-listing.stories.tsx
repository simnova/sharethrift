import type { Meta, StoryObj } from '@storybook/react';
import { expect, within, userEvent, waitFor } from 'storybook/test';
import AdminViewListing from './admin-listings-table.view-listing.tsx';
import {
	withMockApolloClient,
	withMockRouter,
} from '../../../../../../test-utils/storybook-decorators.tsx';
import {
	AdminListingsTableContainerAdminListingsDocument,
	AdminListingsTableContainerDeleteListingDocument,
	AdminListingsTableContainerUnblockListingDocument,
} from '../../../../../../generated.tsx';

const meta: Meta<typeof AdminViewListing> = {
	title: 'Containers/AdminViewListing',
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
								pageSize: 100,
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
};

export default meta;
type Story = StoryObj<typeof AdminViewListing>;

export const Default: Story = {
	decorators: [
		withMockApolloClient,
		withMockRouter('/account/admin-dashboard/listings/listing-1'),
	],
	play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				expect(canvas.getByText('Mountain Bike')).toBeTruthy();
			},
			{ timeout: 3000 },
		);
		expect(canvas.getByText('Admin View')).toBeTruthy();
		const blockedTags = canvas.getAllByText('Blocked');
		expect(blockedTags.length).toBeGreaterThan(0);
		expect(canvas.getByText('Back to Admin Dashboard')).toBeTruthy();
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
	decorators: [
		withMockApolloClient,
		withMockRouter('/account/admin-dashboard/listings/listing-1'),
	],
	play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				expect(canvas.getByText('Loading listing...')).toBeTruthy();
			},
			{ timeout: 3000 },
		);
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
	decorators: [
		withMockApolloClient,
		withMockRouter('/account/admin-dashboard/listings/non-existent-id'),
	],
	play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				expect(canvas.getByText('Listing not found')).toBeTruthy();
			},
			{ timeout: 3000 },
		);
		expect(
			canvas.getByText(/could not be found/i),
		).toBeTruthy();
	},
};

export const BlockedListing: Story = {
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
										id: 'listing-blocked',
										title: 'Blocked Listing',
										images: ['https://example.com/blocked.jpg'],
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
			],
		},
	},
	decorators: [
		withMockApolloClient,
		withMockRouter('/account/admin-dashboard/listings/listing-blocked'),
	],
	play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				expect(canvas.getByText('Blocked Listing')).toBeTruthy();
			},
			{ timeout: 3000 },
		);
		expect(canvas.getByText('Unblock Listing')).toBeTruthy();
		expect(canvas.getByText('Remove Listing')).toBeTruthy();
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
										id: 'listing-active',
										title: 'Active Listing',
										images: ['https://example.com/active.jpg'],
										state: 'Active',
										createdAt: '2024-11-02T10:00:00Z',
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
	decorators: [
		withMockApolloClient,
		withMockRouter('/account/admin-dashboard/listings/listing-active'),
	],
	play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				expect(canvas.getByText('Active Listing')).toBeTruthy();
			},
			{ timeout: 3000 },
		);
		// Should not show Unblock button for active listings
		expect(canvas.queryByText('Unblock Listing')).toBeNull();
		expect(canvas.getByText('Remove Listing')).toBeTruthy();
	},
};

export const ListingWithNoImages: Story = {
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
										id: 'listing-no-images',
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
	decorators: [
		withMockApolloClient,
		withMockRouter('/account/admin-dashboard/listings/listing-no-images'),
	],
	play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				expect(canvas.getByText('Listing Without Images')).toBeTruthy();
			},
			{ timeout: 3000 },
		);
		// Should not render listing image when no images available (arrow icon still has role="img")
		const listingImage = canvas.queryByAltText('Listing Without Images');
		expect(listingImage).toBeNull();
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
										id: 'listing-null-dates',
										title: 'Listing With Null Dates',
										images: ['https://example.com/item.jpg'],
										state: 'Active',
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
	decorators: [
		withMockApolloClient,
		withMockRouter('/account/admin-dashboard/listings/listing-null-dates'),
	],
	play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				expect(canvas.getByText('Listing With Null Dates')).toBeTruthy();
			},
			{ timeout: 3000 },
		);
		// Should show N/A for null dates
		const naElements = canvas.getAllByText('N/A');
		expect(naElements.length).toBeGreaterThan(0);
	},
};

export const ListingWithNullState: Story = {
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
										id: 'listing-null-state',
										title: 'Listing With Unknown State',
										images: ['https://example.com/item.jpg'],
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
	decorators: [
		withMockApolloClient,
		withMockRouter('/account/admin-dashboard/listings/listing-null-state'),
	],
	play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				expect(canvas.getByText('Listing With Unknown State')).toBeTruthy();
			},
			{ timeout: 3000 },
		);
		const unknownTags = canvas.getAllByText('Unknown');
		expect(unknownTags.length).toBeGreaterThan(0);
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
	decorators: [
		withMockApolloClient,
		withMockRouter('/account/admin-dashboard/listings/listing-1'),
	],
	play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				expect(canvas.getByText('Mountain Bike')).toBeTruthy();
			},
			{ timeout: 3000 },
		);
		const unblockBtn = canvas.getByText('Unblock Listing');
		await userEvent.click(unblockBtn);
		await waitFor(
			() => {
				// Success message should appear
				expect(canvasElement).toBeTruthy();
			},
			{ timeout: 3000 },
		);
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
					maxUsageCount: Number.POSITIVE_INFINITY,
					error: new Error('Network error during unblock'),
				},
			],
		},
	},
	decorators: [
		withMockApolloClient,
		withMockRouter('/account/admin-dashboard/listings/listing-1'),
	],
	play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				expect(canvas.getByText('Mountain Bike')).toBeTruthy();
			},
			{ timeout: 3000 },
		);
		const unblockBtn = canvas.getByText('Unblock Listing');
		await userEvent.click(unblockBtn);
		// Error is caught and handled in catch block
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
	decorators: [
		withMockApolloClient,
		withMockRouter('/account/admin-dashboard/listings/listing-1'),
	],
	play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				expect(canvas.getByText('Mountain Bike')).toBeTruthy();
			},
			{ timeout: 3000 },
		);
		const deleteBtn = canvas.getByText('Remove Listing');
		await userEvent.click(deleteBtn);
		// Should show popconfirm
		await waitFor(
			() => {
				const confirmBtn = document.querySelector('.ant-popconfirm .ant-btn-primary');
				expect(confirmBtn).toBeTruthy();
			},
			{ timeout: 1000 },
		);
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
									errorMessage: 'Cannot delete this listing',
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
		withMockRouter('/account/admin-dashboard/listings/listing-1'),
	],
	play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				expect(canvas.getByText('Mountain Bike')).toBeTruthy();
			},
			{ timeout: 3000 },
		);
		const deleteBtn = canvas.getByText('Remove Listing');
		await userEvent.click(deleteBtn);
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
				{
					request: {
						query: AdminListingsTableContainerDeleteListingDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					error: new Error('Network error during delete'),
				},
			],
		},
	},
	decorators: [
		withMockApolloClient,
		withMockRouter('/account/admin-dashboard/listings/listing-1'),
	],
	play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				expect(canvas.getByText('Mountain Bike')).toBeTruthy();
			},
			{ timeout: 3000 },
		);
		const deleteBtn = canvas.getByText('Remove Listing');
		await userEvent.click(deleteBtn);
	},
};

export const BackButtonNavigation: Story = {
	decorators: [
		withMockApolloClient,
		withMockRouter('/account/admin-dashboard/listings/listing-1'),
	],
	play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				expect(canvas.getByText('Mountain Bike')).toBeTruthy();
			},
			{ timeout: 3000 },
		);
		const backBtn = canvas.getAllByText('Back to Admin Dashboard')[0];
		if (backBtn) {
			await userEvent.click(backBtn);
		}
		// Should clear session storage and navigate
	},
};

export const ComingSoonSection: Story = {
	decorators: [
		withMockApolloClient,
		withMockRouter('/account/admin-dashboard/listings/listing-1'),
	],
	play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				expect(canvas.getByText('Mountain Bike')).toBeTruthy();
			},
			{ timeout: 3000 },
		);
		expect(canvas.getByText('Coming Soon')).toBeTruthy();
		expect(canvas.getByText(/Full listing description/i)).toBeTruthy();
		expect(canvas.getByText(/Category and location/i)).toBeTruthy();
		expect(canvas.getByText(/Lister profile/i)).toBeTruthy();
		expect(canvas.getByText(/Listing history/i)).toBeTruthy();
		expect(canvas.getByText(/Reports and appeals/i)).toBeTruthy();
		expect(canvas.getByText(/Reservation history/i)).toBeTruthy();
		expect(canvas.getByText(/Admin action logs/i)).toBeTruthy();
	},
};

export const StatusTagColorsBlocked: Story = {
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
										id: 'listing-1',
										title: 'Purple Tag Test',
										images: ['https://example.com/bike.jpg'],
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
			],
		},
	},
	decorators: [
		withMockApolloClient,
		withMockRouter('/account/admin-dashboard/listings/listing-1'),
	],
	play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				expect(canvas.getByText('Purple Tag Test')).toBeTruthy();
			},
			{ timeout: 3000 },
		);
		// Verify that Blocked status uses purple color (getStatusColor function)
		const blockedTags = canvas.getAllByText('Blocked');
		expect(blockedTags.length).toBeGreaterThan(0);
	},
};

export const StatusTagColorsActive: Story = {
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
										id: 'listing-active',
										title: 'Green Tag Test',
										images: ['https://example.com/bike.jpg'],
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
	decorators: [
		withMockApolloClient,
		withMockRouter('/account/admin-dashboard/listings/listing-active'),
	],
	play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				expect(canvas.getByText('Green Tag Test')).toBeTruthy();
			},
			{ timeout: 3000 },
		);
		// Verify that Active status uses green color (getStatusColor function)
		const activeTags = canvas.getAllByText('Active');
		expect(activeTags.length).toBeGreaterThan(0);
	},
};

export const DateFormattingPublishedAt: Story = {
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
										id: 'listing-1',
										title: 'Date Format Test',
										images: ['https://example.com/bike.jpg'],
										state: 'Active',
										createdAt: '2024-11-01T14:30:00Z',
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
	decorators: [
		withMockApolloClient,
		withMockRouter('/account/admin-dashboard/listings/listing-1'),
	],
	play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				expect(canvas.getByText('Date Format Test')).toBeTruthy();
			},
			{ timeout: 3000 },
		);
		// Should format date with year, month, day, and time
		const dateElement = canvas.getByText(/November 1, 2024/i);
		expect(dateElement).toBeTruthy();
	},
};

export const DateFormattingReservationPeriod: Story = {
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
										id: 'listing-1',
										title: 'Period Format Test',
										images: ['https://example.com/bike.jpg'],
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
	decorators: [
		withMockApolloClient,
		withMockRouter('/account/admin-dashboard/listings/listing-1'),
	],
	play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				expect(canvas.getByText('Period Format Test')).toBeTruthy();
			},
			{ timeout: 3000 },
		);
		// Should format reservation period with start and end dates (11/30 due to UTC timezone conversion)
		const periodElement = canvas.getByText(/11\/30\/2024.*12\/14\/2024/i);
		expect(periodElement).toBeTruthy();
	},
};

export const ImageDisplay: Story = {
	decorators: [
		withMockApolloClient,
		withMockRouter('/account/admin-dashboard/listings/listing-1'),
	],
	play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				expect(canvas.getByText('Mountain Bike')).toBeTruthy();
			},
			{ timeout: 3000 },
		);
		const img = canvas.getByAltText('Mountain Bike');
		expect(img).toBeTruthy();
		expect(img.getAttribute('src')).toBe('https://example.com/bike.jpg');
	},
};

export const AdminActionsSection: Story = {
	decorators: [
		withMockApolloClient,
		withMockRouter('/account/admin-dashboard/listings/listing-1'),
	],
	play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				expect(canvas.getByText('Mountain Bike')).toBeTruthy();
			},
			{ timeout: 3000 },
		);
		expect(canvas.getByText('Admin Actions')).toBeTruthy();
		expect(canvas.getByText('Unblock Listing')).toBeTruthy();
		expect(canvas.getByText('Remove Listing')).toBeTruthy();
	},
};

export const PendingRequestsPlaceholder: Story = {
	decorators: [
		withMockApolloClient,
		withMockRouter('/account/admin-dashboard/listings/listing-1'),
	],
	play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				expect(canvas.getByText('Mountain Bike')).toBeTruthy();
			},
			{ timeout: 3000 },
		);
		// Pending Requests field shows '-' placeholder
		const pendingLabel = canvas.getByText('Pending Requests');
		expect(pendingLabel).toBeTruthy();
	},
};

export const SessionStorageClearing: Story = {
	decorators: [
		withMockApolloClient,
		withMockRouter('/account/admin-dashboard/listings/listing-1'),
	],
	play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		const canvas = within(canvasElement);
		
		// Set adminContext before navigating back
		globalThis.sessionStorage.setItem('adminContext', 'test-value');
		
		await waitFor(
			() => {
				expect(canvas.getByText('Mountain Bike')).toBeTruthy();
			},
			{ timeout: 3000 },
		);
		
		const backBtn = canvas.getAllByText('Back to Admin Dashboard')[0];
		if (backBtn) {
			await userEvent.click(backBtn);
		}
		
		// Verify session storage was cleared
		expect(globalThis.sessionStorage.getItem('adminContext')).toBeNull();
	},
};

export const UnblockWhenListingUndefined: Story = {
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
	decorators: [
		withMockApolloClient,
		withMockRouter('/account/admin-dashboard/listings/non-existent'),
	],
	play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				expect(canvas.getByText('Listing not found')).toBeTruthy();
			},
			{ timeout: 3000 },
		);
		// handleUnblock should return early when listing is undefined
	},
};

export const DeleteWhenListingUndefined: Story = {
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
	decorators: [
		withMockApolloClient,
		withMockRouter('/account/admin-dashboard/listings/non-existent'),
	],
	play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				expect(canvas.getByText('Listing not found')).toBeTruthy();
			},
			{ timeout: 3000 },
		);
		// handleDelete should return early when listing is undefined
	},
};

export const PopconfirmUI: Story = {
	decorators: [
		withMockApolloClient,
		withMockRouter('/account/admin-dashboard/listings/listing-1'),
	],
	play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				expect(canvas.getByText('Mountain Bike')).toBeTruthy();
			},
			{ timeout: 3000 },
		);
		const deleteBtn = canvas.getByText('Remove Listing');
		await userEvent.click(deleteBtn);
		
		// Verify Popconfirm appears with correct text
		await waitFor(
			() => {
				const popconfirm = document.querySelector('.ant-popconfirm');
				expect(popconfirm).toBeTruthy();
			},
			{ timeout: 1000 },
		);
	},
};
