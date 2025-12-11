import type { DomainDataSource } from '@sthrift/domain';
import { ItemListingSearchIndexingService } from '@sthrift/domain';
import type { SearchService } from '@cellix/search-service';
import registerItemListingUpdatedUpdateSearchIndexHandler from './item-listing-updated--update-search-index.js';
import registerItemListingDeletedUpdateSearchIndexHandler from './item-listing-deleted--update-search-index.js';

export const RegisterIntegrationEventHandlers = (
	domainDataSource: DomainDataSource,
	searchService: SearchService,
): void => {
	const itemListingSearchIndexing = new ItemListingSearchIndexingService(
		searchService,
		domainDataSource.Listing.ItemListing.ItemListingUnitOfWork,
	);

	registerItemListingUpdatedUpdateSearchIndexHandler(itemListingSearchIndexing);
	registerItemListingDeletedUpdateSearchIndexHandler(itemListingSearchIndexing);
};
