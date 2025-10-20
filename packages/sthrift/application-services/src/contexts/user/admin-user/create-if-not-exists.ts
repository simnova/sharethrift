import type { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';

export interface AdminUserCreateCommand {
	email: string;
	username: string;
	firstName: string;
	lastName: string;
	roleId: string;
}

export const createIfNotExists = (dataSources: DataSources) => {
	return async (
		command: AdminUserCreateCommand,
	): Promise<Domain.Contexts.User.AdminUser.AdminUserEntityReference> => {
		const existingAdminUser =
			await dataSources.readonlyDataSource.User.AdminUser.AdminUserReadRepo.getByEmail(
				command.email,
			);
		if (existingAdminUser) {
			return existingAdminUser;
		}
		
		let adminUserToReturn:
			| Domain.Contexts.User.AdminUser.AdminUserEntityReference
			| undefined;
		await dataSources.domainDataSource.User.AdminUser.AdminUserUnitOfWork.withScopedTransaction(
			async (repo) => {
				const newAdminUser = await repo.getNewInstance(
					command.email,
					command.username,
					command.firstName,
					command.lastName,
				);

				// Assign role by ID (will be validated on save)
				newAdminUser.props.role = { id: command.roleId } as Domain.Contexts.Role.AdminRole.AdminRoleEntityReference;

				adminUserToReturn = await repo.save(newAdminUser);
			},
		);
		if (!adminUserToReturn) {
			throw new Error('admin user not found');
		}
		return adminUserToReturn;
	};
};
