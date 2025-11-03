/**
 * Messaging API Response Types
 * 
 * These types define what the persistence layer expects from messaging services
 * for domain entity mapping. They align with the facade ConversationInstance/MessageInstance
 * but include additional fields needed for domain construction.
 * 
 * The repository layer receives facade types from services and casts them to these
 * types to access metadata and additional fields preserved by the providers.
 */

export interface MessagingConversationResponse {
	id: string;
	displayName?: string;
	createdAt: string;
	updatedAt: string;
	state?: 'active' | 'inactive' | 'closed';
	metadata?: {
		originalSid?: string;
		accountSid?: string;
		uniqueName?: string;
		[key: string]: unknown;
	};
}

export interface MessagingMessageResponse {
	id: string;
	body: string;
	author?: string;
	createdAt: string;
	metadata?: {
		originalSid?: string;
		conversationId?: string;
		participantSid?: string;
		index?: number;
		[key: string]: unknown;
	};
}

export interface MessagingParticipantResponse {
	id: string;
	identity?: string;
	createdAt: string;
	metadata?: {
		originalSid?: string;
		conversationId?: string;
		messagingBinding?: {
			type: string;
			address: string;
			[key: string]: unknown;
		};
		[key: string]: unknown;
	};
}
