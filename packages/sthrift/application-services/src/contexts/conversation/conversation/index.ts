import type { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';
import { type ConversationCreateCommand, create } from './create.ts';
import { type ConversationQueryByIdCommand, queryById } from './query-by-id.ts';
import {
	type ConversationQueryByUserCommand,
	queryByUser,
} from './query-by-user.ts';
import {
	type ConversationDeleteByListingIdCommand,
	deleteByListingId,
} from './delete-by-listing-id.ts';

export interface ConversationApplicationService {
	create: (
		command: ConversationCreateCommand,
	) => Promise<Domain.Contexts.Conversation.Conversation.ConversationEntityReference>;
	queryById: (
		command: ConversationQueryByIdCommand,
	) => Promise<Domain.Contexts.Conversation.Conversation.ConversationEntityReference | null>;
	queryByUser: (
		command: ConversationQueryByUserCommand,
	) => Promise<
		Domain.Contexts.Conversation.Conversation.ConversationEntityReference[]
	>;
	deleteByListingId: (
		command: ConversationDeleteByListingIdCommand,
	) => Promise<number>;
}

export const Conversation = (
	dataSources: DataSources,
): ConversationApplicationService => {
	return {
		create: create(dataSources),
		queryById: queryById(dataSources),
		queryByUser: queryByUser(dataSources),
		deleteByListingId: deleteByListingId(dataSources),
	};
};
