import type { Domain } from '@sthrift/domain';
import type { MessagingService } from '@cellix/messaging-service';
export type { MessagingConversationRepository } from './conversation/index.ts';
import { MessagingConversationRepositoryImpl } from './conversation/index.ts';

export const MessagingConversationContext = (
	messagingService: MessagingService,
	passport: Domain.Passport,
) => {
	return {
		Conversation: MessagingConversationRepositoryImpl(messagingService, passport),
	};
};
