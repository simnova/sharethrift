import type { GraphContext } from '../../../init/context.ts';
import type { GraphQLResolveInfo } from 'graphql';
import type {
	AdminUserCreateInput,
	AdminUserUpdateInput,
	Resolvers,
	QueryAllAdminUsersArgs,
} from '../../builder/generated.ts';
import type { AdminUserUpdateCommand } from '@sthrift/application-services';

const adminUserResolvers: Resolvers = {
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
			
			// Permission check: Get the current admin user to check their role
			const currentAdmin = await context.applicationServices.User.AdminUser.queryByEmail({
				email: context.applicationServices.verifiedUser.verifiedJwt.email,
			});
			
			// Check if they have permission to view all admin users
			if (!currentAdmin?.role?.permissions?.userPermissions?.canViewAllUsers) {
				throw new Error('Forbidden: Only users with canViewAllUsers permission can access this query');
			}
			
            return await context.applicationServices.User.AdminUser.getAllUsers({
                page: args.page,
                pageSize: args.pageSize,
                searchText: args.searchText || undefined,
                statusFilters: args.statusFilters
                    ? [...args.statusFilters]
                    : undefined,
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
			if (!context.applicationServices.verifiedUser?.verifiedJwt) {
				throw new Error('Unauthorized: Authentication required');
			}
			
			// Permission check: Only admins with canManageUserRoles can create admin users
			const currentAdmin = await context.applicationServices.User.AdminUser.queryByEmail({
				email: context.applicationServices.verifiedUser.verifiedJwt.email,
			});
			
			if (!currentAdmin?.role?.permissions?.userPermissions?.canManageUserRoles) {
				throw new Error('Forbidden: Only users with canManageUserRoles permission can create admin users');
			}
			
			console.log('createAdminUser resolver called with email:', args.input.email);
			return await context.applicationServices.User.AdminUser.createIfNotExists({
				email: args.input.email,
				username: args.input.username,
				firstName: args.input.firstName,
				lastName: args.input.lastName,
				roleId: args.input.roleId,
			});
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
			
			// Permission check: Get current admin to check permissions
			const currentAdmin = await context.applicationServices.User.AdminUser.queryByEmail({
				email: context.applicationServices.verifiedUser.verifiedJwt.email,
			});
			
			const isEditingSelf = currentAdmin?.id === args.input.id;
			const canEditUsers = currentAdmin?.role?.permissions?.userPermissions?.canEditUsers ?? false;
			
			// Allow if editing self OR have canEditUsers permission
			if (!isEditingSelf && !canEditUsers) {
				throw new Error('Forbidden: You can only edit your own account or need canEditUsers permission');
			}
			
			// If changing role, need canManageUserRoles permission
			if (args.input.roleId && !currentAdmin?.role?.permissions?.userPermissions?.canManageUserRoles) {
				throw new Error('Forbidden: Changing roles requires canManageUserRoles permission');
			}
			
			console.log('adminUserUpdate resolver called with id:', args.input.id);
			// Note: Additional authorization checks are also enforced in domain layer via passport/visa
			return await context.applicationServices.User.AdminUser.update(
				args.input as AdminUserUpdateCommand,
			);
		},
		// //If necessary, the following code can block and unblock admins
		// blockAdminUser: async (
		// 	_parent: unknown,
		// 	args: { userId: string },
		// 	context: GraphContext,
		// 	_info: GraphQLResolveInfo,
		// ) => {
		// 	if (!context.applicationServices.verifiedUser?.verifiedJwt) {
		// 		throw new Error('Unauthorized');
		// 	}
		// 	// SECURITY - Add admin permission check
		// 	return await context.applicationServices.User.AdminUser.blockUser({
		// 		userId: args.userId,
		// 	});
		// },
		// unblockAdminUser: async (
		// 	_parent: unknown,
		// 	args: { userId: string },
		// 	context: GraphContext,
		// 	_info: GraphQLResolveInfo,
		// ) => {
		// 	if (!context.applicationServices.verifiedUser?.verifiedJwt) {
		// 		throw new Error('Unauthorized');
		// 	}
		// 	// SECURITY - Add admin permission check
		// 	return await context.applicationServices.User.AdminUser.unblockUser({
		// 		userId: args.userId,
		// 	});
		// },
	},
};

export default adminUserResolvers;
