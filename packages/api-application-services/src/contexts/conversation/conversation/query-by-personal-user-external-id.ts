import type { Domain } from '@sthrift/api-domain';
import type { DataSources } from '@sthrift/api-persistence';

export interface ConversationQueryByPersonalUserExternalIdCommand {
	externalId: string;
	fields?: string[];
}

export const queryByPersonalUserExternalId = (dataSources: DataSources) => {
	return async (
		command: ConversationQueryByPersonalUserExternalIdCommand,
	): Promise<
		Domain.Contexts.Conversation.Conversation.ConversationEntityReference[]
	> => {
		return await dataSources.readonlyDataSource.Conversation.Conversation.ConversationReadRepo.getByPersonalUserExternalId(
			command.externalId,
		);
	};
};
