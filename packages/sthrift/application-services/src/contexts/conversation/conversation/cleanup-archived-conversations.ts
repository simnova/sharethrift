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

function recordListingError(
	listingId: string,
	error: unknown,
	result: CleanupResult,
): void {
	const message = error instanceof Error ? error.message : String(error);
	const errorMsg = `Failed to process conversations for listing ${listingId}: ${message}`;
	result.errors.push(errorMsg);
	console.error(`[ConversationCleanup] ${errorMsg}`);
}

async function processListing(
	listing: Domain.Contexts.Listing.ItemListing.ItemListingEntityReference,
	dataSources: DataSources,
	result: CleanupResult,
): Promise<void> {
	const conversations =
		await dataSources.readonlyDataSource.Conversation.Conversation.ConversationReadRepo.getByListingId(
			listing.id,
		);

	result.processedCount += conversations.length;

	const conversationsToSchedule = conversations.filter((c) => !c.expiresAt);
	if (conversationsToSchedule.length === 0) return;

	await dataSources.domainDataSource.Conversation.Conversation.ConversationUnitOfWork.withScopedTransaction(
		async (repo) => {
			for (const conversationRef of conversationsToSchedule) {
				const conversation = await repo.get(conversationRef.id);
				if (conversation && !conversation.expiresAt) {
					conversation.scheduleForDeletion(listing.updatedAt);
					await repo.save(conversation);
					result.scheduledCount++;
				}
			}
		},
	);
}

export const processConversationsForArchivedListings = (
	dataSources: DataSources,
) => {
	return async (): Promise<CleanupResult> => {
		return await tracer.startActiveSpan(
			'conversation.processConversationsForArchivedListings',
			async (span) => {
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
							await processListing(listing, dataSources, result);
						} catch (error) {
							recordListingError(listing.id, error, result);
						}
					}

					return result;
				} catch (error) {
					span.setStatus({ code: SpanStatusCode.ERROR });
					if (error instanceof Error) {
						span.recordException(error);
						result.errors.push(error.message);
					}
					console.error('[ConversationCleanup] Cleanup failed:', error);
					throw error;
				} finally {
					span.setAttribute('processedCount', result.processedCount);
					span.setAttribute('scheduledCount', result.scheduledCount);
					span.setAttribute('errorsCount', result.errors.length);

					if (result.errors.length > 0) {
						span.setStatus({
							code: SpanStatusCode.ERROR,
							message: `${result.errors.length} listing(s) failed during cleanup`,
						});
					} else {
						span.setStatus({ code: SpanStatusCode.OK });
					}

					span.end();

					console.log(
						`[ConversationCleanup] Cleanup complete. Processed: ${result.processedCount}, Scheduled: ${result.scheduledCount}, Errors: ${result.errors.length}`,
					);
				}
			},
		);
	};
};
