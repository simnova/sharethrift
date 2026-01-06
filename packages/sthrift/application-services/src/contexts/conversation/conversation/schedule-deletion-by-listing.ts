import type { DataSources } from '@sthrift/persistence';
import { trace, SpanStatusCode } from '@opentelemetry/api';

const tracer = trace.getTracer('conversation:schedule-deletion');

/**
 * Command to schedule deletion of all conversations associated with a listing.
 */
export interface ScheduleDeletionByListingCommand {
	/** The ID of the listing whose conversations should be scheduled for deletion */
	listingId: string;
	/** The date when the listing was archived (expired, cancelled, or completed) */
	archivalDate: Date;
}

/**
 * Result of the schedule deletion operation.
 */
export interface ScheduleDeletionResult {
	/** Number of conversations scheduled for deletion */
	scheduledCount: number;
	/** IDs of conversations that were scheduled */
	conversationIds: string[];
}

/**
 * Schedules all conversations associated with a listing for deletion.
 * Per the data retention strategy, conversations are deleted 6 months after
 * the associated listing or reservation request reaches a terminal state
 * (expired, cancelled, or completed).
 *
 * This function sets the `expiresAt` field on each conversation, which triggers
 * MongoDB's TTL index to automatically delete the document when the time comes.
 *
 * @param dataSources - The data sources for accessing domain and readonly data
 * @returns A function that takes the command and returns the result
 */
export const scheduleDeletionByListing = (dataSources: DataSources) => {
	return async (
		command: ScheduleDeletionByListingCommand,
	): Promise<ScheduleDeletionResult> => {
		return await tracer.startActiveSpan(
			'conversation.scheduleDeletionByListing',
			async (span) => {
				try {
					span.setAttribute('listingId', command.listingId);
					span.setAttribute('archivalDate', command.archivalDate.toISOString());

					// Find all conversations associated with the listing
					const conversations =
						await dataSources.readonlyDataSource.Conversation.Conversation.ConversationReadRepo.getByListingId(
							command.listingId,
						);

					if (conversations.length === 0) {
						span.setAttribute('scheduledCount', 0);
						span.setStatus({
							code: SpanStatusCode.OK,
							message: 'No conversations to schedule',
						});
						span.end();
						return { scheduledCount: 0, conversationIds: [] };
					}

					const scheduledIds: string[] = [];

					// Schedule each conversation for deletion
					await dataSources.domainDataSource.Conversation.Conversation.ConversationUnitOfWork.withScopedTransaction(
						async (repo) => {
							for (const conversationRef of conversations) {
								const conversation = await repo.get(conversationRef.id);
								if (conversation) {
									// Schedule deletion 6 months from archival date
									conversation.scheduleForDeletion(command.archivalDate);
									await repo.save(conversation);
									scheduledIds.push(conversation.id);
								}
							}
						},
					);

					span.setAttribute('scheduledCount', scheduledIds.length);
					span.setAttribute('conversationIds', scheduledIds.join(','));
					span.setStatus({ code: SpanStatusCode.OK });
					span.end();

					console.log(
						`[ConversationDeletion] Scheduled ${scheduledIds.length} conversation(s) for deletion. ` +
							`ListingId: ${command.listingId}, ArchivalDate: ${command.archivalDate.toISOString()}`,
					);

					return {
						scheduledCount: scheduledIds.length,
						conversationIds: scheduledIds,
					};
				} catch (error) {
					span.setStatus({ code: SpanStatusCode.ERROR });
					if (error instanceof Error) {
						span.recordException(error);
					}
					span.end();
					console.error(
						`[ConversationDeletion] Failed to schedule deletion for listing ${command.listingId}:`,
						error,
					);
					throw error;
				}
			},
		);
	};
};
