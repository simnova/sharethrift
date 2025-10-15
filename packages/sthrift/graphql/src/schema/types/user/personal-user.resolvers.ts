import type { GraphContext } from '../../../init/context.ts';
import type { GraphQLResolveInfo } from 'graphql';
import type {
	PersonalUserUpdateInput,
	PaymentResponse,
	RefundResponse,
	Resolvers,
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
			// Implement the logic to update the personal user
			return await PersonalUserMutationResolver(
				context.applicationServices.User.PersonalUser.update(
					args.input as PersonalUserUpdateCommand,
				),
			);
		},
		processPayment: async (_parent, { input }, context) => {
			console.log('Processing payment', input);

			try {
				const personalUser =
					await context.applicationServices.User.PersonalUser.queryById({
						id: input.userId,
					});
				if (!personalUser) {
					return {
						status: 'FAILED',
						success: false,
						message: 'User not found',
					} as PaymentResponse;
				}

				const sanitizedRequest = {
					...input,
					paymentInstrument: {
						...input.paymentInstrument,
						billingAddressLine2:
							input.paymentInstrument.billingAddressLine2 ?? '',
						billingPhone: input.paymentInstrument.billingPhone ?? '',
						billingEmail: input.paymentInstrument.billingEmail ?? '',
					},
				};

				const response =
					await context.applicationServices.Payment.processPayment(
						sanitizedRequest,
					);

				if (
					response.status === 'FAILED' ||
					response.cybersourceCustomerId === undefined
				) {
					return {
						status: 'FAILED',
						success: false,
						message: 'Payment failed',
					} as PaymentResponse;
				}

				await context.applicationServices.User.PersonalUser.update({
					id: personalUser.id,
					account: {
						profile: {
							billing: {
								cybersourceCustomerId: response.cybersourceCustomerId,
							},
						},
					},
				});

				// create subscription
				const subscription =
					await context.applicationServices.Payment.createSubscription({
						userId: input.userId,
						planId: 'dummy-plan-id', // replace with actual plan ID when available
						cybersourceCustomerId: response.cybersourceCustomerId,
					});

				// update user with subscription id
				await context.applicationServices.User.PersonalUser.update({
					id: personalUser.id,
					account: {
						profile: {
							billing: {
								subscription: {
									subscriptionId: subscription.id,
									planCode: 'dummy-plan-code', // replace with actual plan code when available
									status: subscription.status,
									startDate: new Date(),
								},
							},
						},
					},
				});

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
