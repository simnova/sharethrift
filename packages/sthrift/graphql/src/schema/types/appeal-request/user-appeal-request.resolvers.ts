import type { GraphContext } from '../../init/context.ts';
import type { GraphQLResolveInfo } from 'graphql';
import type { Resolvers } from '../../schema/builder/generated.ts';

const userAppealRequestResolvers: Resolvers = {
	Query: {
		getUserAppealRequest: async (
			_parent: unknown,
			args: { id: string },
			context: GraphContext,
			_info: GraphQLResolveInfo,
		) => {
			// TODO: SECURITY - Add authentication and authorization check
			// Should verify user has permission to view this appeal request
			return await context.applicationServices.AppealRequest.UserAppealRequest.getById(
				{
					id: args.id,
				},
			);
		},
		getAllUserAppealRequests: async (
			_parent: unknown,
			args: {
				input: {
					page: number;
					pageSize: number;
					stateFilters?: string[];
					sorter?: { field: string; order: string };
				};
			},
			context: GraphContext,
			_info: GraphQLResolveInfo,
		) => {
			// TODO: SECURITY - Add admin permission check
			// Only admins should be able to view all user appeal requests
			return await context.applicationServices.AppealRequest.UserAppealRequest.getAll(
				{
					page: args.input.page,
					pageSize: args.input.pageSize,
					...(args.input.stateFilters && {
						stateFilters: args.input.stateFilters,
					}),
					...(args.input.sorter && { sorter: args.input.sorter }),
				},
			);
		},
	},

	Mutation: {
		createUserAppealRequest: async (
			_parent: unknown,
			args: {
				input: {
					userId: string;
					reason: string;
					blockerId: string;
				};
			},
			context: GraphContext,
			_info: GraphQLResolveInfo,
		) => {
			// TODO: SECURITY - Add authentication check
			// TODO: SECURITY - Verify the authenticated user matches userId
			// TODO: SECURITY - Verify the user is actually blocked by blockerId
			return await context.applicationServices.AppealRequest.UserAppealRequest.create(
				{
					userId: args.input.userId,
					reason: args.input.reason,
					blockerId: args.input.blockerId,
				},
			);
		},
		updateUserAppealRequestState: async (
			_parent: unknown,
			args: {
				input: {
					id: string;
					state: 'requested' | 'denied' | 'accepted';
				};
			},
			context: GraphContext,
			_info: GraphQLResolveInfo,
		) => {
			// TODO: SECURITY - Add admin permission check
			// Only admins should be able to update appeal request state
			return await context.applicationServices.AppealRequest.UserAppealRequest.updateState(
				{
					id: args.input.id,
					state: args.input.state,
				},
			);
		},
	},
};

export default userAppealRequestResolvers;
