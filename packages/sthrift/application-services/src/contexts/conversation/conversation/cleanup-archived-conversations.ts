import type { DataSources } from '@sthrift/persistence';
import { Domain } from '@sthrift/domain';
import { processArchivedEntities } from './cleanup-shared.ts';
import type { CleanupResult } from './cleanup.types.ts';

const ARCHIVED_LISTING_STATES = [
	Domain.Contexts.Listing.ItemListing.ItemListingValueObjects.ListingStateEnum
		.Expired,
	Domain.Contexts.Listing.ItemListing.ItemListingValueObjects.ListingStateEnum
		.Cancelled,
];

export function processConversationsForArchivedListings(
	dataSources: DataSources,
): Promise<CleanupResult> {
	return processArchivedEntities({
		spanName: 'conversation.processConversationsForArchivedListings',
		entityLabel: 'listing',
		fetchEntities: () =>
			dataSources.readonlyDataSource.Listing.ItemListing.ItemListingReadRepo.getByStates(
				ARCHIVED_LISTING_STATES,
			),
		processEntity: async (listing) => {
			let processed = 0;
			let scheduled = 0;
			const errors: string[] = [];

			await dataSources.domainDataSource.Conversation.Conversation.ConversationUnitOfWork.withScopedTransaction(
				async (repo) => {
					const conversations = await repo.getByListingId(listing.id);
					processed += conversations.length;

					const conversationsToSchedule = conversations.filter(
						(c) => !c.expiresAt,
					);

					for (const conversation of conversationsToSchedule) {
						conversation.scheduleForDeletion(listing.updatedAt);
						await repo.save(conversation);
						scheduled++;
					}
				},
			);

			return { processed, scheduled, errors };
		},
	});
}
