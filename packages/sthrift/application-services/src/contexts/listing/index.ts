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
	if (!searchService) {
		throw new Error(
			'searchService is required for Listing context. ItemListingSearch requires a valid CognitiveSearchDomain instance.',
		);
	}
	return {
		ItemListing: ItemListingApi(dataSources, searchService),
		ItemListingSearch: new ItemListingSearchApplicationService(searchService),
	};
};
