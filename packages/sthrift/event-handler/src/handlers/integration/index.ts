import type { DomainDataSource } from '@sthrift/domain';
import { ListingSearchIndexingService } from '@sthrift/domain';
import type { SearchService } from '@cellix/search-service';
import registerItemListingUpdatedUpdateSearchIndexHandler from './item-listing-updated--update-search-index.js';
import registerItemListingDeletedUpdateSearchIndexHandler from './item-listing-deleted--update-search-index.js';

export const RegisterIntegrationEventHandlers = (
	domainDataSource: DomainDataSource,
	searchService: SearchService,
): void => {
	const listingSearchIndexing = new ListingSearchIndexingService(
		searchService,
		domainDataSource.Listing.ItemListing.ItemListingUnitOfWork,
	);

	registerItemListingUpdatedUpdateSearchIndexHandler(listingSearchIndexing);
	registerItemListingDeletedUpdateSearchIndexHandler(listingSearchIndexing);
};
