/**
 * Bulk Index Existing Listings
 *
 * This handler indexes all existing listings in the database into the search index.
 * Useful for initial indexing or re-indexing after the search service is added.
 */

import type { Domain } from '@sthrift/domain';
import type { ServiceCognitiveSearch } from '@sthrift/service-cognitive-search';
import { ItemListingSearchIndexSpec } from '@sthrift/domain';

/**
 * Bulk index all existing listings from the database into the search index
 *
 * @param listings - Array of item listings to index
 * @param searchService - The cognitive search service instance
 */
export async function bulkIndexExistingListings(
	listings: Domain.Contexts.Listing.ItemListing.ItemListingEntityReference[],
	searchService: ServiceCognitiveSearch,
): Promise<void> {
	console.log('Starting bulk indexing of existing listings...');

	try {
		console.log(`Found ${listings.length} listings to index`);

		if (listings.length === 0) {
			console.log('No listings found to index');
			return;
		}

		// Create index if it doesn't exist
		await searchService.createIndexIfNotExists(ItemListingSearchIndexSpec);

		// Convert each listing to a search document and index it
		const errors: Array<{ id: string; error: string }> = [];

		for (const listing of listings) {
			try {
				// Build the search document from listing properties
				const searchDocument = {
					id: listing.id,
					title: listing.title,
					description: listing.description || '',
					category: listing.category || '',
					location: listing.location || '',
					sharerName: listing.sharer?.account?.profile?.firstName || 'Unknown',
					sharerId: listing.sharer?.id || '',
					state: listing.state || '',
					sharingPeriodStart:
						listing.sharingPeriodStart?.toISOString() ||
						new Date().toISOString(),
					sharingPeriodEnd:
						listing.sharingPeriodEnd?.toISOString() || new Date().toISOString(),
					createdAt:
						listing.createdAt?.toISOString() || new Date().toISOString(),
					updatedAt:
						listing.updatedAt?.toISOString() || new Date().toISOString(),
					images: listing.images || [],
				};

				// Index the document
				await searchService.indexDocument(
					ItemListingSearchIndexSpec.name,
					searchDocument,
				);

				console.log(`Indexed listing: ${listing.id} - ${listing.title}`);
			} catch (error) {
				const errorMessage =
					error instanceof Error ? error.message : String(error);
				console.error(`Failed to index listing ${listing.id}:`, errorMessage);
				errors.push({ id: listing.id, error: errorMessage });
			}
		}

		// Summary
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
