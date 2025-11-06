import type { Domain } from '@sthrift/domain';
import type { MessagingService } from '@cellix/messaging';
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
	passport: Domain.Passport,
): MessagingDataSource => {
	return {
		Conversation: MessagingConversationContext(messagingService, passport),
	};
};
