import type { Domain } from '@sthrift/domain';
import type { IMessagingService } from '@cellix/messaging';
export type { MessagingConversationRepository } from './conversation/index.ts';
import { MessagingConversationRepositoryImpl } from './conversation/index.ts';

export const MessagingConversationContext = (
	messagingService: IMessagingService,
	passport: Domain.Passport,
) => {
	return {
		Conversation: MessagingConversationRepositoryImpl(messagingService, passport),
	};
};
