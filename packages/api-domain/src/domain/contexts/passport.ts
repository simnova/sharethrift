import type { ReservationRequestPassport } from './reservation-request/reservation-request.passport.ts';

export interface Passport {
	get reservationRequest(): ReservationRequestPassport;
}

export const PassportFactory = {
	forReadOnly(): Passport {
		return {} as Passport; // need to implement read only passport implementation in IAM section
	},
};
