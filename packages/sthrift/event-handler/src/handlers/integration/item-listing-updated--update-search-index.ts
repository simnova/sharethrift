import { Domain, type ItemListingSearchIndexingService } from '@sthrift/domain';

const { EventBusInstance, ItemListingUpdatedEvent } = Domain.Events;

export default function registerItemListingUpdatedUpdateSearchIndexHandler(
	itemListingSearchIndexing: ItemListingSearchIndexingService,
) {
	EventBusInstance.register(
		ItemListingUpdatedEvent,
		async (payload: { id: string }) => {
			try {
				await itemListingSearchIndexing.indexItemListing(payload.id);
			} catch (error) {
				console.error(`Failed to update search index for ItemListing ${payload.id}:`, error);
			}
		},
	);
}
