/**
 * Item Listing Deleted - Update Search Index Handler
 *
 * Event handler that automatically removes documents from the search index
 * when an ItemListing entity is deleted.
 */

import type { CognitiveSearchDomain } from '@sthrift/domain';
import { ItemListingDeletedEvent } from '@sthrift/domain';
import { EventBusInstance } from '@sthrift/domain';
import { ItemListingSearchIndexSpec } from '@sthrift/domain';
import { deleteFromSearchIndexWithRetry } from './search-index-helpers.js';

/**
 * Register event handler for ItemListing deletions
 */
export function registerItemListingDeletedUpdateSearchIndexHandler(
	searchService: CognitiveSearchDomain,
): void {
	EventBusInstance.register(
		ItemListingDeletedEvent,
		async (payload: { id: string }) => {
			console.log(
				`ItemListing Deleted - Search Index Integration: ${JSON.stringify(payload)}`,
			);

			try {
				// Remove document from search index
				await deleteFromSearchIndexWithRetry(
					searchService,
					ItemListingSearchIndexSpec.name,
					payload.id,
					3, // max attempts
				);

				console.log(
					`Document removed from search index for ItemListing ${payload.id}`,
				);
			} catch (error) {
				console.error(
					`Failed to remove document from search index for ItemListing ${payload.id}:`,
					error,
				);
				// Note: We don't re-throw the error to avoid breaking the domain event processing
				// The search index cleanup failure should not prevent the domain operation from completing
			}
		},
	);
}
