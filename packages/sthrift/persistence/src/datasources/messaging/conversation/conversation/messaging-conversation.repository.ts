import type { Domain } from '@sthrift/domain';
import type { MessagingService } from '@cellix/messaging';
import { toDomainMessage } from './messaging-conversation.domain-adapter.ts';
import { ObjectId } from 'mongodb';

export interface MessagingConversationRepository {
	getMessages: (
		conversationId: string,
	) => Promise<Domain.Contexts.Conversation.Conversation.MessageEntityReference[]>;

	sendMessage: (
		conversationId: string,
		body: string,
		author: string,
	) => Promise<Domain.Contexts.Conversation.Conversation.MessageEntityReference>;

	deleteConversation: (conversationId: string) => Promise<void>;
}

export class MessagingConversationRepositoryImpl implements MessagingConversationRepository {
	private readonly messagingService: MessagingService;

	constructor(messagingService: MessagingService, _passport: Domain.Passport) {
		this.messagingService = messagingService;
	}

	async getMessages(
		conversationId: string,
	): Promise<Domain.Contexts.Conversation.Conversation.MessageEntityReference[]> {
		try {
			const messages = await this.messagingService.getMessages(conversationId);
			
			return messages.map((msg) => {
				const authorId = msg.author ? new ObjectId(msg.author) : new ObjectId();
				return toDomainMessage(msg, authorId);
			});
		} catch (error) {
			console.error(`Error fetching messages for conversation ${conversationId}:`, error);
			return [];
		}
	}

	async sendMessage(
		conversationId: string,
		body: string,
		author: string,
	): Promise<Domain.Contexts.Conversation.Conversation.MessageEntityReference> {
		try {
			const message = await this.messagingService.sendMessage(
				conversationId,
				body,
				author,
			);

			const authorId = new ObjectId(author);
			return toDomainMessage(message, authorId);
		} catch (error) {
			console.error('Error sending message to messaging service:', error);
			throw error;
		}
	}

	async deleteConversation(conversationId: string): Promise<void> {
		try {
			await this.messagingService.deleteConversation(conversationId);
		} catch (error) {
			console.error('Error deleting conversation from messaging service:', error);
			throw error;
		}
	}
}

export const getMessagingConversationRepository = (
	messagingService: MessagingService,
	passport: Domain.Passport,
): MessagingConversationRepository => {
	return new MessagingConversationRepositoryImpl(messagingService, passport);
};
