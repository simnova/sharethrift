import type { MessagingService } from '@cellix/messaging-service';
import { MessagingConversationContext } from './conversation/index.ts';
import type * as Conversation from './conversation/conversation/index.ts';

export interface MessagingDataSource {
	Conversation: {
		Conversation: {
			MessagingConversationRepo: Conversation.MessagingConversationRepository;
		};
	};
}

export const MessagingDataSourceImplementation = (
	messagingService: MessagingService,
): MessagingDataSource => {
	return {
		Conversation: MessagingConversationContext(messagingService),
	};
};
