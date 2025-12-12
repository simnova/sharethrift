// Shared helpers for step definitions
import { ReservationRequestStates } from '../../../src/domain/contexts/reservation-request/reservation-request/reservation-request.value-objects.ts';

/**
 * Maps state strings to ReservationRequestStates enum values.
 * Returns the original string for invalid states (useful for testing error handling).
 */
export const toReservationStateEnum = (state: string): string => {
	switch (state) {
		case 'REQUESTED':
			return ReservationRequestStates.REQUESTED;
		case 'ACCEPTED':
			return ReservationRequestStates.ACCEPTED;
		case 'REJECTED':
			return ReservationRequestStates.REJECTED;
		case 'CANCELLED':
			return ReservationRequestStates.CANCELLED;
		case 'CLOSED':
			return ReservationRequestStates.CLOSED;
		default:
			return state; // Return as-is for testing invalid states
	}
};

