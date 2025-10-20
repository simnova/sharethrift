import type { DataSources } from '@sthrift/persistence';
import type { Domain } from '@sthrift/domain';

export interface AdminUserUpdateCommand {
	id: string;
	isBlocked?: boolean;
	roleId?: string;
	account?: {
		accountType?: string;
		username?: string;
		firstName?: string;
		lastName?: string;
	};
}

export const update = (datasources: DataSources) => {
	return async (
		command: AdminUserUpdateCommand,
	): Promise<Domain.Contexts.User.AdminUser.AdminUserEntityReference> => {
		let adminUserToReturn:
			| Domain.Contexts.User.AdminUser.AdminUserEntityReference
			| undefined;
		await datasources.domainDataSource.User.AdminUser.AdminUserUnitOfWork.withScopedTransaction(
			async (repo) => {
				if (!command.id) {
					throw new Error('admin user id is required');
				}
				const user = await repo.getById(command.id);
				if (!user) {
					throw new Error('admin user not found');
				}

				// Cast to correct type (TypeScript incorrectly infers union type from UnitOfWork)
				const existingAdminUser = user as unknown as Domain.Contexts.User.AdminUser.AdminUser<Domain.Contexts.User.AdminUser.AdminUserProps>;

				// Update fields
				if (command.isBlocked !== undefined) {
					existingAdminUser.isBlocked = command.isBlocked;
				}
				
			// Update role if provided (will be validated on save)
			if (command.roleId) {
				existingAdminUser.props.role = { id: command.roleId } as Domain.Contexts.Role.AdminRole.AdminRoleEntityReference;
			}

			if (command.account) {
					existingAdminUser.account.accountType =
						command.account.accountType ?? existingAdminUser.account.accountType;
					existingAdminUser.account.username =
						command.account.username ?? existingAdminUser.account.username;
					existingAdminUser.account.firstName =
						command.account.firstName ?? existingAdminUser.account.firstName;
					existingAdminUser.account.lastName =
						command.account.lastName ?? existingAdminUser.account.lastName;
				}

				const saved = await repo.save(user);
				adminUserToReturn = saved as unknown as Domain.Contexts.User.AdminUser.AdminUserEntityReference;
			},
		);
		if (!adminUserToReturn) {
			throw new Error('admin user update failed');
		}
		return adminUserToReturn;
	};
};
