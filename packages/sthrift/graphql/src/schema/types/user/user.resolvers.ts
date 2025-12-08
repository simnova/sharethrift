import type { GraphContext } from '../../../init/context.ts';
import type { GraphQLResolveInfo } from 'graphql';
import type {
	Resolvers,
	QueryAllSystemUsersArgs,
} from '../../builder/generated.ts';
import {
	getUserByEmail,
	requireAuthentication,
	extractUserProfileFromJwt,
} from '../../resolver-helper.ts';

const userUnionResolvers: Resolvers = {
	Query: {
		currentUser: async (
			_parent: unknown,
			_args: unknown,
			context: GraphContext,
			_info: GraphQLResolveInfo,
		) => {
			requireAuthentication(context);

			// Safe to access after requireAuthentication check
			const {verifiedUser} = context.applicationServices;
			const jwt = verifiedUser?.verifiedJwt;
			if (!jwt?.email) {
				throw new Error('Email not found in verified JWT');
			}

			const user = await getUserByEmail(jwt.email, context);

			if (!user) {
				throw new Error('User not found');
			}

			return user;
		},

		currentUserAndCreateIfNotExists: async (
			_parent: unknown,
			_args: unknown,
			context: GraphContext,
			_info: GraphQLResolveInfo,
		) => {
			// Use consistent auth check across resolvers
			requireAuthentication(context);

			// Extract and validate JWT claims with safe fallbacks for missing name fields
			const { email, firstName, lastName } =
				extractUserProfileFromJwt(context);

			// Check if user already exists (admin or personal)
			const existingUser = await getUserByEmail(email, context);

			if (existingUser) {
				return existingUser;
			}

			// Create new PersonalUser if not found
			// Note: Admins are created manually, so new B2C logins default to PersonalUser
			// This only triggers on first login - subsequent requests return existing user
			return await context.applicationServices.User.PersonalUser.createIfNotExists(
				{
					email,
					firstName,
					lastName,
				},
			);
		},

		userById: async (
			_parent: unknown,
			args: { id: string },
			context: GraphContext,
			_info: GraphQLResolveInfo,
		) => {
			// Try AdminUser first
			try {
				const adminUser =
					await context.applicationServices.User.AdminUser.queryById({
						id: args.id,
					});
				if (adminUser) {
					return adminUser;
				}
			} catch {
				// AdminUser not found, try PersonalUser
			}

			// Try PersonalUser
			try {
				const personalUser =
					await context.applicationServices.User.PersonalUser.queryById({
						id: args.id,
					});
				if (personalUser) {
					return personalUser;
				}
			} catch {
				// PersonalUser not found
			}

			return null;
		},

		allSystemUsers: async (
			_parent: unknown,
			args: QueryAllSystemUsersArgs,
			context: GraphContext,
			_info: GraphQLResolveInfo,
		) => {
			requireAuthentication(context);

			// Permission check: Only admins with canViewAllUsers can view all users
			const {verifiedUser} = context.applicationServices;
			const jwt = verifiedUser?.verifiedJwt;
			if (!jwt?.email) {
				throw new Error('Email not found in verified JWT');
			}

			const currentAdmin =
				await context.applicationServices.User.AdminUser.queryByEmail({
					email: jwt.email,
				});

			if (!currentAdmin?.role?.permissions?.userPermissions?.canViewAllUsers) {
				throw new Error(
					'Forbidden: Only admins with canViewAllUsers permission can access this query',
				);
			}

			// Determine which user types to fetch based on filter
			const userTypeFilter = args.userTypeFilter
				? [...args.userTypeFilter]
				: null;
			const shouldFetchPersonal =
				!userTypeFilter || userTypeFilter.includes('personal');
			const shouldFetchAdmin =
				!userTypeFilter || userTypeFilter.includes('admin');

			// Fetch both user types in parallel if needed
			const [personalUsersResult, adminUsersResult] = await Promise.all([
				shouldFetchPersonal
					? context.applicationServices.User.PersonalUser.getAllUsers({
							page: args.page,
							pageSize: args.pageSize,
							searchText: args.searchText ?? undefined,
							statusFilters: args.statusFilters
								? [...args.statusFilters]
								: undefined,
							sorter: args.sorter ?? undefined,
						})
					: Promise.resolve({ items: [], total: 0, page: 0, pageSize: 0 }),
				shouldFetchAdmin
					? context.applicationServices.User.AdminUser.getAllUsers({
							page: args.page,
							pageSize: args.pageSize,
							searchText: args.searchText ?? undefined,
							statusFilters: args.statusFilters
								? [...args.statusFilters]
								: undefined,
							sorter: args.sorter ?? undefined,
						})
					: Promise.resolve({ items: [], total: 0, page: 0, pageSize: 0 }),
			]);

			// Merge results (GraphQL will use __resolveType to determine concrete type)
			const items = [...personalUsersResult.items, ...adminUsersResult.items];

			// Sort merged items if needed (based on sorter)
			// For now, simple concatenation - can be enhanced with custom sorting

			return {
				items,
				total: personalUsersResult.total + adminUsersResult.total,
				page: args.page,
				pageSize: args.pageSize,
			};
		},
	},

	// Union type resolver - tells GraphQL which concrete type to use
	// frontend can check __typename === 'AdminUser' without custom hooks
	User: {
		__resolveType(obj: unknown): 'AdminUser' | 'PersonalUser' {
			if (typeof obj === 'object' && obj !== null && 'userType' in obj) {
				const userType = (obj.userType as string)?.toLowerCase();

				// Matching Mongoose discriminator values for AdminUser and PersonalUser
				if (userType === 'admin-user') {
					return 'AdminUser' as const;
				}
				if (userType === 'personal-users') {
					return 'PersonalUser' as const;
				}
			}
			throw new Error(
				`Unable to resolve User union type. Invalid userType: ${JSON.stringify(obj)}`,
			);
		},
	},
};

export default userUnionResolvers;
