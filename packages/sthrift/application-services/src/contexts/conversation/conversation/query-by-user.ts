import { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';
import { ObjectId } from 'bson';

export interface ConversationQueryByUserCommand {
	userId: string;
	fields?: string[];
}

export const queryByUser = (dataSources: DataSources) => {
	return async (
		command: ConversationQueryByUserCommand,
	): Promise<
		Domain.Contexts.Conversation.Conversation.ConversationEntityReference[]
	> => {
		const mongoConversations = await dataSources.readonlyDataSource.Conversation.Conversation.ConversationReadRepo.getByUser(
			command.userId,
			{ fields: command.fields },
		);
		
		return await Promise.all(
			mongoConversations.map(async (conversation) => {
				try {
					if (!dataSources.messagingDataSource) {
						console.warn(`[Conversation ${conversation.id}] Messaging datasource not available, using MongoDB messages`);
						return conversation;
					}

					const messagingMessages = await dataSources.messagingDataSource.Conversation.Conversation.MessagingConversationRepo.getMessages(
						conversation.messagingConversationId
					);

					const domainMessages = messagingMessages.map((msg) => {
						const authorId = new ObjectId(msg.authorId);

						return new Domain.Contexts.Conversation.Conversation.Message({
							id: msg.id,
							messagingMessageId: msg.messagingMessageId,
							authorId,
							content: msg.content,
							createdAt: msg.createdAt,
						});
					});
					
					// Return a plain object that implements ConversationEntityReference
					// by evaluating all getters from the conversation aggregate
					const result: Domain.Contexts.Conversation.Conversation.ConversationEntityReference = {
						id: conversation.id,
						sharer: conversation.sharer,
						loadSharer: conversation.loadSharer.bind(conversation),
						reserver: conversation.reserver,
						loadReserver: conversation.loadReserver.bind(conversation),
						listing: conversation.listing,
						loadListing: conversation.loadListing.bind(conversation),
						messagingConversationId: conversation.messagingConversationId,
						messages: domainMessages,
						loadMessages: async () => domainMessages,
						createdAt: conversation.createdAt,
						updatedAt: conversation.updatedAt,
						schemaVersion: conversation.schemaVersion,
					};
					return result;
				} catch (error) {
					console.warn(`[Conversation ${conversation.id}] Failed to fetch messaging messages, using MongoDB fallback:`, error);
					return conversation;
				}
			})
		);
	};
};
