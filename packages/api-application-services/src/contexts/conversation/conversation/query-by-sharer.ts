import type { Domain } from '@sthrift/api-domain';
import type { DataSources } from '@sthrift/api-persistence';

export interface ConversationqueryBySharerCommand {
	personalUser: string;
	fields?: string[];
}

export const queryBySharer = (dataSources: DataSources) => {
	return async (
		command: ConversationqueryBySharerCommand,
	): Promise<
		Domain.Contexts.Conversation.Conversation.ConversationEntityReference[]
	> => {
		return await dataSources.readonlyDataSource.Conversation.Conversation.ConversationReadRepo.getBySharer(
			command.personalUser,
		);
	};
};
