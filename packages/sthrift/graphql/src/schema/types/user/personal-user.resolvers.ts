import type { GraphContext } from '../../../init/context.ts';
import type { GraphQLResolveInfo } from 'graphql';
import type {
	PersonalUserUpdateInput,
	PaymentResponse,
	RefundResponse,
	Resolvers,
	QueryAllUsersArgs,
} from '../../builder/generated.ts';
import type { PersonalUserUpdateCommand } from '@sthrift/application-services';

const personalUserResolvers: Resolvers = {
	Query: {
		personalUserById: async (
			_parent: unknown,
			args: { id: string },
			context: GraphContext,
			_info: GraphQLResolveInfo,
		) => {
			return await context.applicationServices.User.PersonalUser.queryById({
				id: args.id,
			});
		},
		currentPersonalUserAndCreateIfNotExists: async (
			_parent: unknown,
			_args: unknown,
			context: GraphContext,
			_info: GraphQLResolveInfo,
		) => {
			if (!context.applicationServices.verifiedUser?.verifiedJwt) {
				throw new Error('Unauthorized');
			}
			return await context.applicationServices.User.PersonalUser.createIfNotExists(
				{
					email: context.applicationServices.verifiedUser.verifiedJwt.email,
					firstName:
						context.applicationServices.verifiedUser.verifiedJwt.given_name,
					lastName:
						context.applicationServices.verifiedUser.verifiedJwt.family_name,
				},
			);
		},
		allUsers: async (
			_parent: unknown,
			args: QueryAllUsersArgs,
			context: GraphContext,
			_info: GraphQLResolveInfo,
		) => {
			// TODO: SECURITY - Add admin role-based authorization check when admin role system is implemented
			return await context.applicationServices.User.PersonalUser.getAllUsers({
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
		personalUserUpdate: async (
			_parent: unknown,
			args: { input: PersonalUserUpdateInput },
			context: GraphContext,
			_info: GraphQLResolveInfo,
		) => {
			if (!context.applicationServices.verifiedUser?.verifiedJwt) {
				throw new Error('Unauthorized');
			}
			// Future: Determine if user is editing own profile or admin editing another user
			return await context.applicationServices.User.PersonalUser.update(
				args.input as PersonalUserUpdateCommand,
			);
		},
		blockUser: async (
			_parent: unknown,
			args: { userId: string },
			context: GraphContext,
			_info: GraphQLResolveInfo,
		) => {
			// TODO: SECURITY - Add admin role-based authorization check when admin role system is implemented
			// Once implemented, use system-level permissions for admin operations
			return await context.applicationServices.User.PersonalUser.update({
				id: args.userId,
				isBlocked: true,
			});
		},
		unblockUser: async (
			_parent: unknown,
			args: { userId: string },
			context: GraphContext,
			_info: GraphQLResolveInfo,
		) => {
			// TODO: SECURITY - Add admin role-based authorization check when admin role system is implemented
			// Once implemented, use system-level permissions for admin operations
			return await context.applicationServices.User.PersonalUser.update({
				id: args.userId,
				isBlocked: false,
			});
		},
		processPayment: async (_parent, { request }, context) => {
			try {
				const sanitizedRequest = {
					...request,
					orderInformation: {
						...request.orderInformation,
						billTo: {
							...request.orderInformation.billTo,
							address2: request.orderInformation.billTo.address2 ?? '',
							phoneNumber: request.orderInformation.billTo.phoneNumber ?? '',
							email: request.orderInformation.billTo.email ?? '',
						},
					},
				};
				const response =
					await context.applicationServices.Payment.processPayment(
						sanitizedRequest,
					);
				return {
					...response,
					success: response.status === 'SUCCEEDED',
					message:
						response.status === 'SUCCEEDED'
							? 'Payment processed successfully'
							: undefined,
				} as PaymentResponse;
			} catch (error) {
				console.error('Payment processing error:', error);
				return {
					status: 'FAILED',
					success: false,
					message:
						error instanceof Error ? error.message : 'Unknown error occurred',
					errorInformation: {
						reason: 'PROCESSING_ERROR',
						message:
							error instanceof Error ? error.message : 'Unknown error occurred',
					},
				};
			}
		},
		refundPayment: async (_parent, { request }, context) => {
			try {
				const response =
					await context.applicationServices.Payment.refundPayment({
						...request,
						amount: request.amount ?? 0, // Ensure amount is a number, not null
					});
				return {
					...response,
					success: response.status === 'REFUNDED',
					message:
						response.status === 'REFUNDED'
							? 'Refund processed successfully'
							: null,
				} as RefundResponse;
			} catch (error) {
				console.error('Refund processing error:', error);
				return {
					status: 'FAILED',
					success: false,
					message:
						error instanceof Error ? error.message : 'Unknown error occurred',
					errorInformation: {
						reason: 'PROCESSING_ERROR',
						message:
							error instanceof Error ? error.message : 'Unknown error occurred',
					},
				} as RefundResponse;
			}
		},
	},
};

export default personalUserResolvers;
