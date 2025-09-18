import type { GraphContext } from '../../init/context.ts';
import type { GraphQLResolveInfo } from 'graphql';
import type { PersonalUserUpdateInput } from '../builder/generated.ts';

const personalUserResolvers = {
	Query: {
		personalUserById: (
			_parent: unknown,
			args: { id: string },
			_context: GraphContext,
			_info: GraphQLResolveInfo,
		) => {
			console.log('personalUser resolver called with id:', args.id);
			// return (await context.applicationServices.User.PersonalUser.queryById({
			// 	id: args.id,
			// 	fields: getRequestedFieldPaths(info),
			// })) as PersonalUser;
			// For now, return mock data until persistence layer is fixed
			return {
				id: args.id, // Add the id field
				userType: 'personal',
				isBlocked: false,
				account: {
					accountType: 'personal',
					email: 'patrick.g@example.com',
					username: 'patrick_g',
					profile: {
						firstName: 'Patrick',
						lastName: 'Garcia',
						location: {
							address1: '123 Main St',
							city: 'Philadelphia',
							state: 'PA',
							country: 'United States',
							zipCode: '19101',
						},
					},
				},
				schemaVersion: '1.0.0',
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			};
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
			return await context.applicationServices.User.PersonalUser.update({
				personalUserUpdateInput: {
					id: args.input.id,
					account: {
						profile: {
							firstName: args.input.account?.profile?.firstName as string,
							lastName: args.input.account?.profile?.lastName as string,
						},
					},
				},
			});
		},
		processPayment: async (
			_parent: unknown,
			{
				request,
			}: {
				request: {
					userId: string;
					orderInformation: {
						amountDetails: {
							totalAmount: number;
							currency: string;
						};
						billTo: {
							firstName: string;
							lastName: string;
							address1: string;
							address2?: string;
							city: string;
							state: string;
							postalCode: string;
							country: string;
							phoneNumber?: string;
							email?: string;
						};
					};
					paymentInformation: {
						card: {
							number: string;
							expirationMonth: string;
							expirationYear: string;
							securityCode: string;
						};
					};
				};
			},
			context: GraphContext,
		) => {
			console.log('Processing payment', request);
			try {
				const response =
					await context.applicationServices.Payment.processPayment(request);
				return {
					...response,
					success: response.status === 'SUCCEEDED',
					message:
						response.status === 'SUCCEEDED'
							? 'Payment processed successfully'
							: undefined,
				};
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
		refundPayment: async (
			_parent: unknown,
			{
				request,
			}: {
				request: {
					userId: string;
					transactionId: string;
					amount?: number;
					orderInformation: {
						amountDetails: {
							totalAmount: number;
							currency: string;
						};
					};
				};
			},
			context: GraphContext,
		) => {
			console.log('Refunding payment', request);
			try {
				const response =
					await context.applicationServices.Payment.refundPayment(request);
				return {
					...response,
					success: response.status === 'REFUNDED',
					message:
						response.status === 'REFUNDED'
							? 'Refund processed successfully'
							: undefined,
				};
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
				};
			}
		},
	},
};

export default personalUserResolvers;
