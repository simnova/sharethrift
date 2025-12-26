import { Domain, type ListingSearchIndexingService } from '@sthrift/domain';

const { EventBusInstance, ItemListingDeletedEvent } = Domain.Events;

export default function registerItemListingDeletedUpdateSearchIndexHandler(
	listingSearchIndexing: ListingSearchIndexingService,
) {
	EventBusInstance.register(
		ItemListingDeletedEvent,
		async (payload: { id: string }) => {
			try {
				await listingSearchIndexing.deleteFromIndex(payload.id);
			} catch (error) {
				console.error(`Failed to remove from search index for ItemListing ${payload.id}:`, error);
			}
		},
	);
}
