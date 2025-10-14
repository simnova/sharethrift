import type { ReservationRequestVisa } from './reservation-request.visa.js';
import type { ReservationRequestEntityReference } from './reservation-request/reservation-request.entity.js';

export interface ReservationRequestPassport {
	forReservationRequest(
		root: ReservationRequestEntityReference,
	): ReservationRequestVisa;
}
