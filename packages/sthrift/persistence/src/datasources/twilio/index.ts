import type { Domain } from '@sthrift/domain';
import type { ServiceTwilio } from '@sthrift/service-twilio';
import { TwilioConversationContext } from './conversation/index.ts';
import type * as TwilioConversation from './conversation/conversation/index.ts';

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
	Conversation: {
		Conversation: {
			TwilioConversationRepo: TwilioConversation.TwilioConversationRepository;
		};
	};
}

/**
 * Create Twilio DataSource Implementation
 * 
 * @param twilioService - The Twilio service instance (handles mock/real switching)
 * @param passport - Domain passport for authorization
 * @returns TwilioDataSource with all Twilio-backed repositories
 */
export const TwilioDataSourceImplementation = (
	twilioService: ServiceTwilio,
	passport: Domain.Passport,
): TwilioDataSource => ({
	Conversation: TwilioConversationContext(twilioService, passport),
});
