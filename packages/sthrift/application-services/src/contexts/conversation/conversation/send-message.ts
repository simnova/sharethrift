import { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';

export interface ConversationSendMessageCommand {
	conversationId: string;
	messageContents: string[];
	authorId: string;
}

export const sendMessage = (dataSources: DataSources) => {
	return async (
		command: ConversationSendMessageCommand,
	): Promise<Domain.Contexts.Conversation.Conversation.MessageEntityReference> => {
		// Check conversation existence
		const conversation =
			await dataSources.readonlyDataSource.Conversation.Conversation.ConversationReadRepo.getById(
				command.conversationId,
			);
		if (!conversation) {
			throw new Error(
				`Conversation not found for id ${command.conversationId}`,
			);
		}

		// Construct MessageContents value object - validates content constraints
		const messageContents =
			new Domain.Contexts.Conversation.Conversation.MessageContents(
				command.messageContents,
			);

		if (!dataSources.messagingDataSource) {
			throw new Error('Messaging data source is not available');
		}

		// Send via messaging repository
		// Authorization is handled at the GraphQL resolver layer via passport
		return await dataSources.messagingDataSource.Conversation.Conversation.MessagingConversationRepo.sendMessage(
			conversation,
			messageContents.valueOf(),
			command.authorId,
		);
	};
};
