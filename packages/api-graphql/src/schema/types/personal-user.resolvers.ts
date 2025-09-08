import type { GraphContext } from '../../init/context.ts';
import type { GraphQLResolveInfo } from 'graphql';

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
				userType: 'personal',
				isBlocked: false,
				account: {
					accountType: 'personal',
					email: 'mock@example.com',
					username: 'mockuser',
					profile: {
						firstName: 'Mock',
						lastName: 'User',
						location: {
							address1: '123 Mock St',
							city: 'Mock City',
							state: 'MockState',
							country: 'MockCountry',
							zipCode: '12345',
						},
					},
				},
				schemaVersion: '1.0.0',
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			};
		},
	},

	Mutation: {
		processPayment: async (_parent: unknown, { request }: { request: {
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
		} }, context: GraphContext) => {
			console.log('Processing payment', request);
			try {
				const response = await context.applicationServices.Payment.processPayment(request);
				return {
					...response,
					success: response.status === 'SUCCEEDED',
					message: response.status === 'SUCCEEDED' ? 'Payment processed successfully' : undefined
				};
			} catch (error) {
				console.error('Payment processing error:', error);
				return {
					status: 'FAILED',
					success: false,
					message: error instanceof Error ? error.message : 'Unknown error occurred',
					errorInformation: {
						reason: 'PROCESSING_ERROR',
						message: error instanceof Error ? error.message : 'Unknown error occurred'
					}
				};
			}
		},

		refundPayment: async (_parent: unknown, { request }: { request: {
			userId: string;
			transactionId: string;
			amount?: number;
			orderInformation: {
				amountDetails: {
					totalAmount: number;
					currency: string;
				};
			};
		} }, context: GraphContext) => {
			console.log('Refunding payment', request);
			try {
				const response = await context.applicationServices.Payment.refundPayment(request);
				return {
					...response,
					success: response.status === 'REFUNDED',
					message: response.status === 'REFUNDED' ? 'Refund processed successfully' : undefined
				};
			} catch (error) {
				console.error('Refund processing error:', error);
				return {
					status: 'FAILED',
					success: false,
					message: error instanceof Error ? error.message : 'Unknown error occurred',
					errorInformation: {
						reason: 'PROCESSING_ERROR',
						message: error instanceof Error ? error.message : 'Unknown error occurred'
					}
				};
			}
		}
	}
};

export default personalUserResolvers;