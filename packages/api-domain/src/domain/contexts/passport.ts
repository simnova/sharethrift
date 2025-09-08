import type { UserPassport } from './user/user.passport.ts';
import type { ItemListingPassport } from './listing/item/item-listing.passport.ts';
import { GuestPassport, SystemPassport } from '../iam/index.ts';
import type { PermissionsSpec } from '../iam/system/system.passport-base.ts';

export interface Passport {
	get user(): UserPassport;
	get itemListing(): ItemListingPassport;
}

export const PassportFactory = {
	// for users who are not logged in on any portal - defaults to false for all permissions
	forGuest(): Passport {
		return new GuestPassport();
	},
	forSystem(permissions?: Partial<PermissionsSpec>): Passport {
		return new SystemPassport(permissions);
	},
};
