import type { Domain } from '@sthrift/api-domain';
import type { ModelsContext } from '../../../../index.ts';
import { getConversationReadRepository } from './conversation.read-repository.ts';
export type { ConversationReadRepository } from './conversation.read-repository.ts';

export const ConversationReadRepositoryImpl = (
	models: ModelsContext,
	passport: Domain.Passport,
) => {
	return {
		ItemListingReadRepo: getConversationReadRepository(models, passport),
	};
};
