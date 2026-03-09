import type { Domain } from '@sthrift/domain';
import {
	createMockConversation,
	createMockMessage,
	getAllMockConversations,
} from '../test-data/conversation.test-data.js';

interface MockConversationContextApplicationService {
	Conversation: {
		create: () => Promise<Domain.Contexts.Conversation.Conversation.ConversationEntityReference>;
		queryById: () => Promise<null>;
		queryByUser: () => Promise<Domain.Contexts.Conversation.Conversation.ConversationEntityReference[]>;
		sendMessage: () => Promise<Domain.Contexts.Conversation.Conversation.MessageEntityReference>;
	};
}

export function createMockConversationService(): MockConversationContextApplicationService {
	return {
		Conversation: {
			create: () => Promise.resolve(createMockConversation()),
			queryById: () => Promise.resolve(null),
			queryByUser: () => Promise.resolve(getAllMockConversations()),
			sendMessage: () => Promise.resolve(createMockMessage()),
		},
	};
}
