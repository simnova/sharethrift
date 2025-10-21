/**
 * Development-only mock data utilities for Reservation Requests.
 *
 * Purpose:
 * - Provide backend fallback data when the database has no seed data yet.
 * - Keep all mock shapes centralized in persistence (never in UI or resolvers).
 *
 * Removal Plan:
 * - Once real persistence covers these reads (active/past, listing-requests-by-sharer,
 *   active-by-listing), delete this file and remove imports from the read repository.
 */
import type { Domain } from '@sthrift/domain';
import { createUser, createListing } from './helpers/mock-factories';

export const getMockReservationRequests = (
	reserverId: string,
	type: 'active' | 'past',
): Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[] => {
	const state = type === 'active' ? 'Accepted' : 'Closed';
	const base = {
		id: '507f1f77bcf86cd799439011',
		state,
		reservationPeriodStart: new Date('2025-10-27T10:00:00Z'),
		reservationPeriodEnd: new Date('2025-11-06T10:00:00Z'),
		createdAt: new Date('2024-09-01T10:00:00Z'),
		updatedAt: new Date('2024-09-05T12:00:00Z'),
		schemaVersion: '1',
		listing: createListing(),
		reserver: createUser({
			id: reserverId,
			email: 'reserver@example.com',
			username: 'reserveruser',
		}),
		closeRequestedBySharer: false,
		closeRequestedByReserver: false,
		loadListing: () => Promise.resolve(createListing()),
		loadReserver: () =>
			Promise.resolve(
				createUser({
					id: reserverId,
					email: 'reserver@example.com',
					username: 'reserveruser',
				}),
			),
	};
	return [base];
};

export const getMockListingReservationRequests = (
	sharerId: string,
): Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[] => {
	return getMockReservationRequests('507f1f77bcf86cd799439099', 'active').map(
		(r, idx) => ({
			...r,
			id: `${r.id}-L${idx}`,
			listing: {
				...r.listing,
				sharer: {
					...r.listing.sharer,
					id: sharerId,
				},
			},
		}),
	);
};
