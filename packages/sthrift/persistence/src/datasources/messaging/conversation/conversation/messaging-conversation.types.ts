/**
 * Messaging API Response Types
 * These types match the responses from messaging services like Twilio's Conversations API
 * (or our mock server that mimics Twilio's API)
 */

export interface MessagingConversationResponse {
	sid: string;
	account_sid: string;
	friendly_name?: string;
	unique_name?: string;
	date_created: string;
	date_updated: string;
	state: 'active' | 'inactive' | 'closed';
	timers?: Record<string, unknown>;
	messaging_service_sid?: string;
	url?: string;
	links?: Record<string, string>;
}

export interface MessagingMessageResponse {
	sid: string;
	account_sid: string;
	conversation_sid: string;
	body: string;
	author?: string;
	participant_sid?: string;
	date_created: string;
	date_updated?: string;
	index: number;
	delivery?: Record<string, unknown>;
	url?: string;
	links?: Record<string, string>;
}

export interface MessagingParticipantResponse {
	sid: string;
	account_sid: string;
	conversation_sid: string;
	identity?: string;
	messaging_binding?: {
		type: string;
		address: string;
		proxy_address?: string;
	};
	date_created: string;
	date_updated?: string;
	role_sid?: string;
	url?: string;
	links?: Record<string, string>;
}

export interface MessagingPaginatedResponse<_T> {
	meta: {
		page: number;
		page_size: number;
		first_page_url: string;
		previous_page_url?: string;
		next_page_url?: string;
		url: string;
		key?: string;
	};
}

export interface MessagingConversationsListResponse extends MessagingPaginatedResponse<MessagingConversationResponse> {
	conversations: MessagingConversationResponse[];
}

export interface MessagingMessagesListResponse extends MessagingPaginatedResponse<MessagingMessageResponse> {
	messages: MessagingMessageResponse[];
}

export interface MessagingParticipantsListResponse extends MessagingPaginatedResponse<MessagingParticipantResponse> {
	participants: MessagingParticipantResponse[];
}
