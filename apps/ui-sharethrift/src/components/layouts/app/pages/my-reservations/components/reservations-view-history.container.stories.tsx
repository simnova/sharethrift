import type { Meta, StoryObj } from '@storybook/react';
import { expect } from 'storybook/test';
import { ReservationsViewHistoryContainer } from './reservations-view-history.container.tsx';
import {
	withMockApolloClient,
	withMockRouter,
} from '../../../../../../test-utils/storybook-decorators.tsx';
import {
	ViewListingCurrentUserDocument,
	HomeMyReservationsReservationsViewHistoryContainerPastReservationsDocument,
} from '../../../../../../generated.tsx';

const mockUser = {
	__typename: 'PersonalUser',
	id: 'user-1',
	userType: 'personal-user',
};

const mockPastReservations = [
	{
		__typename: 'ReservationRequest',
		id: '1',
		state: 'Completed',
		requestMessage: 'I would like to borrow this item',
		responseMessage: 'Enjoy!',
		reservationPeriodStart: '2024-12-01',
		reservationPeriodEnd: '2024-12-10',
		createdAt: '2024-11-25T00:00:00Z',
		updatedAt: '2024-12-10T00:00:00Z',
		listing: {
			__typename: 'ItemListing',
			id: 'listing-1',
			title: 'Cordless Drill',
			images: ['/assets/item-images/projector.png'],
		},
		reserver: {
			__typename: 'PersonalUser',
			id: 'user-1',
			account: {
				__typename: 'PersonalUserAccount',
				username: 'john_doe',
				profile: {
					__typename: 'PersonalUserAccountProfile',
					firstName: 'John',
					lastName: 'Doe',
				},
			},
		},
		closeRequestedBySharer: false,
		closeRequestedByReserver: false,
	},
	{
		__typename: 'ReservationRequest',
		id: '2',
		state: 'Cancelled',
		requestMessage: 'Needed for weekend project',
		responseMessage: null,
		reservationPeriodStart: '2024-11-15',
		reservationPeriodEnd: '2024-11-20',
		createdAt: '2024-11-10T00:00:00Z',
		updatedAt: '2024-11-12T00:00:00Z',
		listing: {
			__typename: 'ItemListing',
			id: 'listing-2',
			title: 'Electric Guitar',
			images: ['/assets/item-images/projector.png'],
		},
		reserver: {
			__typename: 'PersonalUser',
			id: 'user-1',
			account: {
				__typename: 'PersonalUserAccount',
				username: 'john_doe',
				profile: {
					__typename: 'PersonalUserAccountProfile',
					firstName: 'John',
					lastName: 'Doe',
				},
			},
		},
		closeRequestedBySharer: false,
		closeRequestedByReserver: false,
	},
];

const meta: Meta = {
	title: 'Containers/ReservationsViewHistoryContainer',
	tags: ['!dev'], // functional testing story, not rendered in sidebar - https://storybook.js.org/docs/writing-stories/tags. These are all functional testing stories.

	component: ReservationsViewHistoryContainer,
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
							HomeMyReservationsReservationsViewHistoryContainerPastReservationsDocument,
						variables: { userId: 'user-1' },
					},
					result: {
						data: {
							myPastReservations: mockPastReservations,
						},
					},
				},
			],
		},
	},
	decorators: [
		withMockApolloClient,
		withMockRouter('/my-reservations/history'),
	],
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
						query:
							HomeMyReservationsReservationsViewHistoryContainerPastReservationsDocument,
						variables: { userId: 'user-1' },
					},
					result: {
						data: {
							myPastReservations: [],
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
