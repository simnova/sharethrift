import type { GraphContext } from '../../../init/context.ts';
import type { GraphQLResolveInfo } from 'graphql';
import type {
	Resolvers,
	QueryGetUserAppealRequestArgs,
	QueryGetAllUserAppealRequestsArgs,
	MutationCreateUserAppealRequestArgs,
	MutationUpdateUserAppealRequestStateArgs,
} from '../../builder/generated.ts';
import { PopulateUserFromField } from '../../resolver-helper.ts';

const userAppealRequestResolvers: Resolvers = {
	UserAppealRequest: {
		user: PopulateUserFromField('user'),
		blocker: PopulateUserFromField('blocker'),
	},
	Query: {
		getUserAppealRequest: async (
			_parent: unknown,
			args: QueryGetUserAppealRequestArgs,
			context: GraphContext,
			_info: GraphQLResolveInfo,
		) => {
			// TODO: SECURITY - Add authentication and authorization check
			// Should verify user has permission to view this appeal request
			return await context.applicationServices.AppealRequest.UserAppealRequest.getById(
				args,
			);
		},
		getAllUserAppealRequests: async (
			_parent: unknown,
			args: QueryGetAllUserAppealRequestsArgs,
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
						stateFilters: [...args.input.stateFilters],
					}),
					...(args.input.sorter && { sorter: args.input.sorter }),
				},
			);
		},
	},

	Mutation: {
		createUserAppealRequest: async (
			_parent: unknown,
			args: MutationCreateUserAppealRequestArgs,
			context: GraphContext,
			_info: GraphQLResolveInfo,
		) => {
			// TODO: SECURITY - Add authentication check
			// TODO: SECURITY - Verify the authenticated user matches userId
			// TODO: SECURITY - Verify the user is actually blocked by blockerId
			return await context.applicationServices.AppealRequest.UserAppealRequest.create(
				args.input,
			);
		},
		updateUserAppealRequestState: async (
			_parent: unknown,
			args: MutationUpdateUserAppealRequestStateArgs,
			context: GraphContext,
			_info: GraphQLResolveInfo,
		) => {
			// TODO: SECURITY - Add admin permission check
			// Only admins should be able to update appeal request state
			const state = args.input.state.toLowerCase() as
				| 'requested'
				| 'denied'
				| 'accepted';
			return await context.applicationServices.AppealRequest.UserAppealRequest.updateState(
				{
					id: args.input.id,
					state,
				},
			);
		},
	},
};

export default userAppealRequestResolvers;
