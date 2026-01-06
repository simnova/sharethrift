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
		// NOTE: Authorization is intentionally not enforced at this service layer.
		// Callers (currently GraphQL resolvers using Passport)
		return await dataSources.messagingDataSource.Conversation.Conversation.MessagingConversationRepo.sendMessage(
			conversation,
			messageContents.valueOf(),
			command.authorId,
		);
	};
};
