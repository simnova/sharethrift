import type { MockedResponse } from '@apollo/client/testing';
import type { HomeMyReservationsReservationsViewReservationRequestFieldsFragment } from '../../../../../generated.tsx';
import {
	HomeMyReservationsReservationsViewActiveContainerActiveReservationsDocument,
	HomeMyReservationsReservationsViewHistoryContainerPastReservationsDocument,
} from '../../../../../generated.tsx';

export const STORYBOOK_RESERVATION_USER_ID = 'storybook-reserver-id';

/**
 * Factory function to create reservation mock data with defaults
 */
function makeReservation({
	id,
	state,
	listing,
	user,
	reservationPeriodStart = '2024-01-01T00:00:00Z',
	reservationPeriodEnd = '2024-01-02T00:00:00Z',
	createdAt = '2024-01-01T00:00:00Z',
	updatedAt = '2024-01-01T00:00:00Z',
	closeRequestedByReserver = false,
	closeRequestedBySharer = false,
}: {
	id: string;
	state: HomeMyReservationsReservationsViewReservationRequestFieldsFragment['state'];
	listing: { id: string; title: string };
	user: { id: string; username: string; firstName: string; lastName: string };
	reservationPeriodStart?: string;
	reservationPeriodEnd?: string;
	createdAt?: string;
	updatedAt?: string;
	closeRequestedByReserver?: boolean;
	closeRequestedBySharer?: boolean;
}): HomeMyReservationsReservationsViewReservationRequestFieldsFragment {
	return {
		__typename: 'ReservationRequest',
		id,
		state,
		reservationPeriodStart,
		reservationPeriodEnd,
		createdAt,
		updatedAt,
		closeRequestedByReserver,
		closeRequestedBySharer,
		listing: { __typename: 'ItemListing', ...listing },
		reserver: {
			__typename: 'PersonalUser',
			id: user.id,
			account: {
				__typename: 'PersonalUserAccount',
				username: user.username,
				profile: {
					__typename: 'PersonalUserAccountProfile',
					firstName: user.firstName,
					lastName: user.lastName,
				},
			},
		},
	};
}

const activeReservations: HomeMyReservationsReservationsViewReservationRequestFieldsFragment[] = [
	makeReservation({
		id: 'res-001',
		state: 'Requested',
		listing: { id: 'listing-1', title: 'Power Drill Set' },
		user: {
			id: 'user-1',
			username: 'sarah.j',
			firstName: 'Sarah',
			lastName: 'Johnson',
		},
		reservationPeriodStart: '2024-02-15T00:00:00Z',
		reservationPeriodEnd: '2024-02-22T00:00:00Z',
		createdAt: '2024-02-10T10:00:00Z',
		updatedAt: '2024-02-12T12:00:00Z',
	}),
	makeReservation({
		id: 'res-002',
		state: 'Accepted',
		listing: { id: 'listing-2', title: 'Camping Tent' },
		user: {
			id: 'user-2',
			username: 'mike.b',
			firstName: 'Mike',
			lastName: 'Brown',
		},
		reservationPeriodStart: '2024-03-01T00:00:00Z',
		reservationPeriodEnd: '2024-03-05T00:00:00Z',
		createdAt: '2024-02-20T10:00:00Z',
		updatedAt: '2024-02-22T12:00:00Z',
	}),
];

const pastReservations: HomeMyReservationsReservationsViewReservationRequestFieldsFragment[] = [
	makeReservation({
		id: 'res-003',
		state: 'Rejected',
		listing: { id: 'listing-3', title: 'Mountain Bike' },
		user: {
			id: 'user-3',
			username: 'anna.l',
			firstName: 'Anna',
			lastName: 'Lee',
		},
		reservationPeriodStart: '2024-04-10T00:00:00Z',
		reservationPeriodEnd: '2024-04-15T00:00:00Z',
		createdAt: '2024-04-01T10:00:00Z',
		updatedAt: '2024-04-02T12:00:00Z',
	}),
	makeReservation({
		id: 'res-004',
		state: 'Cancelled',
		listing: { id: 'listing-4', title: 'Kayak' },
		user: {
			id: 'user-4',
			username: 'chris.g',
			firstName: 'Chris',
			lastName: 'Green',
		},
		reservationPeriodStart: '2024-05-01T00:00:00Z',
		reservationPeriodEnd: '2024-05-05T00:00:00Z',
		createdAt: '2024-04-20T10:00:00Z',
		updatedAt: '2024-04-22T12:00:00Z',
	}),
	makeReservation({
		id: 'res-005',
		state: 'Closed',
		listing: { id: 'listing-5', title: 'GoPro Camera' },
		user: {
			id: 'user-5',
			username: 'patricia.b',
			firstName: 'Patricia',
			lastName: 'Black',
		},
		reservationPeriodStart: '2024-06-01T00:00:00Z',
		reservationPeriodEnd: '2024-06-05T00:00:00Z',
		createdAt: '2024-05-20T10:00:00Z',
		updatedAt: '2024-05-22T12:00:00Z',
		closeRequestedByReserver: true,
	}),
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
