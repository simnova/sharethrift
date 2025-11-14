/**
 * Item Listing Updated - Update Search Index Handler
 *
 * Event handler that automatically updates the search index when an ItemListing
 * entity is updated. Implements hash-based change detection to avoid unnecessary
 * index updates and includes retry logic for reliability.
 */

import type { CognitiveSearchDomain } from '@sthrift/domain';
import type { ItemListingUnitOfWork } from '@sthrift/domain';
import { ItemListingUpdatedEvent } from '@sthrift/domain';
import { EventBusInstance } from '@sthrift/domain';
import {
	ItemListingSearchIndexSpec,
	convertItemListingToSearchDocument,
} from '@sthrift/domain';
import { updateSearchIndexWithRetry } from './search-index-helpers.js';

/**
 * Register event handler for ItemListing updates
 */
export function registerItemListingUpdatedUpdateSearchIndexHandler(
	searchService: CognitiveSearchDomain,
	itemListingUnitOfWork: ItemListingUnitOfWork,
): void {
	EventBusInstance.register(
		ItemListingUpdatedEvent,
		async (payload: { id: string; updatedAt: Date }) => {
			console.log(
				`ItemListing Updated - Search Index Integration: ${JSON.stringify(payload)}`,
			);

			try {
				// Get the updated item listing from the repository
				let itemListing: Record<string, unknown> | undefined;
				await itemListingUnitOfWork.withScopedTransaction(
					async (repo: { getById: (id: string) => Promise<unknown> }) => {
						itemListing = (await repo.getById(payload.id)) as
							| Record<string, unknown>
							| undefined;
					},
				);

				if (!itemListing) {
					console.warn(
						`ItemListing ${payload.id} not found, skipping search index update`,
					);
					return;
				}

				// Convert domain entity to search document
				const searchDocument = convertItemListingToSearchDocument(itemListing);

				// Update search index with retry logic and hash-based change detection
				await updateSearchIndexWithRetry(
					searchService,
					ItemListingSearchIndexSpec,
					searchDocument,
					itemListing,
					3, // max attempts
				);

				console.log(
					`Search index updated successfully for ItemListing ${payload.id}`,
				);
			} catch (error) {
				console.error(
					`Failed to update search index for ItemListing ${payload.id}:`,
					error,
				);
				// Note: We don't re-throw the error to avoid breaking the domain event processing
				// The search index update failure should not prevent the domain operation from completing
			}
		},
	);
}
