import { ObjectId } from 'mongodb';
import type {
	Conversation,
	Message,
	Participant,
} from './types.ts';

class MockMessagingStore {
	private readonly conversations: Map<string, Conversation> = new Map();
	private readonly messages: Map<string, Message[]> = new Map();
	private readonly participants: Map<string, Participant[]> = new Map();
	private messageCounter = 0;

	readonly ACCOUNT_ID = 'mock-account-00000000';

	generateId(): string {
		return new ObjectId().toHexString();
	}

	createConversation(
		displayName?: string,
		uniqueName?: string,
	): Conversation {
		const id = this.generateId();
		const now = new Date().toISOString();

		const conversation: Conversation = {
			id,
			account_id: this.ACCOUNT_ID,
			...(displayName !== undefined && { display_name: displayName }),
			...(uniqueName !== undefined && { unique_name: uniqueName }),
			created_at: now,
			updated_at: now,
			state: 'active',
			url: `/v1/Conversations/${id}`,
			links: {
				participants: `/v1/Conversations/${id}/Participants`,
				messages: `/v1/Conversations/${id}/Messages`,
			},
		};

		this.conversations.set(id, conversation);
		this.messages.set(id, []);
		this.participants.set(id, []);

		return conversation;
	}

	createConversationWithId(
		id: string,
		displayName?: string,
		uniqueName?: string,
	): Conversation {
		const existing = this.conversations.get(id);
		if (existing) return existing;

		const now = new Date().toISOString();

		const conversation: Conversation = {
			id,
			account_id: this.ACCOUNT_ID,
			...(displayName !== undefined && { display_name: displayName }),
			...(uniqueName !== undefined && { unique_name: uniqueName }),
			created_at: now,
			updated_at: now,
			state: 'active',
			url: `/v1/Conversations/${id}`,
			links: {
				participants: `/v1/Conversations/${id}/Participants`,
				messages: `/v1/Conversations/${id}/Messages`,
			},
		};

		this.conversations.set(id, conversation);
		this.messages.set(id, []);
		this.participants.set(id, []);

		return conversation;
	}

	getConversation(id: string): Conversation | undefined {
		return this.conversations.get(id);
	}

	getConversationByUniqueName(uniqueName: string): Conversation | undefined {
		for (const conversation of this.conversations.values()) {
			if (conversation.unique_name === uniqueName) {
				return conversation;
			}
		}
		return undefined;
	}

	listConversations(page = 0, pageSize = 50): Conversation[] {
		const allConversations = Array.from(this.conversations.values());
		const start = page * pageSize;
		const end = start + pageSize;
		return allConversations.slice(start, end);
	}

	getConversationCount(): number {
		return this.conversations.size;
	}

	updateConversation(
		id: string,
		updates: Partial<Conversation>,
	): Conversation | undefined {
		const conversation = this.conversations.get(id);
		if (!conversation) {
			return undefined;
		}

		const updated = {
			...conversation,
			...updates,
			id: conversation.id,
			account_id: conversation.account_id,
			updated_at: new Date().toISOString(),
		};

		this.conversations.set(id, updated);
		return updated;
	}

	deleteConversation(id: string): boolean {
		const deleted = this.conversations.delete(id);
		if (deleted) {
			this.messages.delete(id);
			this.participants.delete(id);
		}
		return deleted;
	}

	createMessage(
		conversationId: string,
		body: string,
		author?: string,
		participantId?: string,
	): Message | undefined {
		const conversation = this.conversations.get(conversationId);
		if (!conversation) {
			return undefined;
		}

		const messages = this.messages.get(conversationId) || [];
		const id = this.generateId();
		const now = new Date().toISOString();

		const message: Message = {
			id,
			account_id: this.ACCOUNT_ID,
			conversation_id: conversationId,
			body,
			...(author !== undefined && { author }),
			...(participantId !== undefined && { participant_id: participantId }),
			created_at: now,
			index: this.messageCounter++,
			url: `/v1/Conversations/${conversationId}/Messages/${id}`,
		};

		messages.push(message);
		this.messages.set(conversationId, messages);

		return message;
	}

	getMessages(conversationId: string, page = 0, pageSize = 50): Message[] {
		const messages = this.messages.get(conversationId) || [];
		const start = page * pageSize;
		const end = start + pageSize;
		return messages.slice(start, end);
	}

	getMessageCount(conversationId: string): number {
		return (this.messages.get(conversationId) || []).length;
	}

	getMessage(conversationId: string, messageId: string): Message | undefined {
		const messages = this.messages.get(conversationId) || [];
		return messages.find((m) => m.id === messageId);
	}

	addParticipant(
		conversationId: string,
		identity?: string,
		messagingBinding?: Participant['messaging_binding'],
	): Participant | undefined {
		const conversation = this.conversations.get(conversationId);
		if (!conversation) {
			return undefined;
		}

		const participants = this.participants.get(conversationId) || [];
		const id = this.generateId();
		const now = new Date().toISOString();

		const participant: Participant = {
			id,
			account_id: this.ACCOUNT_ID,
			conversation_id: conversationId,
			...(identity !== undefined && { identity }),
			...(messagingBinding !== undefined && { messaging_binding: messagingBinding }),
			created_at: now,
			url: `/v1/Conversations/${conversationId}/Participants/${id}`,
		};

		participants.push(participant);
		this.participants.set(conversationId, participants);

		return participant;
	}

	getParticipants(conversationId: string, page = 0, pageSize = 50): Participant[] {
		const participants = this.participants.get(conversationId) || [];
		const start = page * pageSize;
		const end = start + pageSize;
		return participants.slice(start, end);
	}

	getParticipantCount(conversationId: string): number {
		return (this.participants.get(conversationId) || []).length;
	}

	getParticipant(conversationId: string, participantId: string): Participant | undefined {
		const participants = this.participants.get(conversationId) || [];
		return participants.find((p) => p.id === participantId);
	}

	removeParticipant(conversationId: string, participantId: string): boolean {
		const participants = this.participants.get(conversationId) || [];
		const index = participants.findIndex((p) => p.id === participantId);
		
		if (index === -1) {
			return false;
		}

		participants.splice(index, 1);
		this.participants.set(conversationId, participants);
		return true;
	}

	reset(): void {
		this.conversations.clear();
		this.messages.clear();
		this.participants.clear();
		this.messageCounter = 0;
	}

	getStats() {
		return {
			conversations: this.conversations.size,
			messages: Array.from(this.messages.values()).reduce(
				(sum, msgs) => sum + msgs.length,
				0,
			),
			participants: Array.from(this.participants.values()).reduce(
				(sum, parts) => sum + parts.length,
				0,
			),
		};
	}
}

export const store = new MockMessagingStore();
