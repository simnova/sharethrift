import { randomBytes } from 'node:crypto';
import type {
	Conversation,
	Message,
	Participant,
} from './types.ts';

/**
 * In-memory data store for mock Twilio server
 */
class MockTwilioStore {
	private readonly conversations: Map<string, Conversation> = new Map();
	private readonly messages: Map<string, Message[]> = new Map();
	private readonly participants: Map<string, Participant[]> = new Map();
	private messageCounter = 0;

	// Account SID used for all mock resources
	readonly ACCOUNT_SID = `AC${'0'.repeat(32)}`;

	/**
	 * Generate a Twilio-like SID using cryptographically secure random bytes
	 */
	generateSid(prefix: 'CH' | 'IM' | 'MB'): string {
		// Use crypto.randomBytes for secure random generation (16 bytes = 32 hex chars)
		const randomHex = randomBytes(16).toString('hex');
		return `${prefix}${randomHex}`;
	}

	/**
	 * Create a new conversation
	 */
	createConversation(
		friendlyName?: string,
		uniqueName?: string,
	): Conversation {
		const sid = this.generateSid('CH');
		const now = new Date().toISOString();

		const conversation: Conversation = {
			sid,
			account_sid: this.ACCOUNT_SID,
			...(friendlyName !== undefined && { friendly_name: friendlyName }),
			...(uniqueName !== undefined && { unique_name: uniqueName }),
			date_created: now,
			date_updated: now,
			state: 'active',
			url: `/v1/Conversations/${sid}`,
			links: {
				participants: `/v1/Conversations/${sid}/Participants`,
				messages: `/v1/Conversations/${sid}/Messages`,
			},
		};

		this.conversations.set(sid, conversation);
		this.messages.set(sid, []);
		this.participants.set(sid, []);

		return conversation;
	}

	/**
	 * Get a conversation by SID
	 */
	getConversation(sid: string): Conversation | undefined {
		return this.conversations.get(sid);
	}

	/**
	 * Get conversation by unique name
	 */
	getConversationByUniqueName(uniqueName: string): Conversation | undefined {
		for (const conversation of this.conversations.values()) {
			if (conversation.unique_name === uniqueName) {
				return conversation;
			}
		}
		return undefined;
	}

	/**
	 * List all conversations with pagination
	 */
	listConversations(page = 0, pageSize = 50): Conversation[] {
		const allConversations = Array.from(this.conversations.values());
		const start = page * pageSize;
		const end = start + pageSize;
		return allConversations.slice(start, end);
	}

	/**
	 * Get total conversation count
	 */
	getConversationCount(): number {
		return this.conversations.size;
	}

	/**
	 * Update a conversation
	 */
	updateConversation(
		sid: string,
		updates: Partial<Conversation>,
	): Conversation | undefined {
		const conversation = this.conversations.get(sid);
		if (!conversation) {
			return undefined;
		}

		const updated = {
			...conversation,
			...updates,
			sid: conversation.sid, // Never change SID
			account_sid: conversation.account_sid, // Never change account SID
			date_updated: new Date().toISOString(),
		};

		this.conversations.set(sid, updated);
		return updated;
	}

	/**
	 * Delete a conversation
	 */
	deleteConversation(sid: string): boolean {
		const deleted = this.conversations.delete(sid);
		if (deleted) {
			this.messages.delete(sid);
			this.participants.delete(sid);
		}
		return deleted;
	}

	/**
	 * Create a new message in a conversation
	 */
	createMessage(
		conversationSid: string,
		body: string,
		author?: string,
		participantSid?: string,
	): Message | undefined {
		const conversation = this.conversations.get(conversationSid);
		if (!conversation) {
			return undefined;
		}

		const messages = this.messages.get(conversationSid) || [];
		const sid = this.generateSid('IM');
		const now = new Date().toISOString();

		const message: Message = {
			sid,
			account_sid: this.ACCOUNT_SID,
			conversation_sid: conversationSid,
			body,
			...(author !== undefined && { author }),
			...(participantSid !== undefined && { participant_sid: participantSid }),
			date_created: now,
			index: this.messageCounter++,
			url: `/v1/Conversations/${conversationSid}/Messages/${sid}`,
		};

		messages.push(message);
		this.messages.set(conversationSid, messages);

		return message;
	}

	/**
	 * Get messages for a conversation
	 */
	getMessages(conversationSid: string, page = 0, pageSize = 50): Message[] {
		const messages = this.messages.get(conversationSid) || [];
		const start = page * pageSize;
		const end = start + pageSize;
		return messages.slice(start, end);
	}

	/**
	 * Get total message count for a conversation
	 */
	getMessageCount(conversationSid: string): number {
		return (this.messages.get(conversationSid) || []).length;
	}

	/**
	 * Get a specific message
	 */
	getMessage(conversationSid: string, messageSid: string): Message | undefined {
		const messages = this.messages.get(conversationSid) || [];
		return messages.find((m) => m.sid === messageSid);
	}

	/**
	 * Add a participant to a conversation
	 */
	addParticipant(
		conversationSid: string,
		identity?: string,
		messagingBinding?: Participant['messaging_binding'],
	): Participant | undefined {
		const conversation = this.conversations.get(conversationSid);
		if (!conversation) {
			return undefined;
		}

		const participants = this.participants.get(conversationSid) || [];
		const sid = this.generateSid('MB');
		const now = new Date().toISOString();

		const participant: Participant = {
			sid,
			account_sid: this.ACCOUNT_SID,
			conversation_sid: conversationSid,
			...(identity !== undefined && { identity }),
			...(messagingBinding !== undefined && { messaging_binding: messagingBinding }),
			date_created: now,
			url: `/v1/Conversations/${conversationSid}/Participants/${sid}`,
		};

		participants.push(participant);
		this.participants.set(conversationSid, participants);

		return participant;
	}

	/**
	 * Get participants for a conversation
	 */
	getParticipants(conversationSid: string, page = 0, pageSize = 50): Participant[] {
		const participants = this.participants.get(conversationSid) || [];
		const start = page * pageSize;
		const end = start + pageSize;
		return participants.slice(start, end);
	}

	/**
	 * Get total participant count for a conversation
	 */
	getParticipantCount(conversationSid: string): number {
		return (this.participants.get(conversationSid) || []).length;
	}

	/**
	 * Get a specific participant
	 */
	getParticipant(conversationSid: string, participantSid: string): Participant | undefined {
		const participants = this.participants.get(conversationSid) || [];
		return participants.find((p) => p.sid === participantSid);
	}

	/**
	 * Remove a participant from a conversation
	 */
	removeParticipant(conversationSid: string, participantSid: string): boolean {
		const participants = this.participants.get(conversationSid) || [];
		const index = participants.findIndex((p) => p.sid === participantSid);
		
		if (index === -1) {
			return false;
		}

		participants.splice(index, 1);
		this.participants.set(conversationSid, participants);
		return true;
	}

	/**
	 * Reset all data
	 */
	reset(): void {
		this.conversations.clear();
		this.messages.clear();
		this.participants.clear();
		this.messageCounter = 0;
	}

	/**
	 * Get statistics
	 */
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

// Singleton instance
export const store = new MockTwilioStore();
