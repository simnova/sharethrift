import { Domain, type ListingSearchIndexingService } from '@sthrift/domain';

const { EventBusInstance, ItemListingUpdatedEvent } = Domain.Events;

export default function registerItemListingUpdatedUpdateSearchIndexHandler(
	listingSearchIndexing: ListingSearchIndexingService,
) {
	EventBusInstance.register(
		ItemListingUpdatedEvent,
		async (payload: { id: string }) => {
			try {
				await listingSearchIndexing.indexListing(payload.id);
			} catch (error) {
				console.error(`Failed to update search index for ItemListing ${payload.id}:`, error);
			}
		},
	);
}
