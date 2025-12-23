import type { MessagingService } from '@cellix/messaging-service';
export type { MessagingConversationRepository } from './conversation/index.ts';
import { MessagingConversationRepositoryImpl } from './conversation/index.ts';

export const MessagingConversationContext = (
	messagingService: MessagingService,
) => {
	return {
		Conversation: MessagingConversationRepositoryImpl(messagingService),
	};
};
