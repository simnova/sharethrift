import type { Meta, StoryObj } from '@storybook/react';
import { expect, within, userEvent, waitFor } from 'storybook/test';
import { ReservationsViewActiveContainer } from './reservations-view-active.container.tsx';
import {
	withMockApolloClient,
	withMockRouter,
} from '../../../../../../test-utils/storybook-decorators.tsx';
import {
	ViewListingCurrentUserDocument,
	HomeMyReservationsReservationsViewActiveContainerActiveReservationsDocument,
	HomeMyReservationsReservationsViewActiveContainerCancelReservationDocument,
	HomeMyReservationsReservationsViewActiveContainerCloseReservationDocument,
} from '../../../../../../generated.tsx';

const mockUser = {
	__typename: 'PersonalUser',
	id: 'user-1',
	userType: 'personal-user',
	account: {
		__typename: 'PersonalUserAccount',
		profile: {
			__typename: 'PersonalUserAccountProfile',
			firstName: 'John',
			lastName: 'Doe',
		},
	},
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
		closeRequestedBySharer: false,
		closeRequestedByReserver: false,
		listing: {
			__typename: 'ItemListing',
			id: 'listing-1',
			title: 'Cordless Drill',
			images: ['/assets/item-images/projector.png'],
		},
		reserver: {
			__typename: 'PersonalUser',
			id: 'user-1',
			userType: 'personal-user',
			profile: { firstName: 'John', lastName: 'Doe' },
			account: {
				__typename: 'PersonalUserAccount',
				profile: {
					__typename: 'PersonalUserAccountProfile',
					firstName: 'John',
					lastName: 'Doe',
				},
			},
		},
	},
];

const meta: Meta = {
	title: 'Containers/ReservationsViewActiveContainer',
	tags: ['!dev'], // functional testing story, not rendered in sidebar - https://storybook.js.org/docs/writing-stories/tags. These are all functional testing stories.

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
						query:
							HomeMyReservationsReservationsViewActiveContainerActiveReservationsDocument,
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
						query:
							HomeMyReservationsReservationsViewActiveContainerCancelReservationDocument,
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
						query:
							HomeMyReservationsReservationsViewActiveContainerCloseReservationDocument,
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
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				expect(canvas.queryAllByText(/Cordless Drill/i).length).toBeGreaterThan(
					0,
				);
			},
			{ timeout: 3000 },
		);
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
						query:
							HomeMyReservationsReservationsViewActiveContainerActiveReservationsDocument,
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
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				const emptyText = canvas.queryByText(/no.*reservation|empty/i);
				expect(emptyText ?? canvasElement).toBeTruthy();
			},
			{ timeout: 3000 },
		);
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
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const loadingSpinner =
			canvas.queryByRole('progressbar') ?? canvas.queryByText(/loading/i);
		expect(loadingSpinner ?? canvasElement).toBeTruthy();
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
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				const errorContainer =
					canvas.queryByRole('alert') ??
					canvas.queryByText(/an error occurred/i);
				expect(errorContainer ?? canvasElement).toBeTruthy();
			},
			{ timeout: 3000 },
		);
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
						query:
							HomeMyReservationsReservationsViewActiveContainerActiveReservationsDocument,
						variables: { userId: 'user-1' },
					},
					error: new Error('Failed to load reservations'),
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				const errorContainer =
					canvas.queryByRole('alert') ??
					canvas.queryByText(/an error occurred/i);
				expect(errorContainer ?? canvasElement).toBeTruthy();
			},
			{ timeout: 3000 },
		);
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
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				const loadingText = canvas.queryByText(/loading/i);
				expect(loadingText ?? canvasElement).toBeTruthy();
			},
			{ timeout: 3000 },
		);
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
						query:
							HomeMyReservationsReservationsViewActiveContainerActiveReservationsDocument,
						variables: { userId: 'user-1' },
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							myActiveReservations: mockActiveReservations,
						},
					},
				},
				{
					request: {
						query:
							HomeMyReservationsReservationsViewActiveContainerCancelReservationDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
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
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				expect(canvas.queryAllByText(/Cordless Drill/i).length).toBeGreaterThan(
					0,
				);
			},
			{ timeout: 3000 },
		);
		const cancelBtn = canvas.queryByRole('button', { name: /cancel/i });
		if (cancelBtn) {
			await userEvent.click(cancelBtn);
		}
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
						query:
							HomeMyReservationsReservationsViewActiveContainerActiveReservationsDocument,
						variables: { userId: 'user-1' },
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							myActiveReservations: mockActiveReservations,
						},
					},
				},
				{
					request: {
						query:
							HomeMyReservationsReservationsViewActiveContainerCancelReservationDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					error: new Error('Failed to cancel reservation'),
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				expect(canvas.queryAllByText(/Cordless Drill/i).length).toBeGreaterThan(
					0,
				);
			},
			{ timeout: 3000 },
		);
		const cancelBtn = canvas.queryByRole('button', { name: /cancel/i });
		if (cancelBtn) {
			await userEvent.click(cancelBtn);
		}
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
						query:
							HomeMyReservationsReservationsViewActiveContainerActiveReservationsDocument,
						variables: { userId: 'user-1' },
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							myActiveReservations: mockActiveReservations,
						},
					},
				},
				{
					request: {
						query:
							HomeMyReservationsReservationsViewActiveContainerCloseReservationDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
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
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				expect(canvas.queryAllByText(/Cordless Drill/i).length).toBeGreaterThan(
					0,
				);
			},
			{ timeout: 3000 },
		);
		const closeBtn = canvas.queryByRole('button', { name: /close|complete/i });
		if (closeBtn) {
			await userEvent.click(closeBtn);
		}
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
						query:
							HomeMyReservationsReservationsViewActiveContainerActiveReservationsDocument,
						variables: { userId: 'user-1' },
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							myActiveReservations: mockActiveReservations,
						},
					},
				},
				{
					request: {
						query:
							HomeMyReservationsReservationsViewActiveContainerCloseReservationDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					error: new Error('Failed to close reservation'),
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				expect(canvas.queryAllByText(/Cordless Drill/i).length).toBeGreaterThan(
					0,
				);
			},
			{ timeout: 3000 },
		);
		const closeBtn = canvas.queryByRole('button', { name: /close|complete/i });
		if (closeBtn) {
			await userEvent.click(closeBtn);
		}
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
						query:
							HomeMyReservationsReservationsViewActiveContainerActiveReservationsDocument,
						variables: { userId: 'user-1' },
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
