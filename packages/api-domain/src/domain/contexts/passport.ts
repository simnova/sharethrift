import type { UserPassport } from './user/user.passport.ts';
import type { ItemListingPassport } from './listing/item/item-listing.passport.ts';
import { SystemPassport } from '../iam/index.ts';
import type { PermissionsSpec } from '../iam/system/system.passport-base.ts';
import type { ReservationRequestPassport } from './reservation-request/reservation-request.passport.ts';


export interface Passport {
	get reservationRequest(): ReservationRequestPassport;
    get user(): UserPassport;
	get itemListing(): ItemListingPassport;
}

export const PassportFactory = {
	forReadOnly(): Passport {
		return {} as Passport; // need to implement read only passport implementation in IAM section
	},
	forSystem(permissions?: Partial<PermissionsSpec>): Passport {
		return new SystemPassport(permissions);
	},
};
