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
				throw new Error('Unauthorized');
			}
			console.log('currentAdminUser resolver called');
			// TODO: SECURITY - Add admin permission check
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
            //if (!context.applicationServices.verifiedUser?.verifiedJwt) {
            //    throw new Error('Unauthorized');
            //}

            // - Add admin permission check
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
			//if (!context.applicationServices.verifiedUser?.verifiedJwt) {
			//	throw new Error('Unauthorized');
			//}
			//console.log('createAdminUser resolver called with email:', args.input.email);
			// TODO: SECURITY - Add admin permission check (e.g., only super admins can create admin users)
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
				throw new Error('Unauthorized');
			}
			console.log('adminUserUpdate resolver called with id:', args.input.id);
			// TODO: SECURITY - Add admin permission check
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
