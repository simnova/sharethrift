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
			if (!dataSources.messagingDataSource) {
				console.warn(`[Conversation ${conversation.id}] Messaging datasource not available, using MongoDB messages`);
				return conversation;
			}

			const twilioMessages = await dataSources.messagingDataSource.Conversation.Conversation.MessagingConversationRepo.getMessages(
				conversation.twilioConversationId
			);

			const domainMessages = twilioMessages.map((msg) => {
				const authorId = new ObjectId(msg.authorId);

				return new Domain.Contexts.Conversation.Conversation.Message({
					id: new ObjectId().toHexString(),
					twilioMessageSid: msg.twilioMessageSid,
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
			console.warn(`[Conversation ${conversation.id}] Failed to fetch Twilio messages, using MongoDB fallback:`, error);
			return conversation;
		}
	};
};
