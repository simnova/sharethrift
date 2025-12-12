import type { Meta, StoryObj } from '@storybook/react';
import { expect } from 'storybook/test';
import { ReservationsViewActiveContainer } from './reservations-view-active.container.tsx';
import {
	withMockApolloClient,
	withMockRouter,
} from '../../../../../test-utils/storybook-decorators.tsx';
import {
	ViewListingCurrentUserDocument,
	HomeMyReservationsReservationsViewActiveContainerActiveReservationsDocument,
	HomeMyReservationsReservationsViewActiveContainerCancelReservationDocument,
	HomeMyReservationsReservationsViewActiveContainerCloseReservationDocument,
} from '../../../../../generated.tsx';

const mockUser = {
	__typename: 'PersonalUser',
	id: 'user-1',
};

const mockActiveReservations = [
	{
		__typename: 'ReservationRequest',
		id: '1',
		state: 'Pending',
		requestMessage: 'I would like to borrow this item',
		responseMessage: null,
		reservationPeriodStart: '2025-01-20',
		reservationPeriodEnd: '2025-01-25',
		createdAt: '2025-01-15T00:00:00Z',
		updatedAt: '2025-01-15T00:00:00Z',
		listing: {
			__typename: 'ItemListing',
			id: 'listing-1',
			title: 'Cordless Drill',
			images: ['/assets/item-images/projector.png'],
		},
		reserver: {
			__typename: 'PersonalUser',
			id: 'user-1',
			profile: { firstName: 'John', lastName: 'Doe' },
		},
	},
];

const meta: Meta = {
	title: 'Containers/ReservationsViewActiveContainer',
	component: ReservationsViewActiveContainer,
	parameters: {
		layout: 'fullscreen',
		apolloClient: {
			mocks: [
				{
					request: {
						query: ViewListingCurrentUserDocument,
					},
					result: {
						data: {
							currentUser: mockUser,
						},
					},
				},
				{
					request: {
						query: HomeMyReservationsReservationsViewActiveContainerActiveReservationsDocument,
						variables: { userId: 'user-1' },
					},
					result: {
						data: {
							myActiveReservations: mockActiveReservations,
						},
					},
				},
				{
					request: {
						query: HomeMyReservationsReservationsViewActiveContainerCancelReservationDocument,
						variables: { input: { id: '1' } },
					},
					result: {
						data: {
							cancelReservation: { __typename: 'ReservationRequest', id: '1' },
						},
					},
				},
				{
					request: {
						query: HomeMyReservationsReservationsViewActiveContainerCloseReservationDocument,
						variables: { input: { id: '1' } },
					},
					result: {
						data: {
							closeReservation: { __typename: 'ReservationRequest', id: '1' },
						},
					},
				},
			],
		},
	},
	decorators: [withMockApolloClient, withMockRouter('/my-reservations/active')],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const Empty: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: ViewListingCurrentUserDocument,
					},
					result: {
						data: {
							currentUser: mockUser,
						},
					},
				},
				{
					request: {
						query: HomeMyReservationsReservationsViewActiveContainerActiveReservationsDocument,
						variables: { userId: 'user-1' },
					},
					result: {
						data: {
							myActiveReservations: [],
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
						query: ViewListingCurrentUserDocument,
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

export const UserError: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: ViewListingCurrentUserDocument,
					},
					error: new Error('Failed to load user'),
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const ReservationsError: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: ViewListingCurrentUserDocument,
					},
					result: {
						data: {
							currentUser: mockUser,
						},
					},
				},
				{
					request: {
						query: HomeMyReservationsReservationsViewActiveContainerActiveReservationsDocument,
						variables: { userId: 'user-1' },
					},
					error: new Error('Failed to load reservations'),
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const NoUserId: Story = {
	parameters: {
		apolloClient: {
			mocks: [
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
		await expect(canvasElement).toBeTruthy();
	},
};

export const CancelSuccess: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: ViewListingCurrentUserDocument,
					},
					result: {
						data: {
							currentUser: mockUser,
						},
					},
				},
				{
					request: {
						query: HomeMyReservationsReservationsViewActiveContainerActiveReservationsDocument,
						variables: { userId: 'user-1' },
					},
					result: {
						data: {
							myActiveReservations: mockActiveReservations,
						},
					},
				},
				{
					request: {
						query: HomeMyReservationsReservationsViewActiveContainerCancelReservationDocument,
						variables: () => true,
					},
					result: {
						data: {
							cancelReservation: { __typename: 'ReservationRequest', id: '1' },
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

export const CancelError: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: ViewListingCurrentUserDocument,
					},
					result: {
						data: {
							currentUser: mockUser,
						},
					},
				},
				{
					request: {
						query: HomeMyReservationsReservationsViewActiveContainerActiveReservationsDocument,
						variables: { userId: 'user-1' },
					},
					result: {
						data: {
							myActiveReservations: mockActiveReservations,
						},
					},
				},
				{
					request: {
						query: HomeMyReservationsReservationsViewActiveContainerCancelReservationDocument,
						variables: () => true,
					},
					error: new Error('Failed to cancel reservation'),
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const CloseSuccess: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: ViewListingCurrentUserDocument,
					},
					result: {
						data: {
							currentUser: mockUser,
						},
					},
				},
				{
					request: {
						query: HomeMyReservationsReservationsViewActiveContainerActiveReservationsDocument,
						variables: { userId: 'user-1' },
					},
					result: {
						data: {
							myActiveReservations: mockActiveReservations,
						},
					},
				},
				{
					request: {
						query: HomeMyReservationsReservationsViewActiveContainerCloseReservationDocument,
						variables: () => true,
					},
					result: {
						data: {
							closeReservation: { __typename: 'ReservationRequest', id: '1' },
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

export const CloseError: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: ViewListingCurrentUserDocument,
					},
					result: {
						data: {
							currentUser: mockUser,
						},
					},
				},
				{
					request: {
						query: HomeMyReservationsReservationsViewActiveContainerActiveReservationsDocument,
						variables: { userId: 'user-1' },
					},
					result: {
						data: {
							myActiveReservations: mockActiveReservations,
						},
					},
				},
				{
					request: {
						query: HomeMyReservationsReservationsViewActiveContainerCloseReservationDocument,
						variables: () => true,
					},
					error: new Error('Failed to close reservation'),
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const ReservationsLoading: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: ViewListingCurrentUserDocument,
					},
					result: {
						data: {
							currentUser: mockUser,
						},
					},
				},
				{
					request: {
						query: HomeMyReservationsReservationsViewActiveContainerActiveReservationsDocument,
						variables: { userId: 'user-1' },
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
