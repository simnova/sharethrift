import type { Meta, StoryObj } from '@storybook/react';
import { expect } from 'storybook/test';
import { ListingInformationContainer } from './listing-information.container.tsx';
import {
	withMockApolloClient,
	withMockRouter,
} from '../../../../../../test-utils/storybook-decorators.tsx';
import {
	ViewListingCurrentUserDocument,
	ViewListingQueryActiveByListingIdDocument,
	HomeListingInformationCreateReservationRequestDocument,
	HomeListingInformationCancelReservationRequestDocument,
	ViewListingActiveReservationRequestForListingDocument,
} from '../../../../../../generated.tsx';
import { clickCancelThenConfirm } from '../../../../../../test-utils/popconfirm-test-utils.ts';

const buildBaseListingMocks = () => [
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
			query: ViewListingQueryActiveByListingIdDocument,
			variables: { listingId: '1' },
		},
		result: {
			data: {
				queryActiveByListingId: [],
			},
		},
	},
];

const mockListing = {
	__typename: 'ItemListing' as const,
	listingType: 'item-listing' as const,
	id: '1',
	title: 'Cordless Drill',
	description: 'High-quality cordless drill for home projects',
	category: 'Tools & Equipment',
	location: 'Toronto, ON',
	state: 'Published' as const,
	images: ['/assets/item-images/projector.png'],
	sharingPeriodStart: new Date('2025-01-01'),
	sharingPeriodEnd: new Date('2025-12-31'),
	createdAt: new Date('2025-01-01T00:00:00Z'),
	updatedAt: new Date('2025-01-01T00:00:00Z'),
};

const mockCurrentUser = {
	__typename: 'PersonalUser',
	id: 'user-2',
};

const meta: Meta<typeof ListingInformationContainer> = {
	title: 'Containers/ListingInformationContainer',
	component: ListingInformationContainer,
	parameters: {
		layout: 'padded',
		apolloClient: {
			mocks: [
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
						query: ViewListingQueryActiveByListingIdDocument,
						variables: { listingId: '1' },
					},
					result: {
						data: {
							queryActiveByListingId: [],
						},
					},
				},
				{
					request: {
						query: HomeListingInformationCreateReservationRequestDocument,
						variables: {
							input: {
								listingId: '1',
								reservationPeriodStart: expect.any(String),
								reservationPeriodEnd: expect.any(String),
							},
						},
					},
					result: {
						data: {
							createReservationRequest: {
								__typename: 'ReservationRequest',
								id: 'res-1',
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
type Story = StoryObj<typeof ListingInformationContainer>;

export const AuthenticatedUser: Story = {
	args: {
		listing: mockListing,
		userIsSharer: false,
		isAuthenticated: true,
		userReservationRequest: null,
		onLoginClick: () => {},
		onSignUpClick: () => {},
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const UnauthenticatedUser: Story = {
	args: {
		listing: mockListing,
		userIsSharer: false,
		isAuthenticated: false,
		userReservationRequest: null,
		onLoginClick: () => {},
		onSignUpClick: () => {},
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const SharerView: Story = {
	args: {
		listing: mockListing,
		userIsSharer: true,
		isAuthenticated: true,
		userReservationRequest: null,
		onLoginClick: () => {},
		onSignUpClick: () => {},
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const WithExistingReservation: Story = {
	args: {
		listing: mockListing,
		userIsSharer: false,
		isAuthenticated: true,
		userReservationRequest: {
			__typename: 'ReservationRequest' as const,
			id: 'res-1',
			state: 'Requested' as const,
			reservationPeriodStart: '2025-02-01',
			reservationPeriodEnd: '2025-02-10',
		},
		onLoginClick: () => {},
		onSignUpClick: () => {},
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const CancelReservationSuccess: Story = {
	args: {
		listing: mockListing,
		userIsSharer: false,
		isAuthenticated: true,
		userReservationRequest: {
			__typename: 'ReservationRequest' as const,
			id: 'res-cancel-1',
			state: 'Requested' as const,
			reservationPeriodStart: '2025-02-01',
			reservationPeriodEnd: '2025-02-10',
		},
	},
	parameters: {
		apolloClient: {
			mocks: [
				...buildBaseListingMocks(),
				{
					request: {
						query: HomeListingInformationCancelReservationRequestDocument,
						variables: {
							input: {
								id: 'res-cancel-1',
							},
						},
					},
					result: {
						data: {
							cancelReservation: {
								__typename: 'ReservationRequest',
								id: 'res-cancel-1',
								state: 'Cancelled',
							},
						},
					},
				},
				{
					request: {
						query: ViewListingActiveReservationRequestForListingDocument,
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
		await expect(canvasElement).toBeTruthy();
		await clickCancelThenConfirm(canvasElement);
	},
};

export const CancelReservationError: Story = {
	args: {
		listing: mockListing,
		userIsSharer: false,
		isAuthenticated: true,
		userReservationRequest: {
			__typename: 'ReservationRequest' as const,
			id: 'res-cancel-error',
			state: 'Requested' as const,
			reservationPeriodStart: '2025-02-01',
			reservationPeriodEnd: '2025-02-10',
		},
	},
	parameters: {
		apolloClient: {
			mocks: [
				...buildBaseListingMocks(),
				{
					request: {
						query: HomeListingInformationCancelReservationRequestDocument,
						variables: {
							input: {
								id: 'res-cancel-error',
							},
						},
					},
					error: new Error(
						'Only the reserver can cancel their reservation request',
					),
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
		await clickCancelThenConfirm(canvasElement);
	},
};

export const CancelReservationLoading: Story = {
	args: {
		listing: mockListing,
		userIsSharer: false,
		isAuthenticated: true,
		userReservationRequest: {
			__typename: 'ReservationRequest' as const,
			id: 'res-cancel-loading',
			state: 'Requested' as const,
			reservationPeriodStart: '2025-02-01',
			reservationPeriodEnd: '2025-02-10',
		},
	},
	parameters: {
		apolloClient: {
			mocks: [
				...buildBaseListingMocks(),
				{
					request: {
						query: HomeListingInformationCancelReservationRequestDocument,
						variables: {
							input: {
								id: 'res-cancel-loading',
							},
						},
					},
					delay: 200, // Brief delay to verify loading state without slowing tests
					result: {
						data: {
							cancelReservation: {
								__typename: 'ReservationRequest',
								id: 'res-cancel-loading',
								state: 'Cancelled',
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
