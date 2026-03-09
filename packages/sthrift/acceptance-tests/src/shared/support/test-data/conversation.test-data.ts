import type { Domain } from '@sthrift/domain';

const conversations = new Map<string, Domain.Contexts.Conversation.Conversation.ConversationEntityReference>();
const messages = new Map<string, Domain.Contexts.Conversation.Conversation.MessageEntityReference>();

let conversationCounter = 1;
let messageCounter = 1;

export function createMockConversation(): Domain.Contexts.Conversation.Conversation.ConversationEntityReference {
	const conversation = {
		id: `conversation-${conversationCounter}`,
		createdAt: new Date(),
		updatedAt: new Date(),
	} as Domain.Contexts.Conversation.Conversation.ConversationEntityReference;
	conversations.set(conversation.id, conversation);
	conversationCounter++;
	return conversation;
}

export function createMockMessage(): Domain.Contexts.Conversation.Conversation.MessageEntityReference {
	const message = {
		id: `message-${messageCounter}`,
		createdAt: new Date(),
	} as Domain.Contexts.Conversation.Conversation.MessageEntityReference;
	messages.set(message.id, message);
	messageCounter++;
	return message;
}

export function getMockConversationById(id: string): Domain.Contexts.Conversation.Conversation.ConversationEntityReference | null {
	return conversations.get(id) ?? null;
}

export function getMockMessageById(id: string): Domain.Contexts.Conversation.Conversation.MessageEntityReference | null {
	return messages.get(id) ?? null;
}

export function getAllMockConversations(): Domain.Contexts.Conversation.Conversation.ConversationEntityReference[] {
	return Array.from(conversations.values());
}

export function getAllMockMessages(): Domain.Contexts.Conversation.Conversation.MessageEntityReference[] {
	return Array.from(messages.values());
}

export function clearMockConversations(): void {
	conversations.clear();
	messages.clear();
	conversationCounter = 1;
	messageCounter = 1;
}
