import type { Domain } from '@sthrift/domain';
import { ItemListingSearchIndexingService } from '@sthrift/domain';
import type { SearchService } from '@cellix/search-service';

/**
 * Bulk index all existing listings from the database into the search index
 */
export async function bulkIndexExistingListings(
	listings: Domain.Contexts.Listing.ItemListing.ItemListingEntityReference[],
	searchService: SearchService,
	itemListingUnitOfWork: Domain.Contexts.Listing.ItemListing.ItemListingUnitOfWork,
): Promise<void> {
	console.log('Starting bulk indexing of existing listings...');

	try {
		console.log(`Found ${listings.length} listings to index`);

		if (listings.length === 0) {
			console.log('No listings found to index');
			return;
		}

		const itemListingSearchIndexing = new ItemListingSearchIndexingService(
			searchService,
			itemListingUnitOfWork,
		);

		const errors: Array<{ id: string; error: string }> = [];

		for (const listing of listings) {
			try {
				await itemListingSearchIndexing.indexItemListing(listing.id);
				console.log(`Indexed listing: ${listing.id} - ${listing.title}`);
			} catch (error) {
				const errorMessage =
					error instanceof Error ? error.message : String(error);
				console.error(`Failed to index listing ${listing.id}:`, errorMessage);
				errors.push({ id: listing.id, error: errorMessage });
			}
		}

		const successCount = listings.length - errors.length;
		console.log(
			`Bulk indexing complete: ${successCount}/${listings.length} listings indexed successfully`,
		);

		if (errors.length > 0) {
			console.error(`Failed to index ${errors.length} listings:`, errors);
		}
	} catch (error) {
		console.error('Bulk indexing failed:', error);
		throw error;
	}
}
