import type { ConversationPassport } from './conversation/conversation.passport.ts';
import type { UserPassport } from './user/user.passport.ts';
import type { ItemListingPassport } from './listing/item/item-listing.passport.ts';
import { SystemPassport } from '../iam/index.ts';
import type { PermissionsSpec } from '../iam/system/system.passport-base.ts';

export interface Passport {
	get user(): UserPassport;
	get itemListing(): ItemListingPassport;
	get conversation(): ConversationPassport;
}

export const PassportFactory = {
	forReadOnly(): Passport {
		return {} as Passport; // need to implement read only passport implementation in IAM section
	},
	forSystem(permissions?: Partial<PermissionsSpec>): Passport {
		return new SystemPassport(permissions);
	},
};
