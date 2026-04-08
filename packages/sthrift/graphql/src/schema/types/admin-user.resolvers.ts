import type { GraphContext } from '../../init/context.ts';
import type { GraphQLResolveInfo } from 'graphql';
import type {
	AdminUser,
	AdminUserCreateInput,
	AdminUserUpdateInput,
	Resolvers,
	QueryAdminDashboardUsersArgs,
} from '../builder/generated.ts';
import type { AdminUserUpdateCommand } from '@sthrift/application-services';
import {
	currentViewerIsAdmin,
	getUserByEmail,
	requireCurrentAdminUser,
} from '../resolver-helper.ts';

const adminUserResolvers: Resolvers = {
	AdminUser: {
		role: async (rootObj: AdminUser, _args, context: GraphContext) => {
			// Only return role if user has permission to view it
			// Either viewing their own account or has canViewAllUsers permission
			const currentUserEmail =
				context.applicationServices.verifiedUser?.verifiedJwt?.email;
			if (!currentUserEmail) return null;

			const currentUser = await getUserByEmail(currentUserEmail, context);
			const isAdmin = currentUser && 'role' in currentUser;
			const isViewingSelf =
				currentUser?.account?.email === rootObj.account?.email;
			const canViewAllUsers =
				isAdmin &&
				currentUser?.role?.permissions?.userPermissions?.canViewAllUsers;

			if (isViewingSelf || canViewAllUsers) {
				return rootObj.role ?? null;
			}
			return null;
		},
		account: (rootObj: AdminUser, _args, _context: GraphContext) => {
			// Account info (email, username, firstName, lastName) is public
			return rootObj.account ?? null;
		},
		userIsAdmin: async (
			_rootObj: AdminUser,
			_args: unknown,
			context: GraphContext,
		) => {
			return await currentViewerIsAdmin(context);
		},
	},
	Query: {
		currentAdminUser: async (
			_parent: unknown,
			_args: unknown,
			context: GraphContext,
			_info: GraphQLResolveInfo,
		) => {
			console.log('currentAdminUser resolver called');
			return await requireCurrentAdminUser(context);
		},
		adminDashboardUsers: async (
			_parent: unknown,
			args: QueryAdminDashboardUsersArgs,
			context: GraphContext,
			_info: GraphQLResolveInfo,
		) => {
			await requireCurrentAdminUser(context);

			return await context.applicationServices.User.PersonalUser.getAllUsers({
				page: args.page,
				pageSize: args.pageSize,
				searchText: args.searchText || undefined,
				statusFilters: args.statusFilters ? [...args.statusFilters] : undefined,
				sorter: args.sorter || undefined,
			});
		},
	},

	Mutation: {
		createAdminUser: async (
			_parent: unknown,
			args: { input: AdminUserCreateInput },
			context: GraphContext,
			_info: GraphQLResolveInfo,
		) => {
			// Only admins with canManageUserRoles permission can create admin users
			const currentUser = await requireCurrentAdminUser(context);

			if (
				!currentUser?.role?.permissions?.userPermissions?.canManageUserRoles
			) {
				throw new Error(
					'Forbidden: Only admins with canManageUserRoles permission can create admin accounts',
				);
			}
			console.log(
				'createAdminUser resolver called with email:',
				args.input.email,
			);
			try {
				const adminUser =
					await context.applicationServices.User.AdminUser.createIfNotExists(
						{
							email: args.input.email,
							username: args.input.username,
							firstName: args.input.firstName,
							lastName: args.input.lastName,
							roleId: args.input.roleId,
						},
					);
				return {
					status: { success: true },
					adminUser,
				};
			} catch (error) {
				const { message } = error as Error;
				return {
					status: { success: false, errorMessage: message },
				};
			}
		},
		adminUserUpdate: async (
			_parent: unknown,
			args: { input: AdminUserUpdateInput },
			context: GraphContext,
			_info: GraphQLResolveInfo,
		) => {
			await requireCurrentAdminUser(context);

			// Permission checks are handled in the domain layer via passport/visa
			// - isEditingOwnAccount and canEditUsers checked by entity setters
			// - canManageUserRoles checked by role setter
			console.log('adminUserUpdate resolver called with id:', args.input.id);
			try {
				const adminUser =
					await context.applicationServices.User.AdminUser.update(
						args.input as AdminUserUpdateCommand,
					);
				return {
					status: { success: true },
					adminUser,
				};
			} catch (error) {
				const { message } = error as Error;
				return {
					status: { success: false, errorMessage: message },
				};
			}
		},
	},
};

export default adminUserResolvers;
