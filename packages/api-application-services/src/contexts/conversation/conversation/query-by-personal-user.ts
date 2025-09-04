import type { Domain } from '@sthrift/api-domain';
import type { DataSources } from '@sthrift/api-persistence';

export interface ConversationQueryByPersonalUserCommand {
	personalUser: string;
	fields?: string[];
}

export const queryByPersonalUser = (dataSources: DataSources) => {
	return async (
		command: ConversationQueryByPersonalUserCommand,
	): Promise<
		Domain.Contexts.Conversation.Conversation.ConversationEntityReference[]
	> => {
		return await dataSources.readonlyDataSource.Conversation.Conversation.ConversationReadRepo.getByPersonalUserExternalId(
			command.personalUser,
		);
	};
};
