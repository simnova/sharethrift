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
		processPayment: async (_parent: unknown, { request }: { request: unknown }, context: GraphContext) => {
			console.log('------>Processing payment', request);
            // console.log(context)
            // return {
			// 		transactionId: "123",
			// 		status: 'paymentResponse.status',
			// 		success: true,
			// 		message: 'Payment processed successfully'
			// 	};
			try {
				// Get the payment service from context
				if (!context.paymentService) {
					throw new Error('Payment service not available');
				}
				const paymentService = context.paymentService;
		
				const paymentResponse = await paymentService.createPayment({
					amount: request.amount,
					currency: 'USD',
					source: request.source,
					description: request.description || 'Payment for account',
					metadata: {
						userId: request.userId
					}
				});

                console.log("------->paymentResponse", paymentResponse);

				return {
					transactionId: "123",
					status: 'paymentResponse.status',
					success: 'SUCCEEDED',
					message: 'Payment processed successfully'
				};
			} catch (error) {
				console.error('Payment processing error:', error);
				return {
					transactionId: '',
					status: 'FAILED',
					success: false,
					message: error instanceof Error ? error.message : 'Unknown error occurred'
				};
			}
		},

		refundPayment: (_parent: unknown, { request }: { request: unknown }, _context: GraphContext) => {
			console.log('Refunding payment', request);
            return {
				transactionId: '321',
				status: 'FAILED',
				success: false,
				message: 'Refund not implemented'
			};

		}
	},
};


export default personalUserResolvers;