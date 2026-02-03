import type { Meta, StoryObj } from '@storybook/react';
import { withMockApolloClient } from '../../../../../../test-utils/storybook-decorators.tsx';
import {
	STORYBOOK_RESERVATION_USER_ID,
	reservationStoryMocks,
} from '../utils/reservation-story-mocks.ts';
import { MyReservationsMain } from '../pages/my-reservations.tsx';
import {
	HomeMyReservationsReservationsViewActiveContainerActiveReservationsDocument,
	HomeMyReservationsReservationsViewHistoryContainerPastReservationsDocument,
	ViewListingCurrentUserDocument,
} from '../../../../../../generated.tsx';
// Default mocks that all stories get automatically
const defaultMocks = [
	// Always mock the current user
	{
		request: { query: ViewListingCurrentUserDocument },
		result: {
			data: {
				currentPersonalUserAndCreateIfNotExists: {
					__typename: 'PersonalUser',
					id: STORYBOOK_RESERVATION_USER_ID,
				},
			},
		},
	},
	// Plus common reservation mocks
	...reservationStoryMocks,
];

const meta: Meta<typeof MyReservationsMain> = {
	title: 'Pages/MyReservations/Main',
	component: MyReservationsMain,
	parameters: {
		layout: 'fullscreen',
		apolloClient: {
			mocks: defaultMocks,
		},
	},
	decorators: [withMockApolloClient],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default needs no extra mocks
export const Default: Story = {};

// Loading only needs its delay-override
export const Loading: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query:
							HomeMyReservationsReservationsViewActiveContainerActiveReservationsDocument,
						variables: { userId: STORYBOOK_RESERVATION_USER_ID },
					},
					delay: 3000,
					result: { data: { myActiveReservations: [] } },
				},
				...defaultMocks,
			],
		},
	},
};

// Error case
export const ReservationError: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query:
							HomeMyReservationsReservationsViewActiveContainerActiveReservationsDocument,
						variables: { userId: STORYBOOK_RESERVATION_USER_ID },
					},
					error: new Error('Failed to fetch reservations'),
				},
				...defaultMocks,
			],
		},
	},
};

// Empty case
export const Empty: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query:
							HomeMyReservationsReservationsViewActiveContainerActiveReservationsDocument,
						variables: { userId: STORYBOOK_RESERVATION_USER_ID },
					},
					result: { data: { myActiveReservations: [] } },
				},
				{
					request: {
						query:
							HomeMyReservationsReservationsViewHistoryContainerPastReservationsDocument,
						variables: { userId: STORYBOOK_RESERVATION_USER_ID },
					},
					result: { data: { myPastReservations: [] } },
				},
				...defaultMocks,
			],
		},
	},
};
