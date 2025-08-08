import { DomainSeedwork } from '@cellix/domain-seedwork';
import type { TwilioConversationSid, TwilioMessageSid, MessageContent, UserId, ListingId } from './conversation.value-objects.js';

export interface ConversationProps extends DomainSeedwork.DomainEntityProps {
	twilioConversationSid: TwilioConversationSid;
	listingId: ListingId;
	participants: UserId[];
	createdAt: Date;
	updatedAt: Date;
}

export interface ConversationEntityReference extends Readonly<ConversationProps> {}

// Simple passport type for conversations (can be enhanced with permissions later)
export type ConversationPassport = Record<string, never>;

export class Conversation extends DomainSeedwork.AggregateRoot<ConversationProps, ConversationPassport> implements ConversationEntityReference {

	get twilioConversationSid() {
		return this.props.twilioConversationSid;
	}

	get listingId() {
		return this.props.listingId;
	}

	get participants() {
		return [...this.props.participants]; // Return copy to maintain immutability
	}

	get createdAt() {
		return this.props.createdAt;
	}

	get updatedAt() {
		return this.props.updatedAt;
	}

	// Factory method to create new conversation
	public static create(
		id: string,
		twilioConversationSid: TwilioConversationSid,
		listingId: ListingId,
		participants: UserId[],
		passport: ConversationPassport
	): Conversation {
		const now = new Date();
		return new Conversation({
			id,
			twilioConversationSid,
			listingId,
			participants,
			createdAt: now,
			updatedAt: now,
		}, passport);
	}

	// Add participant to conversation
	public addParticipant(userId: UserId): void {
		if (!this.props.participants.some((p: UserId) => p.valueOf() === userId.valueOf())) {
			this.props.participants.push(userId);
			this.props.updatedAt = new Date();
		}
	}

	// Check if user is participant
	public isParticipant(userId: UserId): boolean {
		return this.props.participants.some((p: UserId) => p.valueOf() === userId.valueOf());
	}

	// Update last activity timestamp
	public updateLastActivity(): void {
		this.props.updatedAt = new Date();
	}
}

export interface MessageProps extends DomainSeedwork.DomainEntityProps {
	twilioMessageSid: TwilioMessageSid;
	conversationId: string;
	authorId: UserId;
	content: MessageContent;
	createdAt: Date;
}

export interface MessageEntityReference extends Readonly<MessageProps> {}

// Simple passport type for messages (can be enhanced with permissions later)  
export type MessagePassport = Record<string, never>;

export class Message extends DomainSeedwork.AggregateRoot<MessageProps, MessagePassport> implements MessageEntityReference {

	get twilioMessageSid() {
		return this.props.twilioMessageSid;
	}

	get conversationId() {
		return this.props.conversationId;
	}

	get authorId() {
		return this.props.authorId;
	}

	get content() {
		return this.props.content;
	}

	get createdAt() {
		return this.props.createdAt;
	}

	// Factory method to create new message
	public static create(
		id: string,
		twilioMessageSid: TwilioMessageSid,
		conversationId: string,
		authorId: UserId,
		content: MessageContent,
		passport: MessagePassport
	): Message {
		return new Message({
			id,
			twilioMessageSid,
			conversationId,
			authorId,
			content,
			createdAt: new Date(),
		}, passport);
	}
}