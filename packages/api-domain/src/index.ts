export * as Domain from './domain/index.ts';
export * from './domain/contexts/index.ts';
import type { Contexts } from './domain/index.ts';

export interface DomainDataSource {
	domainContexts: {
		listing?: {
			item?: {
				getItemListingUnitOfWork: () => Contexts.Listing.ItemListingUnitOfWork;
			};
		};
		conversation?: {
			getConversationUnitOfWork: () => Contexts.Conversation.Conversation.ConversationUnitOfWork;
		};
	};
}
