import type { DataSources } from '@sthrift/persistence';
import { trace, SpanStatusCode } from '@opentelemetry/api';

const tracer = trace.getTracer('conversation:cleanup');

/**
 * Result of the cleanup operation for expired conversations.
 */
export interface CleanupResult {
	/** Number of conversations that were processed */
	processedCount: number;
	/** Number of conversations that had their deletion scheduled */
	scheduledCount: number;
	/** Timestamp when the cleanup was performed */
	timestamp: Date;
	/** Any errors that occurred during cleanup */
	errors: string[];
}

/**
 * Processes conversations associated with archived listings to ensure
 * they have proper expiration dates set for deletion.
 *
 * This is a fallback mechanism to ensure conversations get scheduled for deletion
 * even if the event-driven scheduling fails. It checks for conversations where:
 * - The associated listing is expired, cancelled, or completed
 * - The conversation doesn't have an expiresAt date set
 *
 * @param dataSources - The data sources for accessing domain data
 * @returns A function that processes expired conversations
 */
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
					// Get all archived listings (expired, cancelled states)
					// that may have conversations without expiration dates
					const archivedListings =
						await dataSources.readonlyDataSource.Listing.ItemListing.ItemListingReadRepo.getByStates(
							['Expired', 'Cancelled'],
						);

					span.setAttribute('archivedListingsCount', archivedListings.length);

					for (const listing of archivedListings) {
						try {
							// Find conversations for this listing
							const conversations =
								await dataSources.readonlyDataSource.Conversation.Conversation.ConversationReadRepo.getByListingId(
									listing.id,
								);

							for (const conversationRef of conversations) {
								result.processedCount++;

								// Skip if already has expiration date
								if (conversationRef.expiresAt) {
									continue;
								}

								// Schedule deletion based on listing's last update date
								await dataSources.domainDataSource.Conversation.Conversation.ConversationUnitOfWork.withScopedTransaction(
									async (repo) => {
										const conversation = await repo.get(conversationRef.id);
										if (conversation && !conversation.expiresAt) {
											// Use the listing's updatedAt as the archival date
											conversation.scheduleForDeletion(listing.updatedAt);
											await repo.save(conversation);
											result.scheduledCount++;
										}
									},
								);
							}
						} catch (error) {
							const errorMsg = `Failed to process conversations for listing ${listing.id}: ${error instanceof Error ? error.message : String(error)}`;
							result.errors.push(errorMsg);
							console.error(`[ConversationCleanup] ${errorMsg}`);
						}
					}

					span.setAttribute('processedCount', result.processedCount);
					span.setAttribute('scheduledCount', result.scheduledCount);
					span.setAttribute('errorsCount', result.errors.length);
					span.setStatus({ code: SpanStatusCode.OK });
					span.end();

					console.log(
						`[ConversationCleanup] Cleanup complete. Processed: ${result.processedCount}, Scheduled: ${result.scheduledCount}, Errors: ${result.errors.length}`,
					);

					return result;
				} catch (error) {
					span.setStatus({ code: SpanStatusCode.ERROR });
					if (error instanceof Error) {
						span.recordException(error);
						result.errors.push(error.message);
					}
					span.end();
					console.error('[ConversationCleanup] Cleanup failed:', error);
					throw error;
				}
			},
		);
	};
};
