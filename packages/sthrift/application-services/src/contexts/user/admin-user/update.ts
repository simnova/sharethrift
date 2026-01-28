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

const updateBasicFields = (
	user: Domain.Contexts.User.AdminUser.AdminUser<Domain.Contexts.User.AdminUser.AdminUserProps>,
	command: AdminUserUpdateCommand,
) => {
	if (command.isBlocked !== undefined) {
		user.isBlocked = command.isBlocked;
	}

	if (command.roleId) {
		user.props.role = {
			id: command.roleId,
		} as Domain.Contexts.Role.AdminRole.AdminRoleEntityReference;
	}
};

const updateAccountFields = (
	user: Domain.Contexts.User.AdminUser.AdminUser<Domain.Contexts.User.AdminUser.AdminUserProps>,
	account: NonNullable<AdminUserUpdateCommand['account']>,
) => {
	user.account.accountType = account.accountType ?? user.account.accountType;
	user.account.username = account.username ?? user.account.username;
};

const updateProfileFields = (
	profile: Domain.Contexts.User.AdminUser.AdminUserProfile,
	commandProfile: NonNullable<
		NonNullable<AdminUserUpdateCommand['account']>['profile']
	>,
) => {
	if (commandProfile.firstName !== undefined) {
		profile.firstName = commandProfile.firstName;
	}
	if (commandProfile.lastName !== undefined) {
		profile.lastName = commandProfile.lastName;
	}
	if (commandProfile.aboutMe !== undefined) {
		profile.aboutMe = commandProfile.aboutMe;
	}
};

const updateLocationFields = (
	location: Domain.Contexts.User.AdminUser.AdminUserAccountProfileLocation,
	commandLocation: NonNullable<
		NonNullable<
			NonNullable<AdminUserUpdateCommand['account']>['profile']
		>['location']
	>,
) => {
	if (commandLocation.address1 !== undefined) {
		location.address1 = commandLocation.address1;
	}
	if (commandLocation.address2 !== undefined) {
		location.address2 = commandLocation.address2;
	}
	if (commandLocation.city !== undefined) {
		location.city = commandLocation.city;
	}
	if (commandLocation.state !== undefined) {
		location.state = commandLocation.state;
	}
	if (commandLocation.country !== undefined) {
		location.country = commandLocation.country;
	}
	if (commandLocation.zipCode !== undefined) {
		location.zipCode = commandLocation.zipCode;
	}
};

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

				const existingAdminUser =
					user as unknown as Domain.Contexts.User.AdminUser.AdminUser<Domain.Contexts.User.AdminUser.AdminUserProps>;

				updateBasicFields(existingAdminUser, command);

				if (command.account) {
					updateAccountFields(existingAdminUser, command.account);

					if (command.account.profile) {
						updateProfileFields(
							existingAdminUser.account.profile,
							command.account.profile,
						);

						if (command.account.profile.location) {
							updateLocationFields(
								existingAdminUser.account.profile.location,
								command.account.profile.location,
							);
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
