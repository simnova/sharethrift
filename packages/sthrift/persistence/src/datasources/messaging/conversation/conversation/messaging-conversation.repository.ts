import { Domain } from '@sthrift/domain';
import type { IMessagingService } from '@cellix/messaging';
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
		twilioSid: string,
	) => Promise<Domain.Contexts.Conversation.Conversation.ConversationEntityReference | null>;

	listConversations: () => Promise<Domain.Contexts.Conversation.Conversation.ConversationEntityReference[]>;

	getMessages: (
		conversationSid: string,
	) => Promise<Domain.Contexts.Conversation.Conversation.MessageEntityReference[]>;

	sendMessage: (
		twilioConversationSid: string,
		body: string,
		author: string,
	) => Promise<Domain.Contexts.Conversation.Conversation.MessageEntityReference>;

	deleteConversation: (twilioSid: string) => Promise<void>;

	createConversation: (
		friendlyName?: string,
		uniqueName?: string,
	) => Promise<Domain.Contexts.Conversation.Conversation.ConversationEntityReference>;
}

export class MessagingConversationRepositoryImpl implements MessagingConversationRepository {
	private readonly messagingService: IMessagingService;
	private readonly passport: Domain.Passport;

	constructor(messagingService: IMessagingService, passport: Domain.Passport) {
		this.messagingService = messagingService;
		this.passport = passport;
	}

	/**
	 * Get a conversation from messaging service by its SID and convert to domain entity
	 * 
	 * This method:
	 * 1. Calls messaging service getConversation() which routes to mock or real service
	 * 2. Converts the messaging API response to domain ConversationProps
	 * 3. Returns a Conversation domain entity
	 * 
	 * Note: Currently creates stub entities for sharer, reserver, and listing.
	 * In a real implementation, you would fetch these from the database or other sources.
	 */
	async getConversationBySid(
		twilioSid: string,
	): Promise<Domain.Contexts.Conversation.Conversation.ConversationEntityReference | null> {
		try {
			// Fetch from messaging service (mock or real, depending on configuration)
			const twilioConv = await this.messagingService.getConversation(twilioSid) as unknown as MessagingConversationResponse;

			// TODO: In a real implementation, fetch actual user and listing data
			// For now, create stub entities
			const stubSharer = this.createStubUser('sharer-id');
			const stubReserver = this.createStubUser('reserver-id');
			const stubListing = this.createStubListing('listing-id');

			// Convert Twilio response to domain props
			const conversationProps = toDomainConversationProps(
				twilioConv,
				stubSharer,
				stubReserver,
				stubListing,
				[], // Messages loaded separately if needed
			);

			// Create and return domain entity
			return new Domain.Contexts.Conversation.Conversation.Conversation(
				conversationProps,
				this.passport,
			);
		} catch (error) {
			console.error('Error fetching conversation from Twilio:', error);
			return null;
		}
	}

	/**
	 * Get messages for a conversation from messaging service
	 * 
	 * This method fetches messages from Twilio and converts them to domain Message entities.
	 * It returns raw messages without user context - the caller should map authors to users.
	 */
	async getMessages(
		conversationSid: string,
	): Promise<Domain.Contexts.Conversation.Conversation.MessageEntityReference[]> {
		try {
			const twilioMessages = await this.messagingService.getMessages(conversationSid);
			
			// Convert Twilio messages to domain Message entities
			// Note: authorId is set to a placeholder - caller should map to real user IDs
			return twilioMessages.map((msg) => {
				const twilioMessageSid = new Domain.Contexts.Conversation.Conversation.TwilioMessageSid(msg.sid);
				const content = new Domain.Contexts.Conversation.Conversation.MessageContent(msg.body);
				
				// Use placeholder authorId - caller will map based on conversation context
				const authorId = new ObjectId(msg.author);
				
				return new Domain.Contexts.Conversation.Conversation.Message({
					id: msg.sid,
					twilioMessageSid,
					authorId,
					content,
					createdAt: msg.dateCreated ?? new Date(),
				});
			});
		} catch (error) {
			console.error(`Error fetching messages for conversation ${conversationSid}:`, error);
			return [];
		}
	}

	/**
	 * List all conversations from messaging service
	 */
	async listConversations(): Promise<Domain.Contexts.Conversation.Conversation.ConversationEntityReference[]> {
		try {
			const conversations = await this.messagingService.listConversations();

			// TODO: Fetch actual user and listing data for each conversation
			const stubSharer = this.createStubUser('sharer-id');
			const stubReserver = this.createStubUser('reserver-id');
			const stubListing = this.createStubListing('listing-id');

			return conversations.map((twilioConv) => {
				const props = toDomainConversationProps(
					{
						sid: twilioConv.sid,
						friendly_name: twilioConv.friendlyName ?? '',
						date_created: twilioConv.dateCreated?.toISOString() ?? new Date().toISOString(),
						date_updated: twilioConv.dateUpdated?.toISOString() ?? new Date().toISOString(),
					} as MessagingConversationResponse,
					stubSharer,
					stubReserver,
					stubListing,
					[],
				);
				return new Domain.Contexts.Conversation.Conversation.Conversation(props, this.passport);
			});
		} catch (error) {
			console.error('Error listing conversations from Twilio:', error);
			return [];
		}
	}

	/**
	 * Send a message to a messaging conversation
	 * 
	 * This method:
	 * 1. Calls messaging service sendMessage() which routes to mock or real service
	 * 2. Converts the messaging message response to a domain Message entity
	 * 3. Returns the Message entity
	 */
	async sendMessage(
		_twilioConversationSid: string,
		body: string,
		author: string,
	): Promise<Domain.Contexts.Conversation.Conversation.MessageEntityReference> {
		try {
			// Send message via messaging service (mock or real)
			const twilioMsg = await this.messagingService.sendMessage(
				_twilioConversationSid,
				body,
				author,
			) as unknown as MessagingMessageResponse;

			// TODO: Map author email to actual user ObjectId
			// For now, create a stub ObjectId
			const authorId = new ObjectId();

			// Convert to domain entity
			return toDomainMessage(
				twilioMsg,
				authorId,
			);
		} catch (error) {
			console.error('Error sending message to Twilio:', error);
			throw error;
		}
	}

	/**
	 * Delete a conversation from messaging service
	 */
	async deleteConversation(twilioSid: string): Promise<void> {
		try {
			await this.messagingService.deleteConversation(twilioSid);
		} catch (error) {
			console.error('Error deleting conversation from messaging service:', error);
			throw error;
		}
	}

	/**
	 * Create a new conversation in messaging service
	 */
	async createConversation(
		friendlyName?: string,
		uniqueName?: string,
	): Promise<Domain.Contexts.Conversation.Conversation.ConversationEntityReference> {
		try {
			const twilioConv = await this.messagingService.createConversation(friendlyName, uniqueName);

			// TODO: Get actual user and listing data
			const stubSharer = this.createStubUser('sharer-id');
			const stubReserver = this.createStubUser('reserver-id');
			const stubListing = this.createStubListing('listing-id');

			const conversationProps = toDomainConversationProps(
				{
					sid: twilioConv.sid,
					friendly_name: twilioConv.friendlyName ?? '',
					date_created: twilioConv.dateCreated?.toISOString() ?? new Date().toISOString(),
					date_updated: twilioConv.dateUpdated?.toISOString() ?? new Date().toISOString(),
				} as MessagingConversationResponse,
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
	messagingService: IMessagingService,
	passport: Domain.Passport,
): MessagingConversationRepository => {
	return new MessagingConversationRepositoryImpl(messagingService, passport);
};
