import type { ConversationPassport } from './conversation/conversation.passport.ts';
import type { ItemListingPassport } from './listing/item.passport.ts';

export interface Passport {
	get itemListing(): ItemListingPassport;
	get conversation(): ConversationPassport;
}

export const PassportFactory = {
	forReadOnly(): Passport {
		return {} as Passport; // need to implement read only passport implementation in IAM section
	},
};
