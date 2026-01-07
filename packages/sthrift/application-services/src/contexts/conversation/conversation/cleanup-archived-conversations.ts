import type { DataSources } from '@sthrift/persistence';
import { Domain } from '@sthrift/domain';
import { trace, SpanStatusCode } from '@opentelemetry/api';

const tracer = trace.getTracer('conversation:cleanup');

const ARCHIVED_LISTING_STATES = [
	Domain.Contexts.Listing.ItemListing.ItemListingValueObjects.ListingStateEnum
		.Expired,
	Domain.Contexts.Listing.ItemListing.ItemListingValueObjects.ListingStateEnum
		.Cancelled,
];

export interface CleanupResult {
	processedCount: number;
	scheduledCount: number;
	timestamp: Date;
	errors: string[];
}

export async function processConversationsForArchivedListings(
	dataSources: DataSources,
): Promise<CleanupResult> {
	return await tracer.startActiveSpan(
		'conversation.processConversationsForArchivedListings',
		async (span) => {
			let hadFatalError = false;
			const result: CleanupResult = {
				processedCount: 0,
				scheduledCount: 0,
				timestamp: new Date(),
				errors: [],
			};

			try {
				const archivedListings =
					await dataSources.readonlyDataSource.Listing.ItemListing.ItemListingReadRepo.getByStates(
						ARCHIVED_LISTING_STATES,
					);

				span.setAttribute('archivedListingsCount', archivedListings.length);

				for (const listing of archivedListings) {
					try {
						await dataSources.domainDataSource.Conversation.Conversation.ConversationUnitOfWork.withScopedTransaction(
							async (repo) => {
								const conversations = await repo.getByListingId(listing.id);
								result.processedCount += conversations.length;

								const conversationsToSchedule = conversations.filter(
									(c) => !c.expiresAt,
								);

								for (const conversation of conversationsToSchedule) {
									conversation.scheduleForDeletion(listing.updatedAt);
									await repo.save(conversation);
									result.scheduledCount++;
								}
							},
						);
					} catch (err) {
						const message = err instanceof Error ? err.message : String(err);
						const msg = `Failed to process conversations for listing ${listing.id}: ${message}`;
						result.errors.push(msg);
						console.error('[ConversationCleanup]', msg);
					}
				}
			} catch (error) {
				hadFatalError = true;
				span.setStatus({ code: SpanStatusCode.ERROR });
				if (error instanceof Error) {
					span.recordException(error);
				}
				console.error('[ConversationCleanup] Fatal cleanup error:', error);
				throw error;
			} finally {
				span.setAttribute('processedCount', result.processedCount);
				span.setAttribute('scheduledCount', result.scheduledCount);
				span.setAttribute('errorsCount', result.errors.length);

				// Only update status if no fatal error occurred
				if (!hadFatalError) {
					if (result.errors.length > 0) {
						span.setStatus({
							code: SpanStatusCode.ERROR,
							message: `${result.errors.length} listing(s) failed during cleanup`,
						});
					} else {
						span.setStatus({ code: SpanStatusCode.OK });
					}
				}

				span.end();

				console.log(
					`[ConversationCleanup] Cleanup complete. Processed: ${result.processedCount}, Scheduled: ${result.scheduledCount}, Errors: ${result.errors.length}`,
				);
			}

			return result;
		},
	);
}
