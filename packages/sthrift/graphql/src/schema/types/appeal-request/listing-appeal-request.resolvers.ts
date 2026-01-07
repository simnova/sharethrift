import type { GraphContext } from '../../../init/context.ts';
import type { GraphQLResolveInfo } from 'graphql';
import type {
	Resolvers,
	QueryGetListingAppealRequestArgs,
	QueryGetAllListingAppealRequestsArgs,
	MutationCreateListingAppealRequestArgs,
	MutationUpdateListingAppealRequestStateArgs,
} from '../../builder/generated.ts';
import {
	PopulateUserFromField,
	PopulateItemListingFromField,
} from '../../resolver-helper.ts';

const listingAppealRequestResolvers: Resolvers = {
	ListingAppealRequest: {
		user: PopulateUserFromField('user'),
		listing: PopulateItemListingFromField('listing'),
		blocker: PopulateUserFromField('blocker'),
	},
	Query: {
		getListingAppealRequest: async (
			_parent: unknown,
			args: QueryGetListingAppealRequestArgs,
			context: GraphContext,
			_info: GraphQLResolveInfo,
		) => {
			// TODO: SECURITY - Add authentication and authorization check
			// Should verify user has permission to view this appeal request
			return await context.applicationServices.AppealRequest.ListingAppealRequest.getById(
				args,
			);
		},
		getListingAppealRequestByListingId: async (
			_parent: unknown,
			args: { listingId: string },
			context: GraphContext,
			_info: GraphQLResolveInfo,
		) => {
			// TODO: SECURITY - Add authentication check
			// TODO: SECURITY - Should verify user has permission to view appeal request for this listing
			// (either they own the listing or are an admin)
			return await context.applicationServices.AppealRequest.ListingAppealRequest.getByListingId(
				{ listingId: args.listingId },
			);
		},
		getAllListingAppealRequests: async (
			_parent: unknown,
			args: QueryGetAllListingAppealRequestsArgs,
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
						stateFilters: [...args.input.stateFilters],
					}),
					...(args.input.sorter && { sorter: args.input.sorter }),
				},
			);
		},
	},

	Mutation: {
		createListingAppealRequest: async (
			_parent: unknown,
			args: MutationCreateListingAppealRequestArgs,
			context: GraphContext,
			_info: GraphQLResolveInfo,
		) => {
			// TODO: SECURITY - Add authentication check
			// TODO: SECURITY - Verify the authenticated user matches userId
			// TODO: SECURITY - Verify the user is actually blocked by blockerId
			return await context.applicationServices.AppealRequest.ListingAppealRequest.create(
				args.input,
			);
		},
		updateListingAppealRequestState: async (
			_parent: unknown,
			args: MutationUpdateListingAppealRequestStateArgs,
			context: GraphContext,
			_info: GraphQLResolveInfo,
		) => {
			// TODO: SECURITY - Add admin permission check
			// Only admins should be able to update appeal request state
			const state = args.input.state.toLowerCase() as
				| 'requested'
				| 'denied'
				| 'accepted';
			return await context.applicationServices.AppealRequest.ListingAppealRequest.updateState(
				{
					id: args.input.id,
					state,
				},
			);
		},
	},
};

export default listingAppealRequestResolvers;
