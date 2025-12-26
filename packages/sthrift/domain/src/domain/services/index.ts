import type { BlobStorage } from './blob-storage.ts';
import type { ListingSearchIndexingService } from './listing/listing-search-indexing.js';

export interface Services {
	BlobStorage: BlobStorage;
	ListingSearchIndexing: ListingSearchIndexingService;
}

export { ListingSearchIndexingService } from './listing/listing-search-indexing.js';
