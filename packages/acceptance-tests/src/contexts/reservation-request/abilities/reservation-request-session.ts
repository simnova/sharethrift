/**
 * Shared types for reservation request session operations.
 * Used by both DomainReservationRequestSession and GraphQLReservationRequestSession.
 */

export interface CreateReservationRequestInput {
	listingId: string;
	reservationPeriodStart: Date;
	reservationPeriodEnd: Date;
	reserver: UserReference;
}

export interface UserReference {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
}

export interface ReservationRequest {
	id: string;
	listingId: string;
	reserver: UserReference;
	reservationPeriodStart: Date;
	reservationPeriodEnd: Date;
	state: 'Requested' | 'Accepted' | 'Rejected' | 'Cancelled' | 'Closed';
	createdAt: Date;
	updatedAt: Date;
}
