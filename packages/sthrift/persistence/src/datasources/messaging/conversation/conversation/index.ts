import type { Domain } from '@sthrift/domain';
import type { MessagingService } from '@cellix/messaging-service';
import { getMessagingConversationRepository } from './messaging-conversation.repository.ts';
export type { MessagingConversationRepository } from './messaging-conversation.repository.ts';

export const MessagingConversationRepositoryImpl = (
	messagingService: MessagingService,
	passport: Domain.Passport,
) => {
	return {
		MessagingConversationRepo: getMessagingConversationRepository(messagingService, passport),
	};
};
