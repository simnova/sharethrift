import type { GraphContext } from '../../init/context.ts';
import type { GraphQLResolveInfo } from 'graphql';
import type { Resolvers } from '../../schema/builder/generated.ts';

const listingAppealRequestResolvers: Resolvers = {
	Query: {
		getListingAppealRequest: async (
			_parent: unknown,
			args: { id: string },
			context: GraphContext,
			_info: GraphQLResolveInfo,
		) => {
			// TODO: SECURITY - Add authentication and authorization check
			// Should verify user has permission to view this appeal request
			return await context.applicationServices.AppealRequest.ListingAppealRequest.getById(
				{
					id: args.id,
				},
			);
		},
		getAllListingAppealRequests: async (
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
			// Only admins should be able to view all listing appeal requests
			return await context.applicationServices.AppealRequest.ListingAppealRequest.getAll(
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
		createListingAppealRequest: async (
			_parent: unknown,
			args: {
				input: {
					userId: string;
					listingId: string;
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
			return await context.applicationServices.AppealRequest.ListingAppealRequest.create(
				{
					userId: args.input.userId,
					listingId: args.input.listingId,
					reason: args.input.reason,
					blockerId: args.input.blockerId,
				},
			);
		},
		updateListingAppealRequestState: async (
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
			return await context.applicationServices.AppealRequest.ListingAppealRequest.updateState(
				{
					id: args.input.id,
					state: args.input.state,
				},
			);
		},
	},
};

export default listingAppealRequestResolvers;
