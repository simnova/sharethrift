import type { DataSources } from '@sthrift/persistence';
import { trace, SpanStatusCode } from '@opentelemetry/api';

const tracer = trace.getTracer('conversation:cleanup');

export interface CleanupResult {
	processedCount: number;
	scheduledCount: number;
	timestamp: Date;
	errors: string[];
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
							['Expired', 'Cancelled'],
						);

					span.setAttribute('archivedListingsCount', archivedListings.length);

					for (const listing of archivedListings) {
						try {
							const conversations =
								await dataSources.readonlyDataSource.Conversation.Conversation.ConversationReadRepo.getByListingId(
									listing.id,
								);

							for (const conversationRef of conversations) {
								result.processedCount++;

								if (conversationRef.expiresAt) {
									continue;
								}

								await dataSources.domainDataSource.Conversation.Conversation.ConversationUnitOfWork.withScopedTransaction(
									async (repo) => {
										const conversation = await repo.get(conversationRef.id);
										if (conversation && !conversation.expiresAt) {
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
