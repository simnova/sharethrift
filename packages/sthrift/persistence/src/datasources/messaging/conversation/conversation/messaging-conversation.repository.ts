import { Domain } from '@sthrift/domain';
import type { MessagingService } from '@cellix/messaging';
import { toDomainConversationProps, toDomainMessage } from './messaging-conversation.domain-adapter.ts';
import type {
	MessagingConversationResponse,
	MessagingMessageResponse,
} from './messaging-conversation.types.ts';
import { ObjectId } from 'bson';

/**
 * Repository for Messaging Conversation Operations
 * 
 * This repository acts as a bridge between the messaging service API (real or mock) and the domain layer.
 * It fetches data from the messaging service and converts it to domain entities.
 * 
 * Key Responsibilities:
 * 1. Call messaging service to fetch conversation data (uses mock or real based on environment)
 * 2. Convert messaging API responses to domain entities using the adapter
 * 3. Handle errors and edge cases
 * 4. Provide a clean interface for the application layer
 */
export interface MessagingConversationRepository {
	getConversationBySid: (
		conversationId: string,
	) => Promise<Domain.Contexts.Conversation.Conversation.ConversationEntityReference | null>;

	listConversations: () => Promise<Domain.Contexts.Conversation.Conversation.ConversationEntityReference[]>;

	getMessages: (
		conversationId: string,
	) => Promise<Domain.Contexts.Conversation.Conversation.MessageEntityReference[]>;

	sendMessage: (
		conversationId: string,
		body: string,
		author: string,
	) => Promise<Domain.Contexts.Conversation.Conversation.MessageEntityReference>;

	deleteConversation: (conversationId: string) => Promise<void>;

	createConversation: (
		displayName?: string,
		uniqueIdentifier?: string,
	) => Promise<Domain.Contexts.Conversation.Conversation.ConversationEntityReference>;
}

export class MessagingConversationRepositoryImpl implements MessagingConversationRepository {
	private readonly messagingService: MessagingService;
	private readonly passport: Domain.Passport;

	constructor(messagingService: MessagingService, passport: Domain.Passport) {
		this.messagingService = messagingService;
		this.passport = passport;
	}

	/**
	 * Note: Currently creates stub entities for sharer, reserver, and listing.
	 * In a real implementation, you would fetch these from the database or other sources.
	 */
	async getConversationBySid(
		conversationId: string,
	): Promise<Domain.Contexts.Conversation.Conversation.ConversationEntityReference | null> {
		try {
			const facadeConv = await this.messagingService.getConversation(conversationId);

			const messagingConv: MessagingConversationResponse = {
				id: facadeConv.id,
				createdAt: facadeConv.createdAt?.toISOString() ?? new Date().toISOString(),
				updatedAt: facadeConv.updatedAt?.toISOString() ?? new Date().toISOString(),
				...(facadeConv.displayName !== undefined && { displayName: facadeConv.displayName }),
				...(facadeConv.state !== undefined && { state: facadeConv.state }),
				...(facadeConv.metadata !== undefined && { metadata: facadeConv.metadata }),
			};

			// TODO: In a real implementation, fetch actual user and listing data
			// For now, create stub entities
			const stubSharer = this.createStubUser('sharer-id');
			const stubReserver = this.createStubUser('reserver-id');
			const stubListing = this.createStubListing('listing-id');

			const conversationProps = toDomainConversationProps(
				messagingConv,
				stubSharer,
				stubReserver,
				stubListing,
				[],
			);

			return new Domain.Contexts.Conversation.Conversation.Conversation(
				conversationProps,
				this.passport,
			);
		} catch (error) {
			console.error('Error fetching conversation from messaging service:', error);
			return null;
		}
	}

	async getMessages(
		conversationId: string,
	): Promise<Domain.Contexts.Conversation.Conversation.MessageEntityReference[]> {
		try {
			const facadeMessages = await this.messagingService.getMessages(conversationId);
			
			const messages = facadeMessages.map(msg => ({
				id: msg.id,
				body: msg.body,
				author: msg.author,
				createdAt: msg.createdAt?.toISOString() || new Date().toISOString(),
				metadata: msg.metadata,
			} as MessagingMessageResponse));
			
			return messages.map((msg) => {
				const messagingId = msg.metadata?.originalSid || msg.id;
				const messagingMessageId = new Domain.Contexts.Conversation.Conversation.MessagingMessageId(messagingId);
				const content = new Domain.Contexts.Conversation.Conversation.MessageContent(msg.body);
				
				const authorId = new ObjectId(msg.author);
				
				return new Domain.Contexts.Conversation.Conversation.Message({
					id: msg.id,
					messagingMessageId,
					authorId,
					content,
					createdAt: new Date(msg.createdAt),
				});
			});
		} catch (error) {
			console.error(`Error fetching messages for conversation ${conversationId}:`, error);
			return [];
		}
	}

