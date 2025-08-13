import type { ReservationRequestPassport } from './reservation-request/reservation-request.passport.ts';

export interface Passport {
	get reservationRequest(): ReservationRequestPassport;
}
