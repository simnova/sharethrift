import { Domain } from '@sthrift/domain';
import type { MessagingService } from '@cellix/messaging-service';
import { DomainSeedwork } from '@cellix/domain-seedwork';
import { toDomainMessage } from './messaging-conversation.domain-adapter.ts';

export interface MessagingConversationRepository {
	getMessages: (
		conversationId: string,
	) => Promise<Domain.Contexts.Conversation.Conversation.MessageEntityReference[]>;

	sendMessage: (
		conversation: Domain.Contexts.Conversation.Conversation.ConversationEntityReference,
		body: string,
		authorId: string,
	) => Promise<Domain.Contexts.Conversation.Conversation.MessageEntityReference>;

	deleteConversation: (conversationId: string) => Promise<void>;

	createConversation: (
		displayName: string,
		uniqueIdentifier: string,
	) => Promise<{ id: string; displayName?: string }>;
}

export class MessagingConversationRepositoryImpl implements MessagingConversationRepository {
	private readonly messagingService: MessagingService;
	private readonly passport: Domain.Passport;

	constructor(messagingService: MessagingService, passport: Domain.Passport) {
		this.messagingService = messagingService;
		this.passport = passport;
	}

	async getMessages(
		conversationId: string,
	): Promise<Domain.Contexts.Conversation.Conversation.MessageEntityReference[]> {
		try {
			const messages = await this.messagingService.getMessages(conversationId);
			
			return messages.map((msg) => {
				const authorId = msg.author 
					? new Domain.Contexts.Conversation.Conversation.AuthorId(msg.author) 
					: new Domain.Contexts.Conversation.Conversation.AuthorId(Domain.Contexts.Conversation.Conversation.ANONYMOUS_AUTHOR_ID);
				return toDomainMessage(msg, authorId);
			});
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : 'Unknown error';
			console.error(`Error fetching messages for conversation ${conversationId}:`, { errorMessage });
			return [];
		}
	}

	async sendMessage(
		conversation: Domain.Contexts.Conversation.Conversation.ConversationEntityReference,
		body: string,
		authorId: string,
	): Promise<Domain.Contexts.Conversation.Conversation.MessageEntityReference> {
		const visa = this.passport.conversation.forConversation(conversation);
		if (!visa.determineIf((permissions: Domain.Contexts.Conversation.ConversationDomainPermissions) => permissions.canManageConversation)) {
			throw new DomainSeedwork.PermissionError('Not authorized to send message in this conversation');
		}

		try {
			const message = await this.messagingService.sendMessage(
				conversation.messagingConversationId,
				body,
				authorId,
			);

			const author = new Domain.Contexts.Conversation.Conversation.AuthorId(authorId);
			return toDomainMessage(message, author);
		} catch (error: unknown) {
			// Scoped, contextual logging around external messaging service call
			// Normalize error to avoid logging sensitive information from messaging service
			const errorMessage = error instanceof Error ? error.message : 'Unknown error';
			console.error('MessagingConversationRepository.sendMessage failed', {
				conversationId: conversation.id ?? conversation.messagingConversationId,
				authorId,
				errorMessage,
			});
			throw error;
		}
	}

	async deleteConversation(conversationId: string): Promise<void> {
		try {
			await this.messagingService.deleteConversation(conversationId);
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : 'Unknown error';
			console.error('Error deleting conversation from messaging service:', { conversationId, errorMessage });
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
			const result: { id: string; displayName?: string } = {
				id: conversation.id,
			};
			if (conversation.displayName) {
				result.displayName = conversation.displayName;
			}
			return result;
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : 'Unknown error';
			console.error('Error creating conversation in messaging service:', { displayName, uniqueIdentifier, errorMessage });
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
