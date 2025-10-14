import type { DomainSeedwork } from '@cellix/domain-seedwork';
import type { Passport } from '../../passport.js';
import type { ConversationRepository } from './conversation.repository.js';
import type { Conversation } from './conversation.js';
import type { ConversationProps } from './conversation.entity.js';

export interface ConversationUnitOfWork
	extends DomainSeedwork.UnitOfWork<
			Passport,
			ConversationProps,
			Conversation<ConversationProps>,
			ConversationRepository<ConversationProps>
		>,
		DomainSeedwork.InitializedUnitOfWork<
			Passport,
			ConversationProps,
			Conversation<ConversationProps>,
			ConversationRepository<ConversationProps>
		> {}
