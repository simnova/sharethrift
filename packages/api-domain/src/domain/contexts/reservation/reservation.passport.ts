import type { ReservationVisa } from './reservation.visa.ts';
import type { ReservationRequestEntityReference } from './reservation-request/reservation-request.aggregate.ts';

/**
 * Passport interface for the Reservation bounded context.
 * Provides access to visa for aggregate-specific authorization checks.
 */
export interface ReservationPassport {
	/**
	 * Creates a visa for the reservation request aggregate with context-specific permissions.
	 * @param root - The reservation request aggregate root
	 * @returns ReservationVisa instance for authorization checks
	 */
	forReservationRequest(root: ReservationRequestEntityReference): ReservationVisa;
}