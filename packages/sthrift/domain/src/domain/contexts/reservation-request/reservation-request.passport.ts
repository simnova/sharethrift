import type { ReservationRequestEntityReference } from './reservation-request/reservation-request.entity.ts';
import type { ReservationRequestVisa } from './reservation-request.visa.ts';

export interface ReservationRequestPassport {
	forReservationRequest(
		root: ReservationRequestEntityReference,
	): ReservationRequestVisa;
}
