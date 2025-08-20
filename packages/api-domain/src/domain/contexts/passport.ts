import type { ReservationRequestPassport } from './reservation-request/reservation-request.passport.ts';
import type { ItemListingPassport } from './listing/item.passport.ts';

export interface Passport {
	get reservationRequest(): ReservationRequestPassport;
    	get itemListing(): ItemListingPassport;
}

export const PassportFactory = {
	forReadOnly(): Passport {
		return {} as Passport; // need to implement read only passport implementation in IAM section
	},
};
