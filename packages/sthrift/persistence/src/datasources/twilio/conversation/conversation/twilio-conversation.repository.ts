import { Domain } from '@sthrift/domain';
import type { ServiceTwilio } from '@sthrift/service-twilio';
import { toDomainConversationProps, toDomainMessage } from './twilio-conversation.domain-adapter.ts';
import type {
	TwilioConversationResponse,
	TwilioMessageResponse,
} from './twilio-conversation.types.ts';
import { ObjectId } from 'bson';

/**
 * Repository for Twilio Conversation Operations
 * 
 * This repository acts as a bridge between the Twilio API (real or mock) and the domain layer.
 * It fetches data from Twilio via ServiceTwilio and converts it to domain entities.
 * 
 * Key Responsibilities:
 * 1. Call ServiceTwilio to fetch conversation data (uses mock or real based on environment)
 * 2. Convert Twilio API responses to domain entities using the adapter
 * 3. Handle errors and edge cases
 * 4. Provide a clean interface for the application layer
 */
export interface TwilioConversationRepository {
	/**
	 * Get a conversation from Twilio by its SID
	 */
	getConversationBySid: (
		twilioSid: string,
	) => Promise<Domain.Contexts.Conversation.Conversation.ConversationEntityReference | null>;

	/**
	 * List all conversations from Twilio
	 */
	listConversations: () => Promise<Domain.Contexts.Conversation.Conversation.ConversationEntityReference[]>;

	/**
	 * Send a message to a Twilio conversation
	 */
	sendMessage: (
		twilioConversationSid: string,
		body: string,
		author: string,
	) => Promise<Domain.Contexts.Conversation.Conversation.MessageEntityReference>;

	/**
	 * Delete a conversation from Twilio
	 */
	deleteConversation: (twilioSid: string) => Promise<void>;

	/**
	 * Create a new conversation in Twilio
	 */
	createConversation: (
		friendlyName?: string,
		uniqueName?: string,
	) => Promise<Domain.Contexts.Conversation.Conversation.ConversationEntityReference>;
}

export class TwilioConversationRepositoryImpl implements TwilioConversationRepository {
	private readonly twilioService: ServiceTwilio;
	private readonly passport: Domain.Passport;

	constructor(twilioService: ServiceTwilio, passport: Domain.Passport) {
		this.twilioService = twilioService;
		this.passport = passport;
	}

	/**
	 * Get a conversation from Twilio by its SID and convert to domain entity
	 * 
	 * This method:
	 * 1. Calls ServiceTwilio.getConversation() which routes to mock or real Twilio
	 * 2. Converts the Twilio API response to domain ConversationProps
	 * 3. Returns a Conversation domain entity
	 * 
	 * Note: Currently creates stub entities for sharer, reserver, and listing.
	 * In a real implementation, you would fetch these from the database or other sources.
	 */
	async getConversationBySid(
		twilioSid: string,
	): Promise<Domain.Contexts.Conversation.Conversation.ConversationEntityReference | null> {
		try {
			// Fetch from Twilio (mock or real, depending on TWILIO_USE_MOCK environment variable)
			const twilioConv = await this.twilioService.getConversation(twilioSid) as unknown as TwilioConversationResponse;

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
	 * List all conversations from Twilio
	 */
	async listConversations(): Promise<Domain.Contexts.Conversation.Conversation.ConversationEntityReference[]> {
		try {
			const conversations = await this.twilioService.listConversations();

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
					} as TwilioConversationResponse,
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
	 * Send a message to a Twilio conversation
	 * 
	 * This method:
	 * 1. Calls ServiceTwilio.sendMessage() which routes to mock or real Twilio
	 * 2. Converts the Twilio message response to a domain Message entity
	 * 3. Returns the Message entity
	 */
	async sendMessage(
		_twilioConversationSid: string,
		body: string,
		author: string,
	): Promise<Domain.Contexts.Conversation.Conversation.MessageEntityReference> {
		try {
			// Send message via Twilio (mock or real)
			const twilioMsg = await this.twilioService.sendMessage(
				_twilioConversationSid,
				body,
				author,
			) as unknown as TwilioMessageResponse;

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
	 * Delete a conversation from Twilio
	 */
	async deleteConversation(twilioSid: string): Promise<void> {
		try {
			await this.twilioService.deleteConversation(twilioSid);
		} catch (error) {
			console.error('Error deleting conversation from Twilio:', error);
			throw error;
		}
	}

	/**
	 * Create a new conversation in Twilio
	 */
	async createConversation(
		friendlyName?: string,
		uniqueName?: string,
	): Promise<Domain.Contexts.Conversation.Conversation.ConversationEntityReference> {
		try {
			const twilioConv = await this.twilioService.createConversation(friendlyName, uniqueName);

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
				} as TwilioConversationResponse,
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
			console.error('Error creating conversation in Twilio:', error);
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

export const getTwilioConversationRepository = (
	twilioService: ServiceTwilio,
	passport: Domain.Passport,
): TwilioConversationRepository => {
	return new TwilioConversationRepositoryImpl(twilioService, passport);
};
