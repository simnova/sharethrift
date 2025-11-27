import type { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';

export interface AdminUserQueryByIdCommand {
	id: string;
	fields?: string[];
}

export const queryById = (dataSources: DataSources) => {
	return async (
		command: AdminUserQueryByIdCommand,
	): Promise<Domain.Contexts.User.AdminUser.AdminUserEntityReference | null> => {
		return await dataSources.readonlyDataSource.User.AdminUser.AdminUserReadRepo.getById(
			command.id,
			{ fields: command.fields },
		);
	};
};
