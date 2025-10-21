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
			console.log('personalUser resolver called with id:', args.id);
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
			console.log('currentPersonalUserAndCreateIfNotExists resolver called');
			// Implement the logic to get the current personal user or create a new one
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
			if (!context.applicationServices.verifiedUser?.verifiedJwt) {
				throw new Error('Unauthorized: Authentication required');
			}

			// Permission check: Only admins with canViewAllUsers can view all personal users
			const currentAdmin = await context.applicationServices.User.AdminUser.queryByEmail({
				email: context.applicationServices.verifiedUser.verifiedJwt.email,
			});
			
			if (!currentAdmin?.role?.permissions?.userPermissions?.canViewAllUsers) {
				throw new Error('Forbidden: Only admins with canViewAllUsers permission can access this query');
			}

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
			
			// Permission check: Get current user (could be admin or personal user)
			const currentPersonalUser = await context.applicationServices.User.PersonalUser.queryByEmail({
				email: context.applicationServices.verifiedUser.verifiedJwt.email,
			});
			
			const isEditingSelf = currentPersonalUser?.id === args.input.id;
			
			// If not editing self, check if user is an admin with canEditUsers permission
			if (!isEditingSelf) {
				const currentAdmin = await context.applicationServices.User.AdminUser.queryByEmail({
					email: context.applicationServices.verifiedUser.verifiedJwt.email,
				});
				
				if (!currentAdmin?.role?.permissions?.userPermissions?.canEditUsers) {
					throw new Error('Forbidden: You can only edit your own account or need admin canEditUsers permission');
				}
			}
			
			console.log('personalUserUpdate resolver called with id:', args.input.id);
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
			if (!context.applicationServices.verifiedUser?.verifiedJwt) {
				throw new Error('Unauthorized');
			}
			
			// Permission check: Only admins with canBlockUsers can block users
			const currentAdmin = await context.applicationServices.User.AdminUser.queryByEmail({
				email: context.applicationServices.verifiedUser.verifiedJwt.email,
			});
			
			if (!currentAdmin?.role?.permissions?.userPermissions?.canBlockUsers) {
				throw new Error('Forbidden: Only admins with canBlockUsers permission can block users');
			}
			
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
			if (!context.applicationServices.verifiedUser?.verifiedJwt) {
				throw new Error('Unauthorized');
			}
			
			// Permission check: Only admins with canBlockUsers can unblock users
			const currentAdmin = await context.applicationServices.User.AdminUser.queryByEmail({
				email: context.applicationServices.verifiedUser.verifiedJwt.email,
			});
			
			if (!currentAdmin?.role?.permissions?.userPermissions?.canBlockUsers) {
				throw new Error('Forbidden: Only admins with canBlockUsers permission can unblock users');
			}
			
			return await context.applicationServices.User.PersonalUser.update({
				id: args.userId,
				isBlocked: false,
			});
		},
		processPayment: async (_parent, { request }, context) => {
			console.log('Processing payment', request);
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
			console.log('Refunding payment', request);
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
