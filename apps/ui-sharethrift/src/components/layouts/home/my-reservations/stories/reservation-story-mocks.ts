import type { MockedResponse } from '@apollo/client/testing';
import type { DocumentNode } from '@apollo/client';
import type { HomeMyReservationsReservationsViewReservationRequestFieldsFragment } from '../../../../../generated.tsx';
import {
	HomeMyReservationsReservationsViewActiveContainerActiveReservationsDocument,
	HomeMyReservationsReservationsViewHistoryContainerPastReservationsDocument,
} from '../../../../../generated.tsx';

/**
 * Mock data and utilities for reservation-related Storybook stories
 * 
 * This file provides:
 * - Factory function for creating reservation mock data with consistent defaults
 * - Pre-defined mock reservations for different states (active/past)
 * - Apollo Client mocks for GraphQL queries used in reservation stories
 * 
 * Structure:
 * - makeReservation(): Factory function that creates reservation objects with sensible defaults
 * - activeConfigs/pastConfigs: Concise configuration objects for reservations
 * - storyReservationsActive/Past: Generated reservation objects from configs
 * - reservationStoryMocks: Apollo mocks for GraphQL queries
 */

export const STORYBOOK_RESERVATION_USER_ID = 'storybook-reserver-id';

/**
 * Factory function to create reservation mock data with defaults
 * 
 * This function centralizes the creation of reservation mock objects, ensuring
 * consistency across all stories and making it easy to add new mock reservations.
 * 
 * @param params - Configuration object for the reservation
 * @param params.id - Unique identifier for the reservation
 * @param params.state - Current state of the reservation (Requested, Accepted, etc.)
 * @param params.listing - Listing information including id, title, and optional images
 * @param params.user - User information for the reserver
 * @param params.reservationPeriodStart - Start date of the reservation period
 * @param params.reservationPeriodEnd - End date of the reservation period
 * @param params.createdAt - When the reservation was created
 * @param params.updatedAt - When the reservation was last updated
 * @param params.closeRequestedByReserver - Whether the reserver requested to close
 * @param params.closeRequestedBySharer - Whether the sharer requested to close
 * @returns Complete reservation object ready for use in stories
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
	listing: { id: string; title: string; images?: string[] };
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

/**
 * Helper to create Apollo mocks with consistent structure
 */
function makeStoryMock<T>(
	query: DocumentNode,
	responseField: keyof T,
	data: T[keyof T],
): MockedResponse {
	return {
		request: { query, variables: { userId: STORYBOOK_RESERVATION_USER_ID } },
		result: { data: { [responseField]: data } as T },
	};
}

/**
 * Configuration objects for active reservations (Requested, Accepted)
 * These represent ongoing reservations that users can interact with
 */
const activeConfigs = [
	{
		id: 'res-001',
		state: 'Requested' as const,
		listing: { 
			id: 'listing-1', 
			title: 'Power Drill Set',
			images: ['https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=200&fit=crop']
		},
		user: {
			id: 'user-1',
			username: 'sarah.j',
			firstName: 'Sarah',
			lastName: 'Johnson',
		},
		dates: { 
			start: '2024-02-15T00:00:00Z', 
			end: '2024-02-22T00:00:00Z',
			created: '2024-02-10T10:00:00Z',
			updated: '2024-02-12T12:00:00Z',
		},
	},
	{
		id: 'res-002',
		state: 'Accepted' as const,
		listing: { 
			id: 'listing-2', 
			title: 'Camping Tent',
			images: ['https://images.unsplash.com/photo-1487730116645-74489c95b41b?w=300&h=200&fit=crop']
		},
		user: {
			id: 'user-2',
			username: 'mike.b',
			firstName: 'Mike',
			lastName: 'Brown',
		},
		dates: { 
			start: '2024-03-01T00:00:00Z', 
			end: '2024-03-05T00:00:00Z',
			created: '2024-02-20T10:00:00Z',
			updated: '2024-02-22T12:00:00Z',
		},
	},
];

/**
 * Configuration objects for past reservations (Rejected, Cancelled, Closed)
 * These represent completed or cancelled reservations for history views
 */
const pastConfigs = [
	{
		id: 'res-003',
		state: 'Rejected' as const,
		listing: { 
			id: 'listing-3', 
			title: 'Mountain Bike',
			images: ['https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=200&fit=crop']
		},
		user: {
			id: 'user-3',
			username: 'anna.l',
			firstName: 'Anna',
			lastName: 'Lee',
		},
		dates: { 
			start: '2024-04-10T00:00:00Z', 
			end: '2024-04-15T00:00:00Z',
			created: '2024-04-01T10:00:00Z',
			updated: '2024-04-02T12:00:00Z',
		},
	},
	{
		id: 'res-004',
		state: 'Cancelled' as const,
		listing: { 
			id: 'listing-4', 
			title: 'Kayak',
			images: ['https://images.unsplash.com/photo-1487730116645-74489c95b41b?w=300&h=200&fit=crop']
		},
		user: {
			id: 'user-4',
			username: 'chris.g',
			firstName: 'Chris',
			lastName: 'Green',
		},
		dates: { 
			start: '2024-05-01T00:00:00Z', 
			end: '2024-05-05T00:00:00Z',
			created: '2024-04-20T10:00:00Z',
			updated: '2024-04-22T12:00:00Z',
		},
	},
	{
		id: 'res-005',
		state: 'Closed' as const,
		listing: { 
			id: 'listing-5', 
			title: 'GoPro Camera',
			images: ['https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=200&fit=crop']
		},
		user: {
			id: 'user-5',
			username: 'patricia.b',
			firstName: 'Patricia',
			lastName: 'Black',
		},
		dates: { 
			start: '2024-06-01T00:00:00Z', 
			end: '2024-06-05T00:00:00Z',
			created: '2024-05-20T10:00:00Z',
			updated: '2024-05-22T12:00:00Z',
		},
		closeRequestedByReserver: true,
	},
];

/**
 * Generate reservation objects from configuration objects
 */
export const storyReservationsActive = activeConfigs.map(({ dates: { start, end, created, updated }, ...cfg }) =>
	makeReservation({ 
		...cfg, 
		reservationPeriodStart: start, 
		reservationPeriodEnd: end,
		createdAt: created,
		updatedAt: updated,
	})
);

export const storyReservationsPast = pastConfigs.map(({ dates: { start, end, created, updated }, ...cfg }) =>
	makeReservation({ 
		...cfg, 
		reservationPeriodStart: start, 
		reservationPeriodEnd: end,
		createdAt: created,
		updatedAt: updated,
	})
);

export const storyReservationsAll = [
	...storyReservationsActive,
	...storyReservationsPast,
];

/**
 * Apollo Client mocks for GraphQL queries used in reservation stories
 * 
 * These mocks provide realistic responses for:
 * - Active reservations query (myActiveReservations)
 * - Past reservations query (myPastReservations)
 * 
 * Each mock includes proper GraphQL response structure with __typename fields
 * and realistic data that matches the expected query variables.
 */
export const reservationStoryMocks: MockedResponse[] = [
	makeStoryMock(
		HomeMyReservationsReservationsViewActiveContainerActiveReservationsDocument,
		'myActiveReservations',
		storyReservationsActive,
	),
	makeStoryMock(
		HomeMyReservationsReservationsViewHistoryContainerPastReservationsDocument,
		'myPastReservations',
		storyReservationsPast,
	),
];
