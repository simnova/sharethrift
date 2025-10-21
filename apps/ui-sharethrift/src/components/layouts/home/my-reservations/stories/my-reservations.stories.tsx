import type { Meta, StoryObj } from '@storybook/react';
import { MockedProvider } from '@apollo/client/testing';
import {
	STORYBOOK_RESERVATION_USER_ID,
	reservationStoryMocks,
} from './reservation-story-mocks.ts';
import { defaultApolloOptions } from '../../../../../test/utils/storybook-providers.tsx';
import MyReservationsMain from '../pages/my-reservations.tsx';
import {
	HomeMyReservationsReservationsViewActiveContainerActiveReservationsDocument,
	HomeMyReservationsReservationsViewHistoryContainerPastReservationsDocument,
	ViewListingCurrentUserDocument,
} from '../../../../../generated.tsx';

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
	parameters: { layout: 'fullscreen' },
	// Global decorator that merges default + story-specific mocks
	decorators: [
		(Story, context) => {
			const storyMocks = context.parameters['apolloMocks'] ?? [];
			return (
				<MockedProvider
					mocks={[...defaultMocks, ...storyMocks]}
					{...defaultApolloOptions}
				>
					<Story />
				</MockedProvider>
			);
		},
	],
};

export default meta;
type Story = StoryObj<typeof MyReservationsMain>;

// Default needs no extra mocks
export const Default: Story = {};

// Loading only needs its delay-override
export const Loading: Story = {
	parameters: {
		apolloMocks: [
			{
				request: {
					query:
						HomeMyReservationsReservationsViewActiveContainerActiveReservationsDocument,
					variables: { userId: STORYBOOK_RESERVATION_USER_ID },
				},
				delay: 3000,
				result: { data: { myActiveReservations: [] } },
			},
		],
	},
};

// Error case
export const ReservationError: Story = {
	parameters: {
		apolloMocks: [
			{
				request: {
					query:
						HomeMyReservationsReservationsViewActiveContainerActiveReservationsDocument,
					variables: { userId: STORYBOOK_RESERVATION_USER_ID },
				},
				error: new Error('Failed to fetch reservations'),
			},
		],
	},
};

// Empty case
export const Empty: Story = {
	parameters: {
		apolloMocks: [
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
		],
	},
};
