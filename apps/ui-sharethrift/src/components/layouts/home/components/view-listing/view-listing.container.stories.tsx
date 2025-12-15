import type { Meta, StoryObj } from '@storybook/react';
import { expect } from 'storybook/test';
import {
	BlockListingContainerBlockListingDocument,
	BlockListingContainerUnblockListingDocument,
	ViewListingActiveReservationRequestForListingDocument,
	ViewListingCurrentUserDocument,
	ViewListingDocument,
} from '../../../../../generated.tsx';
import {
	withMockApolloClient,
	withMockRouter,
} from '../../../../../test-utils/storybook-decorators.tsx';
import { ViewListingContainer } from './view-listing.container.tsx';

const mockListing = {
	__typename: 'ItemListing',
	id: '1',
	title: 'Cordless Drill',
	description: 'High-quality cordless drill for home projects',
	category: 'Tools & Equipment',
	location: 'Toronto, ON',
	state: 'Published',
	images: ['/assets/item-images/projector.png'],
	sharingPeriodStart: '2025-01-01',
	sharingPeriodEnd: '2025-12-31',
	createdAt: '2025-01-01T00:00:00Z',
	updatedAt: '2025-01-01T00:00:00Z',
	sharer: {
		__typename: 'PersonalUser',
		id: 'user-1',
		profile: {
			firstName: 'John',
			lastName: 'Doe',
		},
	},
};

const mockCurrentUser = {
	__typename: 'PersonalUser',
	id: 'user-2',
	userIsAdmin: false,
};

const meta: Meta<typeof ViewListingContainer> = {
	title: 'Containers/ViewListingContainer',
	component: ViewListingContainer,
	parameters: {
		layout: 'fullscreen',
		apolloClient: {
			mocks: [
				{
					request: {
						query: ViewListingDocument,
						variables: { id: '1' },
					},
					result: {
						data: {
							itemListing: mockListing,
						},
					},
				},
				{
					request: {
						query: ViewListingCurrentUserDocument,
					},
					result: {
						data: {
							currentUser: mockCurrentUser,
						},
					},
				},
				{
					request: {
						query: ViewListingActiveReservationRequestForListingDocument,
						variables: { listingId: '1', reserverId: 'user-2' },
					},
					result: {
						data: {
							myActiveReservationForListing: null,
						},
					},
				},
				{
					request: {
						query: BlockListingContainerBlockListingDocument,
						variables: { id: '1' },
					},
					result: {
						data: {
							blockListing: {
								id: '1',
								state: 'Blocked',
							},
						},
					},
				},
				{
					request: {
						query: BlockListingContainerUnblockListingDocument,
						variables: { id: '1' },
					},
					result: {
						data: {
							unblockListing: {
								id: '1',
								state: 'Published',
							},
						},
					},
				},
			],
		},
	},
	decorators: [withMockApolloClient, withMockRouter('/listing/1')],
};

export default meta;
type Story = StoryObj<typeof ViewListingContainer>;

export const Authenticated: Story = {
	args: {
		isAuthenticated: true,
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const Unauthenticated: Story = {
	args: {
		isAuthenticated: false,
	},
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: ViewListingDocument,
						variables: { id: '1' },
					},
					result: {
						data: {
							itemListing: mockListing,
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
	args: {
		isAuthenticated: true,
	},
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: ViewListingDocument,
						variables: { id: '1' },
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

export const AdminUser: Story = {
	args: {
		isAuthenticated: true,
	},
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: ViewListingDocument,
						variables: { id: '1' },
					},
					result: {
						data: {
							itemListing: mockListing,
						},
					},
				},
				{
					request: {
						query: ViewListingCurrentUserDocument,
					},
					result: {
						data: {
							currentUser: {
								...mockCurrentUser,
								userIsAdmin: true,
							},
						},
					},
				},
				{
					request: {
						query: ViewListingActiveReservationRequestForListingDocument,
						variables: { listingId: '1', reserverId: 'user-2' },
					},
					result: {
						data: {
							myActiveReservationForListing: null,
						},
					},
				},
				{
					request: {
						query: BlockListingContainerBlockListingDocument,
						variables: { id: '1' },
					},
					result: {
						data: {
							blockListing: {
								id: '1',
								state: 'Blocked',
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

export const BlockedListing: Story = {
	args: {
		isAuthenticated: true,
	},
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: ViewListingDocument,
						variables: { id: '1' },
					},
					result: {
						data: {
							itemListing: {
								...mockListing,
								state: 'Blocked',
							},
						},
					},
				},
				{
					request: {
						query: ViewListingCurrentUserDocument,
					},
					result: {
						data: {
							currentUser: mockCurrentUser,
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

export const BlockedListingAsAdmin: Story = {
	args: {
		isAuthenticated: true,
	},
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: ViewListingDocument,
						variables: { id: '1' },
					},
					result: {
						data: {
							itemListing: {
								...mockListing,
								state: 'Blocked',
							},
						},
					},
				},
				{
					request: {
						query: ViewListingCurrentUserDocument,
					},
					result: {
						data: {
							currentUser: {
								...mockCurrentUser,
								userIsAdmin: true,
							},
						},
					},
				},
				{
					request: {
						query: ViewListingActiveReservationRequestForListingDocument,
						variables: { listingId: '1', reserverId: 'user-2' },
					},
					result: {
						data: {
							myActiveReservationForListing: null,
						},
					},
				},
				{
					request: {
						query: BlockListingContainerUnblockListingDocument,
						variables: { id: '1' },
					},
					result: {
						data: {
							unblockListing: {
								id: '1',
								state: 'Published',
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
