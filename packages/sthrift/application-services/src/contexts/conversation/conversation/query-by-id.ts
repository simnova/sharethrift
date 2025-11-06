import { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';
import { ObjectId } from 'bson';

export interface ConversationQueryByIdCommand {
	conversationId: string;
	fields?: string[];
}

export const queryById = (dataSources: DataSources) => {
	return async (
		command: ConversationQueryByIdCommand,
	): Promise<Domain.Contexts.Conversation.Conversation.ConversationEntityReference | null> => {
		const conversation = await dataSources.readonlyDataSource.Conversation.Conversation.ConversationReadRepo.getById(
			command.conversationId,
			{ fields: command.fields },
		);

		if (!conversation) {
			return null;
		}

		try {
			const messagingMessages = await dataSources.messagingDataSource?.Conversation.Conversation.MessagingConversationRepo.getMessages(
				conversation.messagingConversationId
			);

            if (!messagingMessages) {
                return conversation;
            }

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
	};
};
