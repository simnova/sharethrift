import type { GraphContext } from '../../../init/context.ts';
import type { GraphQLResolveInfo } from 'graphql';
import type {
	AdminUser,
	AdminUserCreateInput,
	AdminUserUpdateInput,
	Resolvers,
	QueryAllAdminUsersArgs,
} from '../../builder/generated.ts';
import type { AdminUserUpdateCommand } from '@sthrift/application-services';
import { getUserByEmail, currentViewerIsAdmin } from '../../resolver-helper.ts';

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
		adminUserById: async (
			_parent: unknown,
			args: { id: string },
			context: GraphContext,
			_info: GraphQLResolveInfo,
		) => {
			console.log('adminUserById resolver called with id:', args.id);
			return await context.applicationServices.User.AdminUser.queryById({
				id: args.id,
			});
		},
		adminUserByEmail: async (
			_parent: unknown,
			args: { email: string },
			context: GraphContext,
			_info: GraphQLResolveInfo,
		) => {
			console.log('adminUserByEmail resolver called with email:', args.email);
			return await context.applicationServices.User.AdminUser.queryByEmail({
				email: args.email,
			});
		},
		adminUserByUsername: async (
			_parent: unknown,
			args: { username: string },
			context: GraphContext,
			_info: GraphQLResolveInfo,
		) => {
			console.log(
				'adminUserByUsername resolver called with username:',
				args.username,
			);
			return await context.applicationServices.User.AdminUser.queryByUsername({
				username: args.username,
			});
		},
		currentAdminUser: async (
			_parent: unknown,
			_args: unknown,
			context: GraphContext,
			_info: GraphQLResolveInfo,
		) => {
			if (!context.applicationServices.verifiedUser?.verifiedJwt) {
				throw new Error('Unauthorized: Authentication required');
			}
			console.log('currentAdminUser resolver called');
			// Note: Additional authorization checks are enforced in domain layer via passport/visa
			return await context.applicationServices.User.AdminUser.queryByEmail({
				email: context.applicationServices.verifiedUser.verifiedJwt.email,
			});
		},
		// The following code can be used to list all admin users in the database
		allAdminUsers: async (
			_parent: unknown,
			args: QueryAllAdminUsersArgs,
			context: GraphContext,
			_info: GraphQLResolveInfo,
		) => {
			if (!context.applicationServices.verifiedUser?.verifiedJwt) {
				throw new Error('Unauthorized: Authentication required');
			}

			// Query-level permission check: Only admins with canViewAllUsers can view all admin users
			// (Read permissions are checked at GraphQL/service layer, write permissions at domain layer)
			const { email } = context.applicationServices.verifiedUser.verifiedJwt;
			const currentUser = await getUserByEmail(email, context);
			const isAdmin = currentUser && 'role' in currentUser;

			if (
				!isAdmin ||
				!currentUser?.role?.permissions?.userPermissions?.canViewAllUsers
			) {
				throw new Error(
					'Forbidden: Only admins with canViewAllUsers permission can access this query',
				);
			}

			return await context.applicationServices.User.AdminUser.getAllUsers({
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
			const { verifiedUser } = context.applicationServices;
			if (!verifiedUser?.verifiedJwt) {
				throw new Error('Unauthorized: Authentication required');
			}

			// Only admins with canManageUserRoles permission can create admin users
			const { email } = verifiedUser.verifiedJwt;
			const currentUser = await getUserByEmail(email, context);
			const isAdmin = currentUser && 'role' in currentUser;

			if (
				!isAdmin ||
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
			return await context.applicationServices.User.AdminUser.createIfNotExists(
				{
					email: args.input.email,
					username: args.input.username,
					firstName: args.input.firstName,
					lastName: args.input.lastName,
					roleId: args.input.roleId,
				},
			);
		},
		adminUserUpdate: async (
			_parent: unknown,
			args: { input: AdminUserUpdateInput },
			context: GraphContext,
			_info: GraphQLResolveInfo,
		) => {
			if (!context.applicationServices.verifiedUser?.verifiedJwt) {
				throw new Error('Unauthorized: Authentication required');
			}

			// Permission checks are handled in the domain layer via passport/visa
			// - isEditingOwnAccount and canEditUsers checked by entity setters
			// - canManageUserRoles checked by role setter
			console.log('adminUserUpdate resolver called with id:', args.input.id);
			return await context.applicationServices.User.AdminUser.update(
				args.input as AdminUserUpdateCommand,
			);
		},
	},
};

export default adminUserResolvers;
