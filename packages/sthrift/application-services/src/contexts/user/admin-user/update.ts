import type { DataSources } from '@sthrift/persistence';
import type { Domain } from '@sthrift/domain';

export interface AdminUserUpdateCommand {
	id: string;
	isBlocked?: boolean;
	roleId?: string;
	account?: {
		accountType?: string;
		username?: string;
		profile?: {
			firstName?: string;
			lastName?: string;
			aboutMe?: string;
			location?: {
				address1?: string;
				address2?: string;
				city?: string;
				state?: string;
				country?: string;
				zipCode?: string;
			};
		};
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
				const existingAdminUser =
					user as unknown as Domain.Contexts.User.AdminUser.AdminUser<Domain.Contexts.User.AdminUser.AdminUserProps>;

				// Update fields
				if (command.isBlocked !== undefined) {
					existingAdminUser.isBlocked = command.isBlocked;
				}

				// Update role if provided (will be validated on save)
				if (command.roleId) {
					existingAdminUser.props.role = {
						id: command.roleId,
					} as Domain.Contexts.Role.AdminRole.AdminRoleEntityReference;
				}

				if (command.account) {
					existingAdminUser.account.accountType =
						command.account.accountType ??
						existingAdminUser.account.accountType;
					existingAdminUser.account.username =
						command.account.username ?? existingAdminUser.account.username;

					if (command.account.profile) {
						if (command.account.profile.firstName !== undefined) {
							existingAdminUser.account.profile.firstName =
								command.account.profile.firstName;
						}
						if (command.account.profile.lastName !== undefined) {
							existingAdminUser.account.profile.lastName =
								command.account.profile.lastName;
						}
						if (command.account.profile.aboutMe !== undefined) {
							existingAdminUser.account.profile.aboutMe =
								command.account.profile.aboutMe;
						}
						if (command.account.profile.location) {
							if (command.account.profile.location.address1 !== undefined) {
								existingAdminUser.account.profile.location.address1 =
									command.account.profile.location.address1;
							}
							if (command.account.profile.location.address2 !== undefined) {
								existingAdminUser.account.profile.location.address2 =
									command.account.profile.location.address2;
							}
							if (command.account.profile.location.city !== undefined) {
								existingAdminUser.account.profile.location.city =
									command.account.profile.location.city;
							}
							if (command.account.profile.location.state !== undefined) {
								existingAdminUser.account.profile.location.state =
									command.account.profile.location.state;
							}
							if (command.account.profile.location.country !== undefined) {
								existingAdminUser.account.profile.location.country =
									command.account.profile.location.country;
							}
							if (command.account.profile.location.zipCode !== undefined) {
								existingAdminUser.account.profile.location.zipCode =
									command.account.profile.location.zipCode;
							}
						}
					}
				}
				const saved = await repo.save(user);
				adminUserToReturn =
					saved as unknown as Domain.Contexts.User.AdminUser.AdminUserEntityReference;
			},
		);
		if (!adminUserToReturn) {
			throw new Error('admin user update failed');
		}
		return adminUserToReturn;
	};
};
