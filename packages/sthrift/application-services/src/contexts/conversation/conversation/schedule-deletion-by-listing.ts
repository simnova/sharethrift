import type { DataSources } from '@sthrift/persistence';
import { trace, SpanStatusCode } from '@opentelemetry/api';

const tracer = trace.getTracer('conversation:schedule-deletion');

export interface ScheduleDeletionByListingCommand {
	listingId: string;
	archivalDate: Date;
}

export interface ScheduleDeletionResult {
	scheduledCount: number;
	conversationIds: string[];
}

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

					await dataSources.domainDataSource.Conversation.Conversation.ConversationUnitOfWork.withScopedTransaction(
						async (repo) => {
							for (const conversationRef of conversations) {
								const conversation = await repo.get(conversationRef.id);
								if (conversation) {
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
