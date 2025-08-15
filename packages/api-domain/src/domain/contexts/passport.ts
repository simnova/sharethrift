import type { ItemListingPassport } from './item-listing/item-listing.passport.ts';
import { ItemListingPassport as ItemListingPassportImpl } from '../iam/item-listing/item-listing.passport.ts';

export interface Passport {
	get itemListing(): ItemListingPassport;
}

export const PassportFactory = {
	forReadOnly(): Passport {
		// For read-only operations, allow all permissions
		const principal = {
			id: 'anonymous',
			email: 'anonymous@example.com',
			roles: ['readonly']
		};
		
		const permissions = {
			canCreateItemListing: false,
			canUpdateItemListing: false,
			canDeleteItemListing: false,
			canViewItemListing: true,
			canPublishItemListing: false,
			canUnpublishItemListing: false,
		};

		return new ItemListingPassportImpl(principal, permissions);
	},
};
