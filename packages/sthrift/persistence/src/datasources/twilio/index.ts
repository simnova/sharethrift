import { Domain } from '@sthrift/domain';
import type { IMessagingService } from '@cellix/messaging';
import { TwilioConversationContext } from './conversation/index.ts';
import type { ConversationDataSource } from './conversation/index.ts';

/**
 * Twilio DataSource Interface
 * 
 * This datasource provides access to Twilio-backed resources.
 * It follows the same structure as domain and readonly datasources,
 * but specifically handles Twilio API interactions.
 * 
 * The Twilio service (ServiceTwilio) can be configured to use either:
 * - Mock Twilio server (for local development/testing)
 * - Real Twilio API (for production)
 * 
 * This is controlled via the TWILIO_USE_MOCK environment variable.
 */
export interface TwilioDataSource {
	Conversation: ConversationDataSource;
}

export const TwilioDataSourceImplementation = (
	messagingService: IMessagingService,
	passport: Domain.Passport,
): TwilioDataSource => {
	return {
		Conversation: TwilioConversationContext(messagingService, passport),
	};
};
