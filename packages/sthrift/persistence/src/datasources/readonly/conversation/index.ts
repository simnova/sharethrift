import type { Domain } from '@sthrift/domain';
import type { ModelsContext } from '../../../models-context.ts';
import { ConversationReadRepositoryImpl } from './conversation/index.ts';

export const ConversationContext = (
	models: ModelsContext,
	passport: Domain.Passport,
) => ({
	Conversation: ConversationReadRepositoryImpl(models, passport),
});
