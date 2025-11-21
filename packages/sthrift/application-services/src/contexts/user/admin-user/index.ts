import type { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';
import {
	type AdminUserQueryByIdCommand,
	queryById,
} from './query-by-id.ts';
import {
	createIfNotExists,
	type AdminUserCreateCommand,
} from './create-if-not-exists.ts';
import {
	queryByEmail,
	type AdminUserQueryByEmailCommand,
} from './query-by-email.ts';
import {
	queryByUsername,
	type AdminUserQueryByUsernameCommand,
} from './query-by-username.ts';
import {
	getAllUsers,
	type GetAllAdminUsersCommand,
	type AdminUserPageResult,
} from './get-all-users.ts';
import { update, type AdminUserUpdateCommand } from './update.ts';
import { blockUser, type BlockAdminUserCommand } from './block-user.ts';
import {
	unblockUser,
	type UnblockAdminUserCommand,
} from './unblock-user.ts';

export interface AdminUserApplicationService {
	createIfNotExists: (
		command: AdminUserCreateCommand,
	) => Promise<Domain.Contexts.User.AdminUser.AdminUserEntityReference>;
	queryById: (
		command: AdminUserQueryByIdCommand,
	) => Promise<Domain.Contexts.User.AdminUser.AdminUserEntityReference | null>;
	queryByEmail: (
		command: AdminUserQueryByEmailCommand,
	) => Promise<Domain.Contexts.User.AdminUser.AdminUserEntityReference | null>;
	queryByUsername: (
		command: AdminUserQueryByUsernameCommand,
	) => Promise<Domain.Contexts.User.AdminUser.AdminUserEntityReference | null>;
	update: (
		command: AdminUserUpdateCommand,
	) => Promise<Domain.Contexts.User.AdminUser.AdminUserEntityReference>;
	getAllUsers: (
		command: GetAllAdminUsersCommand,
	) => Promise<AdminUserPageResult>;
	blockUser: (
		command: BlockAdminUserCommand,
	) => Promise<Domain.Contexts.User.AdminUser.AdminUserEntityReference>;
	unblockUser: (
		command: UnblockAdminUserCommand,
	) => Promise<Domain.Contexts.User.AdminUser.AdminUserEntityReference>;
}

export const AdminUser = (
	dataSources: DataSources,
): AdminUserApplicationService => {
	return {
		createIfNotExists: createIfNotExists(dataSources),
		queryById: queryById(dataSources),
		queryByEmail: queryByEmail(dataSources),
		queryByUsername: queryByUsername(dataSources),
		update: update(dataSources),
		getAllUsers: getAllUsers(dataSources),
		blockUser: blockUser(dataSources),
		unblockUser: unblockUser(dataSources),
	};
};

export type {
	GetAllAdminUsersCommand,
	AdminUserPageResult,
} from './get-all-users.ts';
