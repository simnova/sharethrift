import type { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';

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
					const messagingMessages = await dataSources.messagingDataSource?.Conversation.Conversation.MessagingConversationRepo.getMessages(
						conversation.messagingConversationId
					);

                    if (!messagingMessages) {
                        return conversation;
                    }

					const result: Domain.Contexts.Conversation.Conversation.ConversationEntityReference = {
						id: conversation.id,
						sharer: conversation.sharer,
						loadSharer: conversation.loadSharer.bind(conversation),
						reserver: conversation.reserver,
						loadReserver: conversation.loadReserver.bind(conversation),
						listing: conversation.listing,
						loadListing: conversation.loadListing.bind(conversation),
						messagingConversationId: conversation.messagingConversationId,
						twilioConversationId: conversation.twilioConversationId,
						messages: messagingMessages,
						loadMessages: async () => messagingMessages,
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
