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
					
					return {
						...conversation,
						messages: domainMessages,
						loadMessages: async () => domainMessages,
					};
				} catch (error) {
					console.warn(`[Conversation ${conversation.id}] Failed to fetch messaging messages, using MongoDB fallback:`, error);
					return conversation;
				}
			})
		);
	};
};
