import type { Domain } from '@sthrift/api-domain';
import type { DataSources } from '@sthrift/api-persistence';

export interface PersonalUserQueryByIdCommand {
	id: string;
	fields?: string[];
}

export const queryById = (dataSources: DataSources) => {
	return async (
		command: PersonalUserQueryByIdCommand,
	): Promise<Domain.Contexts.User.PersonalUser.PersonalUserEntityReference | null> => {
		return await dataSources.readonlyDataSource.User.PersonalUser.PersonalUserReadRepo.getById(
			command.id,
			{ fields: command.fields },
		);
	};
};
