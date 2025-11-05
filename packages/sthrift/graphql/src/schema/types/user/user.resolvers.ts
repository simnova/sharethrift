import type { GraphContext } from '../../../init/context.ts';
import type { GraphQLResolveInfo } from 'graphql';
import type {
	Resolvers,
	QueryAllSystemUsersArgs,
} from '../../builder/generated.ts';

const userUnionResolvers: Resolvers = {
	Query: {
		currentUser: async (
			_parent: unknown,
			_args: unknown,
			context: GraphContext,
			_info: GraphQLResolveInfo,
		) => {
			if (!context.applicationServices.verifiedUser?.verifiedJwt) {
				throw new Error('Unauthorized: Authentication required');
			}

			const { email } = context.applicationServices.verifiedUser.verifiedJwt;

			// Try AdminUser first
			try {
				const adminUser =
					await context.applicationServices.User.AdminUser.queryByEmail({
						email,
					});
				if (adminUser) {
					return adminUser;
				}
			} catch {
				// AdminUser not found, continue to PersonalUser
			}

			// Try PersonalUser
			try {
				const personalUser =
					await context.applicationServices.User.PersonalUser.queryByEmail({
						email,
					});
				if (personalUser) {
					return personalUser;
				}
			} catch {
				// PersonalUser not found
			}

			throw new Error('User not found');
		},

		allSystemUsers: async (
			_parent: unknown,
			args: QueryAllSystemUsersArgs,
			context: GraphContext,
			_info: GraphQLResolveInfo,
		) => {
			if (!context.applicationServices.verifiedUser?.verifiedJwt) {
				throw new Error('Unauthorized: Authentication required');
			}

			// Permission check: Only admins with canViewAllUsers can view all users
			const currentAdmin =
				await context.applicationServices.User.AdminUser.queryByEmail({
					email: context.applicationServices.verifiedUser.verifiedJwt.email,
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
			// Detect type by structure or userType field
			if (typeof obj === 'object' && obj !== null) {
				// Check userType field first (most reliable)
				if ('userType' in obj && typeof obj.userType === 'string') {
					const userType = obj.userType.toLowerCase();
					if (userType === 'admin' || userType === 'adminuser') {
						return 'AdminUser' as const;
					}
					if (userType === 'personal' || userType === 'personaluser') {
						return 'PersonalUser' as const;
					}
				}

				// Fallback: check for distinctive fields
				// AdminUser has a 'role' field, PersonalUser has 'hasCompletedOnboarding'
				if ('role' in obj) {
					return 'AdminUser' as const;
				}
				if ('hasCompletedOnboarding' in obj) {
					return 'PersonalUser' as const;
				}
			}

			// Default fallback
			console.warn('Unable to resolve User union type', obj);
			return 'PersonalUser' as const;
		},
	},
};

export default userUnionResolvers;
