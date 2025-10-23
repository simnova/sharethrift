import type { Domain } from '@sthrift/domain';
import type { ServiceTwilio } from '@sthrift/service-twilio';
import { TwilioConversationRepositoryImpl } from './conversation/index.ts';
export type { TwilioConversationRepository } from './conversation/index.ts';

export const TwilioConversationContext = (
	twilioService: ServiceTwilio,
	passport: Domain.Passport,
) => ({
	Conversation: TwilioConversationRepositoryImpl(twilioService, passport),
});
