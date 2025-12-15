import type { Domain } from '@sthrift/domain';
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
		// Validate input - non-empty content
		if (!command.content || command.content.trim().length === 0) {
			throw new Error('Message content cannot be empty');
		}

		// Validate character limit per BRD/SRD (2000 characters max as per MessageContent value object)
		if (command.content.trim().length > 2000) {
			throw new Error('Message content exceeds maximum length of 2000 characters');
		}

		// Get the conversation to verify it exists and user is a participant
		const conversation = await dataSources.readonlyDataSource.Conversation.Conversation.ConversationReadRepo.getById(
			command.conversationId,
		);

		if (!conversation) {
			throw new Error(`Conversation not found for id ${command.conversationId}`);
		}

		// Authorization check: Only participants can send messages
		const isParticipant = 
			conversation.sharer.id === command.authorId || 
			conversation.reserver.id === command.authorId;

		if (!isParticipant) {
			throw new Error('You are not authorized to send messages in this conversation');
		}

		// Check if messaging data source is available
		if (!dataSources.messagingDataSource) {
			throw new Error('Messaging data source is not available');
		}

		try {
			// Send message via messaging service
			return await dataSources.messagingDataSource.Conversation.Conversation.MessagingConversationRepo.sendMessage(
				conversation.messagingConversationId,
				command.content.trim(),
				command.authorId,
			);
		} catch (error) {
			console.error('Failed to send message - Full error:', error);
			throw new Error(
				`Failed to send message: ${error instanceof Error ? error.message : String(error)}`,
			);
		}
	};
};
