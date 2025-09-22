import type { Domain } from '@sthrift/api-domain';
import type { ModelsContext } from '../../../models-context.ts';
import { ConversationPersistence } from './conversation/index.ts';

export const ConversationContextPersistence = (
	models: ModelsContext,
	passport: Domain.Passport,
) => ({
	Conversation: ConversationPersistence(models, passport),
});
