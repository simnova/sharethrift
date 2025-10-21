import type { MockedResponse } from '@apollo/client/testing';
import type { HomeMyReservationsReservationsViewReservationRequestFieldsFragment } from '../../../../../generated.tsx';
import {
	HomeMyReservationsReservationsViewActiveContainerActiveReservationsDocument,
	HomeMyReservationsReservationsViewHistoryContainerPastReservationsDocument,
} from '../../../../../generated.tsx';

export const STORYBOOK_RESERVATION_USER_ID = 'storybook-reserver-id';

const activeReservations: HomeMyReservationsReservationsViewReservationRequestFieldsFragment[] =
	[
		{
			__typename: 'ReservationRequest',
			id: 'res-001',
			state: 'Requested',
			reservationPeriodStart: '2024-02-15T00:00:00Z',
			reservationPeriodEnd: '2024-02-22T00:00:00Z',
			createdAt: '2024-02-10T10:00:00Z',
			updatedAt: '2024-02-12T12:00:00Z',
			closeRequestedByReserver: false,
			closeRequestedBySharer: false,
			listing: {
				__typename: 'ItemListing',
				id: 'listing-1',
				title: 'Power Drill Set',
			},
			reserver: {
				__typename: 'PersonalUser',
				id: 'user-1',
				account: {
					__typename: 'PersonalUserAccount',
					username: 'sarah.j',
					profile: {
						__typename: 'PersonalUserAccountProfile',
						firstName: 'Sarah',
						lastName: 'Johnson',
					},
				},
			},
		},
		{
			__typename: 'ReservationRequest',
			id: 'res-002',
			state: 'Accepted',
			reservationPeriodStart: '2024-03-01T00:00:00Z',
			reservationPeriodEnd: '2024-03-05T00:00:00Z',
			createdAt: '2024-02-20T10:00:00Z',
			updatedAt: '2024-02-22T12:00:00Z',
			closeRequestedByReserver: false,
			closeRequestedBySharer: false,
			listing: {
				__typename: 'ItemListing',
				id: 'listing-2',
				title: 'Camping Tent',
			},
			reserver: {
				__typename: 'PersonalUser',
				id: 'user-2',
				account: {
					__typename: 'PersonalUserAccount',
					username: 'mike.b',
					profile: {
						__typename: 'PersonalUserAccountProfile',
						firstName: 'Mike',
						lastName: 'Brown',
					},
				},
			},
		},
	];

const pastReservations: HomeMyReservationsReservationsViewReservationRequestFieldsFragment[] =
	[
		{
			__typename: 'ReservationRequest',
			id: 'res-003',
			state: 'Rejected',
			reservationPeriodStart: '2024-04-10T00:00:00Z',
			reservationPeriodEnd: '2024-04-15T00:00:00Z',
			createdAt: '2024-04-01T10:00:00Z',
			updatedAt: '2024-04-02T12:00:00Z',
			closeRequestedByReserver: false,
			closeRequestedBySharer: false,
			listing: {
				__typename: 'ItemListing',
				id: 'listing-3',
				title: 'Mountain Bike',
			},
			reserver: {
				__typename: 'PersonalUser',
				id: 'user-3',
				account: {
					__typename: 'PersonalUserAccount',
					username: 'anna.l',
					profile: {
						__typename: 'PersonalUserAccountProfile',
						firstName: 'Anna',
						lastName: 'Lee',
					},
				},
			},
		},
		{
			__typename: 'ReservationRequest',
			id: 'res-004',
			state: 'Cancelled',
			reservationPeriodStart: '2024-05-01T00:00:00Z',
			reservationPeriodEnd: '2024-05-05T00:00:00Z',
			createdAt: '2024-04-20T10:00:00Z',
			updatedAt: '2024-04-22T12:00:00Z',
			closeRequestedByReserver: false,
			closeRequestedBySharer: false,
			listing: {
				__typename: 'ItemListing',
				id: 'listing-4',
				title: 'Kayak',
			},
			reserver: {
				__typename: 'PersonalUser',
				id: 'user-4',
				account: {
					__typename: 'PersonalUserAccount',
					username: 'chris.g',
					profile: {
						__typename: 'PersonalUserAccountProfile',
						firstName: 'Chris',
						lastName: 'Green',
					},
				},
			},
		},
		{
			__typename: 'ReservationRequest',
			id: 'res-005',
			state: 'Closed',
			reservationPeriodStart: '2024-06-01T00:00:00Z',
			reservationPeriodEnd: '2024-06-05T00:00:00Z',
			createdAt: '2024-05-20T10:00:00Z',
			updatedAt: '2024-05-22T12:00:00Z',
			closeRequestedByReserver: true,
			closeRequestedBySharer: false,
			listing: {
				__typename: 'ItemListing',
				id: 'listing-5',
				title: 'GoPro Camera',
			},
			reserver: {
				__typename: 'PersonalUser',
				id: 'user-5',
				account: {
					__typename: 'PersonalUserAccount',
					username: 'patricia.b',
					profile: {
						__typename: 'PersonalUserAccountProfile',
						firstName: 'Patricia',
						lastName: 'Black',
					},
				},
			},
		},
	];

export const storyReservationsActive = activeReservations;
export const storyReservationsPast = pastReservations;
export const storyReservationsAll = [
	...activeReservations,
	...pastReservations,
];

export const reservationStoryMocks: MockedResponse[] = [
	{
		request: {
			query:
				HomeMyReservationsReservationsViewActiveContainerActiveReservationsDocument,
			variables: {
				userId: STORYBOOK_RESERVATION_USER_ID,
			},
		},
		result: {
			data: {
				myActiveReservations: activeReservations,
			},
		},
	},
	{
		request: {
			query:
				HomeMyReservationsReservationsViewHistoryContainerPastReservationsDocument,
			variables: {
				userId: STORYBOOK_RESERVATION_USER_ID,
			},
		},
		result: {
			data: {
				myPastReservations: pastReservations,
			},
		},
	},
];
