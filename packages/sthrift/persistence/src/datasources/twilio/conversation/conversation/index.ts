import type { Domain } from '@sthrift/domain';
import type { IMessagingService } from '@cellix/messaging';
import { getTwilioConversationRepository } from './twilio-conversation.repository.ts';
export type { TwilioConversationRepository } from './twilio-conversation.repository.ts';

export interface ConversationConversationDataSource {
	conversation: ReturnType<typeof getTwilioConversationRepository>;
}

export const conversationConversationDataSource = (
	messagingService: IMessagingService,
	passport: Domain.Passport,
): ConversationConversationDataSource => {
	return {
		conversation: getTwilioConversationRepository(messagingService, passport),
	};
};
