import type { GraphContext } from '../../../init/context.ts';
import type { Resolvers } from '../../builder/generated.ts';

const userAppealRequestResolvers = {
	UserAppealRequest: {
		createdAt: (parent: { createdAt?: Date | string }) => {
			if (parent.createdAt instanceof Date) {
				return parent.createdAt.toISOString();
			}
			return parent.createdAt;
		},
		updatedAt: (parent: { updatedAt?: Date | string }) => {
			if (parent.updatedAt instanceof Date) {
				return parent.updatedAt.toISOString();
			}
			return parent.updatedAt;
		},
		state: (parent: { state?: string }) => {
			return parent.state?.toUpperCase();
		},
		type: (parent: { type?: string }) => {
			return parent.type?.toUpperCase();
		},
	},
	Query: {
		getUserAppealRequest: async (_parent: unknown, args: { id: string }, context: GraphContext) => {
			// TODO: SECURITY - Add authentication and authorization check
			// Should verify user has permission to view this appeal request
			return await context.applicationServices.AppealRequest.UserAppealRequest.getById(args);
		},
		getAllUserAppealRequests: async (
			_parent: unknown,
			args: {
				input: {
					page: number;
					pageSize: number;
					stateFilters?: string[] | null;
					sorter?: { field: string; order: string } | null;
				};
			},
			context: GraphContext,
		) => {
			// TODO: SECURITY - Add admin permission check
			// Only admins should be able to view all user appeal requests
			const input = {
				page: args.input.page,
				pageSize: args.input.pageSize,
				...(args.input.stateFilters && { stateFilters: args.input.stateFilters }),
				...(args.input.sorter && { sorter: args.input.sorter }),
			};
			return await context.applicationServices.AppealRequest.UserAppealRequest.getAll(input);
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
		) => {
			// TODO: SECURITY - Add authentication check
			// TODO: SECURITY - Verify the authenticated user matches userId
			// TODO: SECURITY - Verify the user is actually blocked by blockerId
			return await context.applicationServices.AppealRequest.UserAppealRequest.create(args.input);
		},
		updateUserAppealRequestState: async (
			_parent: unknown,
			args: {
				input: {
					id: string;
					state: string;
				};
			},
			context: GraphContext,
		) => {
			// TODO: SECURITY - Add admin permission check
			// Only admins should be able to update appeal request state
			const state = args.input.state.toLowerCase() as 'requested' | 'denied' | 'accepted';
			return await context.applicationServices.AppealRequest.UserAppealRequest.updateState({
				id: args.input.id,
				state,
			});
		},
	},
} as unknown as Resolvers;

export default userAppealRequestResolvers;
