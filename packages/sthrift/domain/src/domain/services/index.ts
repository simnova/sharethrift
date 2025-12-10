import type { BlobStorage } from './blob-storage.ts';
import type { ItemListingSearchIndexingService } from './listing/item-listing-search-indexing.js';

export interface Services {
	BlobStorage: BlobStorage;
	ItemListingSearchIndexing: ItemListingSearchIndexingService;
}

export { ItemListingSearchIndexingService } from './listing/item-listing-search-indexing.js';
