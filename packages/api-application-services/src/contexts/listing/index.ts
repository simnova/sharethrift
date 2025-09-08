import type { DataSources } from '@sthrift/api-persistence';
import {
	ItemListing as ItemListingApi,
	type ItemListingApplicationService,
} from './item/index.ts';

export interface ConversationContextApplicationService {
	ItemListing: ItemListingApplicationService;
}

export const Conversation = (
	dataSources: DataSources,
): ConversationContextApplicationService => {
	return {
		ItemListing: ItemListingApi(dataSources),
	};
};
