import type { Models } from '@sthrift/data-sources-mongoose-models';
import type { Domain } from '@sthrift/domain';
import { createValidObjectId, makeMockUser } from '../mock-data-helpers.ts';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import { vi } from 'vitest';

/**
 * Create a mock passport for reservation request testing
 */
export function makeReservationRequestPassport(): Domain.Passport {
	return vi.mocked({
		reservationRequest: {
			forReservationRequest: vi.fn(() => ({
				determineIf: () => true,
			})),
		},
		user: {
			forPersonalUser: vi.fn(() => ({
				determineIf: () => true,
			})),
		},
		listing: {
			forItemListing: vi.fn(() => ({
				determineIf: () => true,
			})),
		},
	} as unknown as Domain.Passport);
}

/**
 * Create a mock reservation request for testing
 */
export function makeMockReservationRequest(
	overrides: Partial<Models.ReservationRequest.ReservationRequest> = {},
): Models.ReservationRequest.ReservationRequest {
	const reservationId = overrides.id || 'reservation-1';
	const defaultReservation = {
		_id: new MongooseSeedwork.ObjectId(createValidObjectId(reservationId as string)),
		id: reservationId,
		state: 'Pending',
		reserver: makeMockUser('user-1'),
		listing: {
			_id: new MongooseSeedwork.ObjectId(createValidObjectId('listing-1')),
			id: 'listing-1',
			title: 'Test Listing',
			description: 'Test Description',
			sharer: new MongooseSeedwork.ObjectId(createValidObjectId('sharer-1')),
		},
		reservationPeriodStart: new Date('2025-10-20'),
		reservationPeriodEnd: new Date('2025-10-25'),
		closeRequestedBySharer: false,
		closeRequestedByReserver: false,
		createdAt: new Date('2020-01-01'),
		updatedAt: new Date('2020-01-02'),
		schemaVersion: '1.0.0',
	};
	return {
		...defaultReservation,
		...overrides,
	} as unknown as Models.ReservationRequest.ReservationRequest;
}