import type { MessagingService } from '@cellix/service-messaging-base';
import { getMessagingConversationRepository } from './messaging-conversation.repository.ts';

export type { MessagingConversationRepository } from './messaging-conversation.repository.ts';

export const MessagingConversationRepositoryImpl = (
	messagingService: MessagingService,
) => {
	return {
		MessagingConversationRepo:
			getMessagingConversationRepository(messagingService),
	};
};
