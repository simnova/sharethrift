import type { GraphContext } from '../../init/context.ts';
import { getRequestedFieldPaths } from '../resolver-helper.ts';
import type { GraphQLResolveInfo } from 'graphql';
import type { PersonalUser, Resolvers } from '../builder/generated.ts';

export const personalUserResolvers = {
	Query: {
		personalUserById: async (
			_parent: unknown,
			{ id }: { id: string },
			context: GraphContext,
			info: GraphQLResolveInfo,
		) => {
			console.log('personalUser resolver called with id:', id);
			return (await context.applicationServices.User.PersonalUser.queryById({
				id: args.id,
				fields: getRequestedFieldPaths(info),
			})) as PersonalUser;
			// For now, return mock data until persistence layer is fixed
			// return {
			//   id,
			//   userType: 'personal',
			//   isBlocked: false,
			//   account: {
			//     accountType: 'personal',
			//     email: 'mock@example.com',
			//     username: 'mockuser',
			//     profile: {
			//       firstName: 'Mock',
			//       lastName: 'User',
			//       location: {
			//         address1: '123 Mock St',
			//         city: 'Mock City',
			//         state: 'MockState',
			//         country: 'MockCountry',
			//         zipCode: '12345'
			//       }
			//     }
			//   },
			//   schemaVersion: '1.0.0',
			//   createdAt: new Date().toISOString(),
			//   updatedAt: new Date().toISOString()
			// };
		},
	},

	Mutation: {},
};
