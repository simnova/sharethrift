import type { Domain } from '@sthrift/domain';
import type { ServiceTwilio } from '@sthrift/service-twilio';
import { getTwilioConversationRepository } from './twilio-conversation.repository.ts';
export type { TwilioConversationRepository } from './twilio-conversation.repository.ts';

export const TwilioConversationRepositoryImpl = (
	twilioService: ServiceTwilio,
	passport: Domain.Passport,
) => {
	return {
		TwilioConversationRepo: getTwilioConversationRepository(twilioService, passport),
	};
};
