import type { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';

export interface AdminUserQueryByEmailCommand {
	email: string;
	fields?: string[];
}

export const queryByEmail = (dataSources: DataSources) => {
	return async (
		command: AdminUserQueryByEmailCommand,
	): Promise<Domain.Contexts.User.AdminUser.AdminUserEntityReference | null> => {
		return await dataSources.readonlyDataSource.User.AdminUser.AdminUserReadRepo.getByEmail(
			command.email,
			{ fields: command.fields },
		);
	};
};
