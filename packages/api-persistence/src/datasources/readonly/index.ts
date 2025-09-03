import type { Domain } from '@sthrift/api-domain';
import type { ModelsContext } from '../../index.ts';
import type * as PersonalUser from './user/personal-user/index.ts';

import { UserContext } from './user/index.ts';
import { ConversationContext } from './conversation/index.ts';
import { ListingContext } from './listing/index.ts';

import type * as ItemListing from './listing/item/index.ts';
import type * as Conversation from './conversation/conversation/index.ts';

export interface ReadonlyDataSource {
	User: {
		PersonalUser: {
			PersonalUserReadRepo: PersonalUser.PersonalUserReadRepository;
		};
	};
	Listing: {
		ItemListing: {
			ItemReadRepo: ItemListing.ItemReadRepository;
		};
	};
	Conversation: {
		Conversation: {
			ConversationReadRepo: Conversation.ConversationReadRepository;
		};
	};
}

export const ReadonlyDataSourceImplementation = (
	models: ModelsContext,
	passport: Domain.Passport,
): ReadonlyDataSource => ({
	User: UserContext(models, passport),
	Listing: ListingContext(models, passport),
	Conversation: ConversationContext(models, passport),
});
