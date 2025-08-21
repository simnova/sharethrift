import type { ItemListingPassport } from './listing/item.passport.ts';
import type { ListingRequestPassport } from './listing/request.passport.ts';

export interface Passport {
	get itemListing(): ItemListingPassport;
	get listingRequest(): ListingRequestPassport;
}

export const PassportFactory = {
	forReadOnly(): Passport {
		return {} as Passport; // need to implement read only passport implementation in IAM section
	},
};
