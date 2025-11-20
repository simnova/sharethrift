import type { GraphContext } from '../../../init/context.ts';
import type { GraphQLResolveInfo } from 'graphql';
import type {
PaymentResponse,
	PersonalUserUpdateInput,
	ProcessPaymentInput,
	RefundResponse,
	Resolvers,
	QueryAllUsersArgs,
} from '../../builder/generated.ts';
import type { PersonalUserUpdateCommand } from '@sthrift/application-services';
import type { Domain } from '@sthrift/domain';

const PersonalUserMutationResolver = async (
	getPersonalUser: Promise<Domain.Contexts.User.PersonalUser.PersonalUserEntityReference>,
) => {
	try {
		return {
			status: { success: true },
			personalUser: await getPersonalUser,
		};
	} catch (error) {
		console.error('PersonalUser > Mutation  : ', error);
		const { message } = error as Error;
		return {
			status: { success: false, errorMessage: message },
		};
	}
};

const personalUserResolvers: Resolvers = {
	Query: {
		personalUserCybersourcePublicKeyId: async (
			_parent,
			_args,
			context,
			_info,
		) => {
			return await context.applicationServices.Payment.generatePublicKey();
		},
		personalUserById: async (
			_parent,
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
			// Check if user is admin
			//if (!context.applicationServices.verifiedUser?.verifiedJwt) {
			//	throw new Error('Unauthorized');
			//}

			// TODO: SECURITY - Add admin permission check
			return await context.applicationServices.User.PersonalUser.getAllUsers({
				page: args.page,
				pageSize: args.pageSize,
				searchText: args.searchText || undefined,
				statusFilters: args.statusFilters ? [...args.statusFilters] : undefined,
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
			console.log('personalUserUpdate resolver called with id:', args.input.id);
			/// TODO: SECURITY - Add admin permission check
			return await PersonalUserMutationResolver(
				context.applicationServices.User.PersonalUser.update(
					args.input as PersonalUserUpdateCommand,
				),
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
			// TODO: SECURITY - Add admin permission check
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
			// TODO: SECURITY - Add admin permission check
			return await context.applicationServices.User.PersonalUser.update({
				id: args.userId,
				isBlocked: false,
			});
		},
		processPayment: async (
			_parent,
			args: { input: ProcessPaymentInput },
			context,
		) => {
			console.log('Processing payment', args.input);

			return await context.applicationServices.User.PersonalUser.processPayment(
				{
					request: {
						userId: args.input.userId,
						paymentInstrument: {
							...args.input.paymentInstrument,
							billingAddressLine2:
								args.input.paymentInstrument.billingAddressLine2 ?? '',
							billingPhone: args.input.paymentInstrument.billingPhone ?? '',
							billingEmail: args.input.paymentInstrument.billingEmail ?? '',
						},
						paymentAmount: args.input.paymentAmount,
						currency: args.input.currency,
					},
				},
			) as PaymentResponse;
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
