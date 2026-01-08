import type { MessagingService } from '@cellix/messaging-service';
import { Domain } from '@sthrift/domain';
import { toDomainMessage } from './messaging-conversation.domain-adapter.ts';

export interface MessagingConversationRepository {
	getMessages: (
		conversationId: string,
	) => Promise<
		Domain.Contexts.Conversation.Conversation.MessageEntityReference[]
	>;
	) => Promise<
		Domain.Contexts.Conversation.Conversation.MessageEntityReference[]
	>;

	sendMessage: (
		conversation: Domain.Contexts.Conversation.Conversation.ConversationEntityReference,
		contents: string[],
		authorId: string,
	) => Promise<Domain.Contexts.Conversation.Conversation.MessageEntityReference>;

	deleteConversation: (conversationId: string) => Promise<void>;

	createConversation: (
		displayName: string,
		uniqueIdentifier: string,
	) => Promise<{ id: string; displayName?: string }>;
}

export class MessagingConversationRepositoryImpl
	implements MessagingConversationRepository
{
export class MessagingConversationRepositoryImpl
	implements MessagingConversationRepository
{
	private readonly messagingService: MessagingService;

	constructor(messagingService: MessagingService) {
		this.messagingService = messagingService;
	}

	async getMessages(
		conversationId: string,
	): Promise<
		Domain.Contexts.Conversation.Conversation.MessageEntityReference[]
	> {
	): Promise<
		Domain.Contexts.Conversation.Conversation.MessageEntityReference[]
	> {
		try {
			const messages = await this.messagingService.getMessages(conversationId);

			return messages.map((msg) => {
				if (!msg.author) {
					throw new Error(
						`Message ${msg.id} has no author - all messages must have an author`,
					);
				}
				const authorId =
					new Domain.Contexts.Conversation.Conversation.AuthorId(msg.author);
				return toDomainMessage(msg, authorId);
			});
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : 'Unknown error';
			console.error(
				`Error fetching messages for conversation ${conversationId}:`,
				{ errorMessage },
			);
			return [];
		}
	}

	async sendMessage(
		conversation: Domain.Contexts.Conversation.Conversation.ConversationEntityReference,
		contents: string[],
		authorId: string,
	): Promise<Domain.Contexts.Conversation.Conversation.MessageEntityReference> {
		// Join content items into a single message body for the messaging service
		// The underlying service (Twilio) expects a single string body
		const body = contents.join('\n\n');

		const message = await this.messagingService.sendMessage(
			conversation.messagingConversationId,
			body,
			authorId,
		);

		const author = new Domain.Contexts.Conversation.Conversation.AuthorId(
			authorId,
		);
		return toDomainMessage(message, author);
	}

	async deleteConversation(conversationId: string): Promise<void> {
		try {
			await this.messagingService.deleteConversation(conversationId);
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : 'Unknown error';
			console.error(
				'Error deleting conversation from messaging service:',
				{
				conversationId,
				errorMessage,
			},
			);
			throw error;
		}
	}

	async createConversation(
		displayName: string,
		uniqueIdentifier: string,
	): Promise<{ id: string; displayName?: string }> {
		try {
			const conversation = await this.messagingService.createConversation(
				displayName,
				uniqueIdentifier,
			);
			if (conversation.displayName) {
				return {
					id: conversation.id,
					displayName: conversation.displayName,
				};
			}
			return { id: conversation.id };
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : 'Unknown error';
			console.error('Error creating conversation in messaging service:', {
				displayName,
				uniqueIdentifier,
				errorMessage,
			});
			throw error;
		}
	}
}

export const getMessagingConversationRepository = (
	messagingService: MessagingService,
): MessagingConversationRepository => {
	return new MessagingConversationRepositoryImpl(messagingService);
};
