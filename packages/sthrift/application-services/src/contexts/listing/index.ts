import type { DataSources } from '@sthrift/persistence';
import type { CognitiveSearchDomain } from '@sthrift/domain';
import {
	ItemListing as ItemListingApi,
	type ItemListingApplicationService,
} from './item/index.ts';
import { ListingSearchApplicationService } from './listing-search.ts';

export interface ListingContextApplicationService {
	ItemListing: ItemListingApplicationService;
	ListingSearch: ListingSearchApplicationService;
}

export const Listing = (
	dataSources: DataSources,
	searchService?: CognitiveSearchDomain,
): ListingContextApplicationService => {
	if (!searchService) {
		throw new Error(
			'searchService is required for Listing context. ListingSearch requires a valid CognitiveSearchDomain instance.',
		);
	}
	return {
		ItemListing: ItemListingApi(dataSources, searchService),
		ListingSearch: new ListingSearchApplicationService(
			searchService,
			dataSources,
		),
	};
};
