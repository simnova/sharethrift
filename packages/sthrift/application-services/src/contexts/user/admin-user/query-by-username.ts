import type { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';

export interface AdminUserQueryByUsernameCommand {
	username: string;
	fields?: string[];
}

export const queryByUsername = (dataSources: DataSources) => {
	return async (
		command: AdminUserQueryByUsernameCommand,
	): Promise<Domain.Contexts.User.AdminUser.AdminUserEntityReference | null> => {
		return await dataSources.readonlyDataSource.User.AdminUser.AdminUserReadRepo.getByUsername(
			command.username,
			{ fields: command.fields },
		);
	};
};
