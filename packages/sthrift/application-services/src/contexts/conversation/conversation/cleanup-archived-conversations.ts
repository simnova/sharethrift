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

					// NOTE: Use sharingPeriodEnd as the primary anchor date since it represents
					// the definitive end of the sharing period (most semantically correct).
					// Fall back to updatedAt for legacy/malformed listings to avoid permanently
					// retaining conversations. The updatedAt fallback may drift if the listing
					// is updated after archival; consider adding explicit archivedAt timestamp
					// in the future for more precise retention tracking.
					const anchorDate = listing.sharingPeriodEnd ?? listing.updatedAt;

					for (const conversation of conversationsToSchedule) {
						conversation.scheduleForDeletion(anchorDate);
						await repo.save(conversation);
						scheduled++;
					}
				},
			);

			return { processed, scheduled, errors };
		},
	});
}
