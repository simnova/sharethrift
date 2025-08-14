import type { DomainSeedwork } from '@cellix/domain-seedwork';
import type { Conversation, ConversationPassport, ConversationProps } from './conversation.aggregate.ts';
import type { Message } from './message.entity.ts';
//import type { TwilioConversationSid, UserId, ListingId } from './conversation.value-objects.js';
import type { ConversationRepository } from './conversation.repository.ts';
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