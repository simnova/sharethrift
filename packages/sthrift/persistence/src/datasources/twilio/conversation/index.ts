import { Domain } from '@sthrift/domain';
import type { IMessagingService } from '@cellix/messaging';
import { conversationConversationDataSource, type ConversationConversationDataSource } from './conversation/index.ts';
export type { TwilioConversationRepository } from './conversation/index.ts';

export interface ConversationDataSource {
	conversation: ConversationConversationDataSource;
}

export const TwilioConversationContext = (
	messagingService: IMessagingService,
	passport: Domain.Passport,
): ConversationDataSource => {
	return {
		conversation: conversationConversationDataSource(messagingService, passport),
	};
};
