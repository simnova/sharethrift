import type { DataSources } from '@sthrift/persistence';
import type { Domain } from '@sthrift/domain';

export interface AdminUserUpdateCommand {
	id: string;
	isBlocked?: boolean;
	adminLevel?: Domain.Contexts.User.AdminUser.AdminLevel;
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
				const existingAdminUser = await repo.getById(command.id);
				if (!existingAdminUser) {
					throw new Error('admin user not found');
				}

				if (command.isBlocked !== undefined) {
					existingAdminUser.isBlocked = command.isBlocked;
				}

				if (command.adminLevel !== undefined) {
					existingAdminUser.adminLevel = command.adminLevel;
				}

				if (command.account) {
					existingAdminUser.account.accountType =
						command.account.accountType ??
						existingAdminUser.account.accountType;
					existingAdminUser.account.username =
						command.account.username ?? existingAdminUser.account.username;
					existingAdminUser.account.firstName =
						command.account.firstName ?? existingAdminUser.account.firstName;
					existingAdminUser.account.lastName =
						command.account.lastName ?? existingAdminUser.account.lastName;
				}

				adminUserToReturn = await repo.save(existingAdminUser);
			},
		);
		if (!adminUserToReturn) {
			throw new Error('admin user update failed');
		}
		return adminUserToReturn;
	};
};
