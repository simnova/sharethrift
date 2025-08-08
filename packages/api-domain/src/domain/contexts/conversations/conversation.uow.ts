import type { DomainSeedwork } from '@cellix/domain-seedwork';
import type { Conversation, Message, ConversationPassport, ConversationProps } from './conversation.js';
import type { TwilioConversationSid, UserId, ListingId } from './conversation.value-objects.js';

export interface ConversationRepository extends DomainSeedwork.Repository<Conversation> {
	getNewId(): Promise<string>;
	getByTwilioSid(twilioSid: TwilioConversationSid): Promise<Conversation | null>;
	getByListingAndParticipants(listingId: ListingId, participants: UserId[]): Promise<Conversation | null>;
	getUserConversations(userId: UserId): Promise<Conversation[]>;
}

export interface MessageRepository extends DomainSeedwork.Repository<Message> {
	getNewId(): Promise<string>;
	getConversationMessages(conversationId: string, limit?: number, offset?: number): Promise<Message[]>;
}

export interface ConversationUnitOfWork extends DomainSeedwork.UnitOfWork<ConversationPassport, ConversationProps, Conversation, ConversationRepository> {
	conversationRepository: ConversationRepository;
	messageRepository: MessageRepository;
}

export interface ConversationDomainAdapter {
	conversationUnitOfWork: ConversationUnitOfWork;
}