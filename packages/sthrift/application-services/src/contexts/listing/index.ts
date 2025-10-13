import type { DataSources } from '@sthrift/persistence';
import type { CognitiveSearchDomain } from '@sthrift/domain';
import {
	ItemListing as ItemListingApi,
	type ItemListingApplicationService,
} from './item/index.ts';
import { ItemListingSearchApplicationService } from './item-listing-search.ts';

export interface ListingContextApplicationService {
	ItemListing: ItemListingApplicationService;
	ItemListingSearch: ItemListingSearchApplicationService;
}

export const Listing = (
	dataSources: DataSources,
	searchService?: CognitiveSearchDomain,
): ListingContextApplicationService => {
	return {
		ItemListing: ItemListingApi(dataSources),
		ItemListingSearch: new ItemListingSearchApplicationService(
			searchService || ({} as CognitiveSearchDomain), // Fallback for when search service is not available
		),
	};
};
