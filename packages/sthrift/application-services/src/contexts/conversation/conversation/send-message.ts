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
		// Check conversation existence first before validating content
		const conversation =
			await dataSources.readonlyDataSource.Conversation.Conversation.ConversationReadRepo.getById(
				command.conversationId,
			);
		if (!conversation) {
			throw new Error(`Conversation not found for id ${command.conversationId}`);
		}

		// Validate that authorId is a participant (sharer or reserver)
		// This enforces the invariant at the application boundary rather than relying solely on downstream permission checks
		const isParticipant =
			conversation.sharer?.id === command.authorId ||
			conversation.reserver?.id === command.authorId;
		if (!isParticipant) {
			throw new Error('Author must be a participant (sharer or reserver) in the conversation');
		}

		// Only construct MessageContent after confirming conversation exists and author is participant
		// This avoids invoking domain validation on obviously invalid requests
		const messageContent = new Domain.Contexts.Conversation.Conversation.MessageContent(
			command.content,
		);

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
