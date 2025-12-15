import { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';

export interface ConversationSendMessageCommand {
	conversationId: string;
	content: string;
	authorId: string;
}

export const sendMessage = (dataSources: DataSources) => {
	return async (
		command: ConversationSendMessageCommand,
	): Promise<Domain.Contexts.Conversation.Conversation.MessageEntityReference> => {
		const messageContent = new Domain.Contexts.Conversation.Conversation.MessageContent(
			command.content,
		);

		const conversation =
			await dataSources.readonlyDataSource.Conversation.Conversation.ConversationReadRepo.getById(
				command.conversationId,
			);
		if (!conversation) {
			throw new Error(`Conversation not found for id ${command.conversationId}`);
		}

		if (!dataSources.messagingDataSource) {
			throw new Error('Messaging data source is not available');
		}

		return await dataSources.messagingDataSource.Conversation.Conversation.MessagingConversationRepo.sendMessage(
			conversation,
			messageContent.valueOf(),
			command.authorId,
		);
	};
};
