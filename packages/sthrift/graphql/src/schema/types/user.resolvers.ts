import type { GraphContext } from '../../init/context.ts';
import type { GraphQLResolveInfo } from 'graphql';
import type { Resolvers } from '../builder/generated.ts';
import {
	currentViewerIsAdmin,
	requireAuthentication,
	extractUserProfileFromJwt,
} from '../resolver-helper.ts';

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

			if (await currentViewerIsAdmin(context)) {
				throw new Error(
					'Forbidden: Admin users cannot use currentUser. Use currentAdminUser instead.',
				);
			}

			const user =
				await context.applicationServices.User.PersonalUser.queryByEmail({
					email: jwt.email,
				});

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

			if (await currentViewerIsAdmin(context)) {
				throw new Error(
					'Forbidden: Admin users cannot use currentUserAndCreateIfNotExists. Use currentAdminUser instead.',
				);
			}

			const existingUser =
				await context.applicationServices.User.PersonalUser.queryByEmail({
					email,
				});

			if (existingUser) {
				return existingUser;
			}

			// Create new User if not found
			// This only triggers on first login - subsequent requests return existing user
			return await context.applicationServices.User.PersonalUser.createIfNotExists(
				{
					email,
					firstName,
					lastName,
				},
			);
		},
	},

	// Union type resolver - tells GraphQL which concrete type to use
	User: {
		__resolveType(obj: {
			id: string;
			userType: string;
		}): 'PersonalUser' {
			if (typeof obj === 'object' && obj !== null && 'userType' in obj) {
				const userType = obj.userType?.toLowerCase();
				if (userType === 'personal-user') {
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
