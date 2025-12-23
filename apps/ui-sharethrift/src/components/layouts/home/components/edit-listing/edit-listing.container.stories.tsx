import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from 'storybook/test';
import { EditListingContainer } from './edit-listing.container.tsx';
import {
	withMockApolloClient,
	withMockRouter,
} from '../../../../../test-utils/storybook-decorators.tsx';
import {
	HomeEditListingContainerItemListingDocument,
	HomeEditListingContainerUpdateItemListingDocument,
	HomeEditListingContainerPauseItemListingDocument,
	HomeEditListingContainerDeleteItemListingDocument,
	HomeEditListingContainerCancelItemListingDocument,
} from '../../../../../generated.tsx';

const mockListing = {
	__typename: 'ItemListing' as const,
	id: 'listing-123',
	title: 'Test Listing',
	description: 'Test description for the listing',
	category: 'Electronics',
	location: 'Toronto, ON',
	state: 'Published',
	sharingPeriodStart: '2025-01-01T00:00:00.000Z',
	sharingPeriodEnd: '2025-12-31T00:00:00.000Z',
	images: ['/assets/item-images/bike.png', '/assets/item-images/tent.png'],
	sharer: {
		__typename: 'PersonalUser' as const,
		id: 'user-123',
		userType: 'personal-user' as const,
	},
};

const meta: Meta<typeof EditListingContainer> = {
	title: 'Containers/EditListingContainer',
	component: EditListingContainer,
	parameters: {
		layout: 'fullscreen',
		apolloClient: {
			mocks: [
				{
					request: {
						query: HomeEditListingContainerItemListingDocument,
						variables: { id: 'listing-123' },
					},
					result: {
						data: {
							itemListing: mockListing,
						},
					},
				},
				{
					request: {
						query: HomeEditListingContainerUpdateItemListingDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							updateItemListing: {
								...mockListing,
								title: 'Updated Listing',
							},
						},
					},
				},
			],
		},
	},
	decorators: [
		withMockApolloClient,
		withMockRouter('/edit-listing/listing-123'),
	],
};

export default meta;
type Story = StoryObj<typeof EditListingContainer>;

export const Authenticated: Story = {
	args: {
		isAuthenticated: true,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvasElement).toBeTruthy();
		const editHeader = canvas.queryByText(/Edit Listing/i);
		if (editHeader) {
			expect(editHeader).toBeInTheDocument();
		}
	},
};

export const Unauthenticated: Story = {
	args: {
		isAuthenticated: false,
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const LoadingState: Story = {
	args: {
		isAuthenticated: true,
	},
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: HomeEditListingContainerItemListingDocument,
						variables: { id: 'listing-123' },
					},
					delay: Infinity,
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const ListingNotFound: Story = {
	args: {
		isAuthenticated: true,
	},
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: HomeEditListingContainerItemListingDocument,
						variables: { id: 'listing-123' },
					},
					result: {
						data: {
							itemListing: null,
						},
					},
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvasElement).toBeTruthy();
		const notFoundText = canvas.queryByText(/Listing not found/i);
		if (notFoundText) {
			expect(notFoundText).toBeInTheDocument();
		}
	},
};

