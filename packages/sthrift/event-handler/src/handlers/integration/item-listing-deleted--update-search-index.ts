import { Domain, type ItemListingSearchIndexingService } from '@sthrift/domain';

const { EventBusInstance, ItemListingDeletedEvent } = Domain.Events;

export default function registerItemListingDeletedUpdateSearchIndexHandler(
	itemListingSearchIndexing: ItemListingSearchIndexingService,
) {
	EventBusInstance.register(
		ItemListingDeletedEvent,
		async (payload: { id: string }) => {
			try {
				await itemListingSearchIndexing.deleteFromIndex(payload.id);
			} catch (error) {
				console.error(`Failed to remove from search index for ItemListing ${payload.id}:`, error);
			}
		},
	);
}
