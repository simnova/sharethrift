import type { Domain } from '@sthrift/api-domain';
import type { DataSources } from '@sthrift/api-persistence';
import { type ConversationCreateCommand, create } from './create.ts';
import { type ConversationQueryByIdCommand, queryById } from './query-by-id.ts';
import {
	type ConversationqueryBySharerCommand,
	queryBySharer,
} from './query-by-sharer.ts';

export interface ConversationApplicationService {
	create: (
		command: ConversationCreateCommand,
	) => Promise<Domain.Contexts.Conversation.Conversation.ConversationEntityReference>;
	queryById: (
		command: ConversationQueryByIdCommand,
	) => Promise<Domain.Contexts.Conversation.Conversation.ConversationEntityReference | null>;
	queryBySharer: (
		command: ConversationqueryBySharerCommand,
	) => Promise<
		Domain.Contexts.Conversation.Conversation.ConversationEntityReference[]
	>;
}

export const Conversation = (
	dataSources: DataSources,
): ConversationApplicationService => {
	return {
		create: create(dataSources),
		queryById: queryById(dataSources),
		queryBySharer: queryBySharer(dataSources),
	};
};
