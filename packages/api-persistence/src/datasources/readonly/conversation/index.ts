import type { Domain } from '@sthrift/api-domain';
import type { ModelsContext } from '../../../index.ts';
import { ConversationReadRepositoryImpl } from './conversation/index.ts';

export const ConversationContext = (
	models: ModelsContext,
	passport: Domain.Passport,
) => ({
	Conversation: ConversationReadRepositoryImpl(models, passport),
});
