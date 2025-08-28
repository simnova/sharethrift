import type { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import {
	ItemListingModelFactory,
	ListingModelFactory,
} from './listing/index.ts';
import { ConversationModelFactory } from './conversations/conversation.model.ts';

export * as Conversation from './conversations/index.ts';
export * as Listing from './listing/index.ts';

export const mongooseContextBuilder = (
	initializedService: MongooseSeedwork.MongooseContextFactory,
) => {
	return {
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
