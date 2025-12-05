import type { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';

export interface UserQueryByIdCommand {
	id: string;
	fields?: string[];
}

export const queryById = (dataSources: DataSources) => {
	return async (
		command: UserQueryByIdCommand,
	): Promise<Domain.Contexts.User.UserEntityReference | null> => {
		return await dataSources.readonlyDataSource.User.User.UserReadRepo.getById(command.id);
	};
};
