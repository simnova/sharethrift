import type { Domain } from '@sthrift/domain';
import type { IMessagingService } from '@cellix/messaging';
import { getMessagingConversationRepository } from './messaging-conversation.repository.ts';
export type { MessagingConversationRepository } from './messaging-conversation.repository.ts';

export const MessagingConversationRepositoryImpl = (
	messagingService: IMessagingService,
	passport: Domain.Passport,
) => {
	return {
		MessagingConversationRepo: getMessagingConversationRepository(messagingService, passport),
	};
};
