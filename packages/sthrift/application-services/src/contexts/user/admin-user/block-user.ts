import type { DataSources } from '@sthrift/persistence';
import type { Domain } from '@sthrift/domain';

export interface BlockAdminUserCommand {
	userId: string;
}

export const blockUser = (datasources: DataSources) => {
	return async (
		command: BlockAdminUserCommand,
	): Promise<Domain.Contexts.User.AdminUser.AdminUserEntityReference> => {
		let adminUserToReturn:
			| Domain.Contexts.User.AdminUser.AdminUserEntityReference
			| undefined;
		await datasources.domainDataSource.User.AdminUser.AdminUserUnitOfWork.withScopedTransaction(
			async (repo) => {
				const existingAdminUser = await repo.getById(command.userId);
				if (!existingAdminUser) {
					throw new Error('admin user not found');
				}

				existingAdminUser.isBlocked = true;

				adminUserToReturn = await repo.save(existingAdminUser);
			},
		);
		if (!adminUserToReturn) {
			throw new Error('admin user block failed');
		}
		return adminUserToReturn;
	};
};
