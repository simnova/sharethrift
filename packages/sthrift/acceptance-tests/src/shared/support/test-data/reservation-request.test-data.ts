import { Domain } from '@sthrift/domain';
import { generateObjectId } from './utils.js';
import { createMockUser } from './user.test-data.js';
import { getMockListingById } from './listing.test-data.js';

type ReservationRequestEntityReference = Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference;

export const reservationRequests = new Map<string, ReservationRequestEntityReference>();

interface CreateReservationRequestInput {
	listingId: string;
	reserverEmail: string;
	reservationPeriodStart: Date;
	reservationPeriodEnd: Date;
}

export function createMockReservationRequest(input: CreateReservationRequestInput): ReservationRequestEntityReference {
	const id = generateObjectId();
	const firstName = input.reserverEmail.split('@')[0] || 'Reserver';
	const reserverUser = createMockUser(input.reserverEmail, firstName, 'Reserver');
	const listing = getMockListingById(input.listingId);

	if (!listing) {
		throw new Error(`Listing not found: ${input.listingId}`);
	}

	// Check for overlapping active reservations
	const overlapping = Array.from(reservationRequests.values()).filter(
		(r) =>
			r.listing.id === input.listingId &&
			['Requested', 'Accepted'].includes(r.state) &&
			input.reservationPeriodStart < r.reservationPeriodEnd &&
			input.reservationPeriodEnd > r.reservationPeriodStart,
	);

	if (overlapping.length > 0) {
		throw new Error('Reservation period overlaps with existing active reservation requests');
	}

	const reservation: ReservationRequestEntityReference = {
		id,
		state: 'Requested',
		reservationPeriodStart: input.reservationPeriodStart,
		reservationPeriodEnd: input.reservationPeriodEnd,
		listing,
		reserver: reserverUser,
		createdAt: new Date(),
		updatedAt: new Date(),
		schemaVersion: '1.0.0',
		closeRequestedBySharer: false,
		closeRequestedByReserver: false,
		loadListing: async () => listing,
		loadReserver: async () => reserverUser,
		loadSharer: async () => null as never,
	} as ReservationRequestEntityReference;

	reservationRequests.set(id, reservation);
	return reservation;
}

export function getMockReservationRequestById(id: string): ReservationRequestEntityReference | null {
	return reservationRequests.get(id) ?? null;
}

export function getAllMockReservationRequests(): ReservationRequestEntityReference[] {
	return Array.from(reservationRequests.values());
}

export function getMockActiveByListingId(listingId: string): ReservationRequestEntityReference[] {
	return Array.from(reservationRequests.values()).filter((r) => r.listing.id === listingId);
}

export function clearMockReservationRequests(): void {
	reservationRequests.clear();
}
