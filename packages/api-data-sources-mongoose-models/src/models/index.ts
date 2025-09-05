
import type { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import { PersonalUserModelFactory, UserModelFactory } from './user/index.ts';

export * as User from './user/index.ts';
import {
	ItemListingModelFactory,
	ListingModelFactory,
} from './listing/index.ts';
import { ConversationModelFactory } from './conversations/conversation.model.ts';

export * as Conversation from './conversations/index.ts';
export * as Listing from './listing/index.ts';

// Explicit export for consumers
export { ItemListingModelFactory };

export const mongooseContextBuilder = (
	initializedService: MongooseSeedwork.MongooseContextFactory,
) => {
	return {
		User: {
			PersonalUser: PersonalUserModelFactory(
				UserModelFactory(initializedService),
			),
		},

		Listing: {
			ItemListingModel: ItemListingModelFactory(
				ListingModelFactory(initializedService),
			),
		},
		Conversation: {
			ConversationModel: ConversationModelFactory(initializedService),
		},
	};
};