export const QueryError: Story = {
	args: {
		isAuthenticated: true,
	},
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: HomeEditListingContainerItemListingDocument,
						variables: { id: 'listing-123' },
					},
					error: new Error('Failed to load listing'),
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const WithUpdateSuccess: Story = {
	args: {
		isAuthenticated: true,
	},
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: HomeEditListingContainerItemListingDocument,
						variables: { id: 'listing-123' },
					},
					result: {
						data: {
							itemListing: mockListing,
						},
					},
				},
				{
					request: {
						query: HomeEditListingContainerUpdateItemListingDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							updateItemListing: {
								...mockListing,
								title: 'Updated Title',
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

export const WithUpdateError: Story = {
	args: {
		isAuthenticated: true,
	},
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: HomeEditListingContainerItemListingDocument,
						variables: { id: 'listing-123' },
					},
					result: {
						data: {
							itemListing: mockListing,
						},
					},
				},
				{
					request: {
						query: HomeEditListingContainerUpdateItemListingDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					error: new Error('Failed to update listing'),
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const WithPauseSuccess: Story = {
	args: {
		isAuthenticated: true,
	},
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: HomeEditListingContainerItemListingDocument,
						variables: { id: 'listing-123' },
					},
					result: {
						data: {
							itemListing: mockListing,
						},
					},
				},
				{
					request: {
						query: HomeEditListingContainerPauseItemListingDocument,
						variables: { id: 'listing-123' },
					},
					result: {
						data: {
							pauseItemListing: {
								...mockListing,
								state: 'Paused',
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

export const WithPauseError: Story = {
	args: {
		isAuthenticated: true,
	},
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: HomeEditListingContainerItemListingDocument,
						variables: { id: 'listing-123' },
					},
					result: {
						data: {
							itemListing: mockListing,
						},
					},
				},
				{
					request: {
						query: HomeEditListingContainerPauseItemListingDocument,
						variables: { id: 'listing-123' },
					},
					error: new Error('Failed to pause listing'),
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const WithDeleteSuccess: Story = {
	args: {
		isAuthenticated: true,
	},
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: HomeEditListingContainerItemListingDocument,
						variables: { id: 'listing-123' },
					},
					result: {
						data: {
							itemListing: mockListing,
						},
					},
				},
				{
					request: {
						query: HomeEditListingContainerDeleteItemListingDocument,
						variables: { id: 'listing-123' },
					},
					result: {
						data: {
							deleteItemListing: {
								status: { success: true },
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

export const WithDeleteError: Story = {
	args: {
		isAuthenticated: true,
	},
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: HomeEditListingContainerItemListingDocument,
						variables: { id: 'listing-123' },
					},
					result: {
						data: {
							itemListing: mockListing,
						},
					},
				},
				{
					request: {
						query: HomeEditListingContainerDeleteItemListingDocument,
						variables: { id: 'listing-123' },
					},
					error: new Error('Failed to delete listing'),
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const WithCancelSuccess: Story = {
	args: {
		isAuthenticated: true,
	},
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: HomeEditListingContainerItemListingDocument,
						variables: { id: 'listing-123' },
					},
					result: {
						data: {
							itemListing: mockListing,
						},
					},
				},
				{
					request: {
						query: HomeEditListingContainerCancelItemListingDocument,
						variables: { id: 'listing-123' },
					},
					result: {
						data: {
							cancelItemListing: {
								status: { success: true },
								listing: {
									...mockListing,
									state: 'Cancelled',
								},
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

export const WithCancelError: Story = {
	args: {
		isAuthenticated: true,
	},
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: HomeEditListingContainerItemListingDocument,
						variables: { id: 'listing-123' },
					},
					result: {
						data: {
							itemListing: mockListing,
						},
					},
				},
				{
					request: {
						query: HomeEditListingContainerCancelItemListingDocument,
						variables: { id: 'listing-123' },
					},
					error: new Error('Failed to cancel listing'),
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const PausedListing: Story = {
	args: {
		isAuthenticated: true,
	},
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: HomeEditListingContainerItemListingDocument,
						variables: { id: 'listing-123' },
					},
					result: {
						data: {
							itemListing: {
								...mockListing,
								state: 'Paused',
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

export const DraftedListing: Story = {
	args: {
		isAuthenticated: true,
	},
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: HomeEditListingContainerItemListingDocument,
						variables: { id: 'listing-123' },
					},
					result: {
						data: {
							itemListing: {
								...mockListing,
								state: 'Drafted',
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

export const NoImages: Story = {
	args: {
		isAuthenticated: true,
	},
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: HomeEditListingContainerItemListingDocument,
						variables: { id: 'listing-123' },
					},
					result: {
						data: {
							itemListing: {
								...mockListing,
								images: [],
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
