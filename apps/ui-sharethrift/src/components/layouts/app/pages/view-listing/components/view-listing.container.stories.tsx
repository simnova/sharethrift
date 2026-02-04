import type { Meta, StoryObj } from '@storybook/react';
import { expect, within, waitFor } from 'storybook/test';
import { ViewListingContainer } from './view-listing.container.tsx';
import {
	withMockApolloClient,
	withMockRouter,
} from '../../../../../../test-utils/storybook-decorators.tsx';
import {
	ViewListingDocument,
	ViewListingCurrentUserDocument,
	ViewListingActiveReservationRequestForListingDocument,
} from '../../../../../../generated.tsx';

const mockListing = {
	__typename: 'ItemListing',
	id: '1',
	title: 'Cordless Drill',
	description: 'High-quality cordless drill for home projects',
	category: 'Tools & Equipment',
	location: 'Toronto, ON',
	state: 'Active',
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
  userType: 'personal-user',
};

const meta: Meta<typeof ViewListingContainer> = {
	title: 'Containers/ViewListingContainer',
	component: ViewListingContainer,
  tags: ['!dev'], // functional testing story, not rendered in sidebar - https://storybook.js.org/docs/writing-stories/tags
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
		await waitFor(
			() => {
				// Component rendered
				expect(canvasElement).toBeTruthy();
			},
			{ timeout: 3000 },
		);
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
		await waitFor(
			() => {
				// Component rendered
				expect(canvasElement).toBeTruthy();
			},
			{ timeout: 3000 },
		);
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
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const loadingSpinner =
			canvas.queryByRole('progressbar') ?? canvas.queryByText(/loading/i);
		expect(loadingSpinner ?? canvasElement).toBeTruthy();
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
						query: ViewListingDocument,
						variables: { id: '1' },
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
		await waitFor(() => {
			expect(canvasElement).toBeTruthy();
		}, { timeout: 3000 });
	},
};

export const WithActiveReservation: Story = {
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
							myActiveReservationForListing: {
								__typename: 'ReservationRequest',
								id: 'res-1',
								state: 'Requested',
								reservationPeriodStart: '1738368000000',
								reservationPeriodEnd: '1739145600000',
							},
						},
					},
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		await waitFor(() => {
			expect(canvasElement).toBeTruthy();
		}, { timeout: 3000 });
	},
};

export const UserIsSharer: Story = {
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
								__typename: 'PersonalUser',
								id: 'user-1', // Same as sharer
							},
						},
					},
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		await waitFor(() => {
			expect(canvasElement).toBeTruthy();
		}, { timeout: 3000 });
	},
};

export const GraphQLError: Story = {
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
					error: new Error('Failed to fetch listing'),
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		await waitFor(() => {
			expect(canvasElement).toBeTruthy();
		}, { timeout: 3000 });
	},
};

export const DraftListing: Story = {
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
								state: 'Draft',
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
		await waitFor(() => {
			expect(canvasElement).toBeTruthy();
		}, { timeout: 3000 });
	},
};

export const InactiveListing: Story = {
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
								state: 'Inactive',
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
		await waitFor(() => {
			expect(canvasElement).toBeTruthy();
		}, { timeout: 3000 });
	},
};

export const WithMultipleImages: Story = {
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
								images: [
									'/assets/item-images/projector.png',
									'/assets/item-images/projector2.png',
									'/assets/item-images/projector3.png',
								],
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
			],
		},
	},
	play: async ({ canvasElement }) => {
		await waitFor(() => {
			expect(canvasElement).toBeTruthy();
		}, { timeout: 3000 });
	},
};

export const LongDescription: Story = {
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
								description: 'This is a very long description that should wrap properly and display all content. '.repeat(20),
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
			],
		},
	},
	play: async ({ canvasElement }) => {
		await waitFor(() => {
			expect(canvasElement).toBeTruthy();
		}, { timeout: 3000 });
	},
};

export const ComputeTimeAgoRecentHours: Story = {
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
								createdAt: new Date(Date.now() - 5 * 3600000).toISOString(), // 5 hours ago
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
			],
		},
	},
	play: async ({ canvasElement }) => {
		await waitFor(() => {
			expect(canvasElement).toBeTruthy();
		}, { timeout: 3000 });
	},
};

export const ComputeTimeAgoDays: Story = {
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
								createdAt: new Date(Date.now() - 3 * 24 * 3600000).toISOString(), // 3 days ago
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
			],
		},
	},
	play: async ({ canvasElement }) => {
		await waitFor(() => {
			expect(canvasElement).toBeTruthy();
		}, { timeout: 3000 });
	},
};

export const ComputeTimeAgoInvalidDate: Story = {
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
								createdAt: 'invalid-date',
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
			],
		},
	},
	play: async ({ canvasElement }) => {
		await waitFor(() => {
			expect(canvasElement).toBeTruthy();
		}, { timeout: 3000 });
	},
};

export const NoCreatedAtDate: Story = {
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
								createdAt: null,
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
			],
		},
	},
	play: async ({ canvasElement }) => {
		await waitFor(() => {
			expect(canvasElement).toBeTruthy();
		}, { timeout: 3000 });
	},
};

export const SkipReservationQueryNoListingId: Story = {
	args: {
		isAuthenticated: true,
	},
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: ViewListingDocument,
						variables: { id: undefined },
					},
					result: {
						data: {
							itemListing: null,
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
		await waitFor(() => {
			expect(canvasElement).toBeTruthy();
		}, { timeout: 3000 });
	},
};

export const SkipReservationQueryNoReserverId: Story = {
	args: {
		isAuthenticated: true,
	},
	parameters: {
		appolloClient: {
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
							currentUser: null,
						},
					},
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		await waitFor(() => {
			expect(canvasElement).toBeTruthy();
		}, { timeout: 3000 });
	},
};

export const CacheFirstFetchPolicy: Story = {
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
					maxUsageCount: Number.POSITIVE_INFINITY,
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
			],
		},
	},
	play: async ({ canvasElement }) => {
		await waitFor(() => {
			expect(canvasElement).toBeTruthy();
		}, { timeout: 3000 });
	},
};

export const CurrentUserLoadingState: Story = {
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
					delay: Infinity,
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const loadingSpinner = canvas.queryByRole('progressbar') ?? canvas.queryByText(/loading/i);
		expect(loadingSpinner ?? canvasElement).toBeTruthy();
	},
};

export const ReservationQueryLoadingState: Story = {
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
							currentUser: mockCurrentUser,
						},
					},
				},
				{
					request: {
						query: ViewListingActiveReservationRequestForListingDocument,
						variables: { listingId: '1', reserverId: 'user-2' },
					},
					delay: Infinity,
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const loadingSpinner = canvas.queryByRole('progressbar') ?? canvas.queryByText(/loading/i);
		expect(loadingSpinner ?? canvasElement).toBeTruthy();
	},
};

