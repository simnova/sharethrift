import type { DataSources } from '@sthrift/persistence';
import type { Domain } from '@sthrift/domain';

export interface PersonalUserQueryByEmailCommand {
	email: string;
}

export const queryByEmail = (dataSources: DataSources) => {
	return async (
		command: PersonalUserQueryByEmailCommand,
	): Promise<Domain.Contexts.User.PersonalUser.PersonalUserEntityReference | null> => {
		return await dataSources.readonlyDataSource.User.PersonalUser.PersonalUserReadRepo.getByEmail(
			command.email,
		);
	};
};
