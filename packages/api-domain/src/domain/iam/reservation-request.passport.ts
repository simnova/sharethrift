import { ReservationRequestPassportBase } from './reservation-request.passport-base.ts';
import type { ReservationPassport } from '../contexts/reservation/reservation.passport.ts';
import type { ReservationVisa } from '../contexts/reservation/reservation.visa.ts';
import type { ReservationRequestEntityReference } from '../contexts/reservation/reservation-request/reservation-request.aggregate.ts';

/**
 * Main passport class for ReservationRequest aggregate that implements the domain context Passport requirements.
 * Extends the base passport class and implements the ReservationPassport interface.
 */
export class ReservationRequestPassport extends ReservationRequestPassportBase implements ReservationPassport {
	/**
	 * Creates a visa for the reservation request aggregate with context-specific permissions.
	 * @param root - The reservation request aggregate root
	 * @returns ReservationVisa instance for authorization checks
	 */
	forReservationRequest(_root: ReservationRequestEntityReference): ReservationVisa {
		return {
			determineIf: (func) => this.determineIf(func)
		};
	}
}