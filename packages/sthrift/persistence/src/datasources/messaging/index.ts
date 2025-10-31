import type { Domain } from '@sthrift/domain';
import type { IMessagingService } from '@cellix/messaging';
import { MessagingConversationContext } from './conversation/index.ts';
import type * as Conversation from './conversation/conversation/index.ts';

/**
 * Messaging DataSource Interface
 * 
 * This datasource provides access to messaging service resources (e.g., Twilio).
 * It follows the same structure as domain and readonly datasources,
 * but specifically handles messaging API interactions.
 * 
 * The messaging service can be configured to use either:
 * - Mock Twilio server (for local development/testing)
 * - Real Twilio API (for production)
 * 
 * This is controlled via the TWILIO_USE_MOCK environment variable.
 */
export interface MessagingDataSource {
	Conversation: {
		Conversation: {
			MessagingConversationRepo: Conversation.MessagingConversationRepository;
		};
	};
}

export const MessagingDataSourceImplementation = (
	messagingService: IMessagingService,
	passport: Domain.Passport,
): MessagingDataSource => {
	return {
		Conversation: MessagingConversationContext(messagingService, passport),
	};
};