	async listConversations(): Promise<Domain.Contexts.Conversation.Conversation.ConversationEntityReference[]> {
		try {
			const facadeConversations = await this.messagingService.listConversations();

			// TODO: Fetch actual user and listing data for each conversation
			const stubSharer = this.createStubUser('sharer-id');
			const stubReserver = this.createStubUser('reserver-id');
			const stubListing = this.createStubListing('listing-id');

			return facadeConversations.map((conv) => {
				const messagingConv: MessagingConversationResponse = {
					id: conv.id,
					createdAt: conv.createdAt?.toISOString() ?? new Date().toISOString(),
					updatedAt: conv.updatedAt?.toISOString() ?? new Date().toISOString(),
					...(conv.displayName !== undefined && { displayName: conv.displayName }),
					...(conv.state !== undefined && { state: conv.state }),
					...(conv.metadata !== undefined && { metadata: conv.metadata }),
				};
				
				const props = toDomainConversationProps(
					messagingConv,
					stubSharer,
					stubReserver,
					stubListing,
					[],
				);
				return new Domain.Contexts.Conversation.Conversation.Conversation(props, this.passport);
			});
		} catch (error) {
			console.error('Error listing conversations from messaging service:', error);
			return [];
		}
	}

	async sendMessage(
		conversationId: string,
		body: string,
		author: string,
	): Promise<Domain.Contexts.Conversation.Conversation.MessageEntityReference> {
		try {
			const facadeMsg = await this.messagingService.sendMessage(
				conversationId,
				body,
				author,
			);

			const messagingMsg: MessagingMessageResponse = {
				id: facadeMsg.id,
				body: facadeMsg.body,
				createdAt: facadeMsg.createdAt?.toISOString() ?? new Date().toISOString(),
				...(facadeMsg.author !== undefined && { author: facadeMsg.author }),
				...(facadeMsg.metadata !== undefined && { metadata: facadeMsg.metadata }),
			};

			// TODO: Map author email to actual user ObjectId
			// For now, create a stub ObjectId
			const authorId = new ObjectId();

			return toDomainMessage(
				messagingMsg,
				authorId,
			);
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

	async createConversation(
		displayName?: string,
		uniqueIdentifier?: string,
	): Promise<Domain.Contexts.Conversation.Conversation.ConversationEntityReference> {
		try {
			const facadeConv = await this.messagingService.createConversation(displayName, uniqueIdentifier);

			// TODO: Get actual user and listing data
			const stubSharer = this.createStubUser('sharer-id');
			const stubReserver = this.createStubUser('reserver-id');
			const stubListing = this.createStubListing('listing-id');

			const messagingConv: MessagingConversationResponse = {
				id: facadeConv.id,
				createdAt: facadeConv.createdAt?.toISOString() ?? new Date().toISOString(),
				updatedAt: facadeConv.updatedAt?.toISOString() ?? new Date().toISOString(),
				...(facadeConv.displayName !== undefined && { displayName: facadeConv.displayName }),
				...(facadeConv.state !== undefined && { state: facadeConv.state }),
				...(facadeConv.metadata !== undefined && { metadata: facadeConv.metadata }),
			};

			const conversationProps = toDomainConversationProps(
				messagingConv,
				stubSharer,
				stubReserver,
				stubListing,
				[],
			);

			return new Domain.Contexts.Conversation.Conversation.Conversation(
				conversationProps,
				this.passport,
			);
		} catch (error) {
			console.error('Error creating conversation in messaging service:', error);
			throw error;
		}
	}

	/**
	 * Helper method to create a stub user entity
	 * TODO: Replace with actual user lookup from database
	 */
	private createStubUser(
		userId: string,
	): Domain.Contexts.User.PersonalUser.PersonalUserEntityReference {
		// Return a minimal stub - in real implementation, fetch from database
		return {
			id: userId,
		} as unknown as Domain.Contexts.User.PersonalUser.PersonalUserEntityReference;
	}

	/**
	 * Helper method to create a stub listing entity
	 * TODO: Replace with actual listing lookup from database
	 */
	private createStubListing(
		listingId: string,
	): Domain.Contexts.Listing.ItemListing.ItemListingEntityReference {
		return {
			id: listingId,
		} as unknown as Domain.Contexts.Listing.ItemListing.ItemListingEntityReference;
	}
}

export const getMessagingConversationRepository = (
	messagingService: MessagingService,
	passport: Domain.Passport,
): MessagingConversationRepository => {
	return new MessagingConversationRepositoryImpl(messagingService, passport);
};
