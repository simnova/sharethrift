import type { ServiceBase } from '@cellix/api-services-spec';

/**
 * Generic conversation instance representation
 * Provider-agnostic conversation data structure
 */
export interface ConversationInstance {
	sid: string;
	friendlyName?: string;
	dateCreated?: Date;
	dateUpdated?: Date;
}

/**
 * Generic message instance representation
 * Provider-agnostic message data structure
 */
export interface MessageInstance {
	sid: string;
	body: string;
	author?: string;
	dateCreated?: Date;
}

/**
 * Generic messaging service interface
 * This interface defines the contract for any messaging service implementation
 * (Twilio, SendGrid, custom implementations, etc.)
 * 
 * All messaging service implementations must implement this interface to ensure
 * consistency and interoperability across different messaging providers.
 */
export interface IMessagingService extends ServiceBase<IMessagingService> {
	/**
	 * Get a specific conversation by ID
	 */
	getConversation(conversationId: string): Promise<ConversationInstance>;

	/**
	 * Send a message to a conversation
	 */
	sendMessage(
		conversationId: string,
		body: string,
		author?: string,
	): Promise<MessageInstance>;
	
	/**
	 * Get messages from a conversation
	 */
	getMessages(conversationId: string): Promise<MessageInstance[]>;

	/**
	 * Delete a conversation
	 */
	deleteConversation(conversationId: string): Promise<void>;

	/**
	 * List all conversations
	 */
	listConversations(): Promise<ConversationInstance[]>;

	/**
	 * Create a new conversation
	 */
	createConversation(
		friendlyName?: string,
		uniqueName?: string,
	): Promise<ConversationInstance>;
}
