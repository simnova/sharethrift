import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect, vi } from 'vitest';
import type { GraphContext } from '../../../init/context.ts';
import type { GraphQLResolveInfo } from 'graphql';
import personalUserResolvers from './personal-user.resolvers.ts';

// Type definitions for resolver functions
type PersonalUserByIdResolver = (
	parent: unknown,
	args: { id: string },
	context: GraphContext,
	info: GraphQLResolveInfo,
) => Promise<unknown>;

type CurrentPersonalUserAndCreateIfNotExistsResolver = (
	parent: unknown,
	args: unknown,
	context: GraphContext,
	info: GraphQLResolveInfo,
) => Promise<unknown>;

type AllUsersResolver = (
	parent: unknown,
	args: { page: number; pageSize: number },
	context: GraphContext,
	info: GraphQLResolveInfo,
) => Promise<unknown>;

type PersonalUserUpdateResolver = (
	parent: unknown,
	args: { input: { id: string; [key: string]: unknown } },
	context: GraphContext,
	info: GraphQLResolveInfo,
) => Promise<unknown>;

type BlockUserResolver = (
	parent: unknown,
	args: { userId: string },
	context: GraphContext,
	info: GraphQLResolveInfo,
) => Promise<unknown>;

type UnblockUserResolver = (
	parent: unknown,
	args: { userId: string },
	context: GraphContext,
	info: GraphQLResolveInfo,
) => Promise<unknown>;

type ProcessPaymentResolver = (
	parent: unknown,
	args: { request: { [key: string]: unknown } },
	context: GraphContext,
	info?: GraphQLResolveInfo,
) => Promise<unknown>;

type RefundPaymentResolver = (
	parent: unknown,
	args: { request: { transactionId: string; amount: number } },
	context: GraphContext,
	info?: GraphQLResolveInfo,
) => Promise<unknown>;

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/personal-user.resolvers.feature'),
);

function makeGraphContext(overrides: Partial<GraphContext> = {}): GraphContext {
	return {
		applicationServices: {
			User: {
				PersonalUser: {
					queryById: vi.fn(async ({ id }) => ({
						id,
						account: { email: 'test@example.com' },
					})),
					createIfNotExists: vi.fn(async ({ email, firstName, lastName }) => ({
						id: 'user-1',
						account: {
							email,
							profile: { firstName, lastName },
						},
					})),
					getAllUsers: vi.fn(async (args) => ({
						items: [],
						total: 0,
						page: args.page,
						pageSize: args.pageSize,
					})),
					update: vi.fn(async (input) => ({
						id: input.id,
						...input,
					})),
				},
			},
			Payment: {
				processPayment: vi.fn(async () => ({
					status: 'SUCCEEDED',
					transactionId: 'txn-123',
				})),
				refundPayment: vi.fn(async () => ({
					status: 'REFUNDED',
					transactionId: 'txn-123',
				})),
			},
			verifiedUser: {
				verifiedJwt: {
					email: 'john.doe@example.com',
					given_name: 'John',
					family_name: 'Doe',
				},
			},
		},
		...overrides,
	} as unknown as GraphContext;
}

test.for(feature, ({ Scenario, Background, BeforeEachScenario }) => {
	let context: GraphContext;
	let result: unknown;

	BeforeEachScenario(() => {
		context = makeGraphContext();
		result = undefined;
	});

	Background(({ Given, And }) => {
		Given('a verified JWT user context exists', () => {
			context = makeGraphContext();
		});
		And(
			'the GraphContext is initialized with User and Payment application services',
			() => {
				// Already set up in makeGraphContext
			},
		);
	});

	Scenario('Fetching a personal user by ID', ({ Given, When, Then, And }) => {
		Given('a valid user ID "user-123"', () => {
			// User ID will be passed in the resolver call
		});
		When('I execute the query "personalUserById"', async () => {
			result = await (personalUserResolvers.Query?.personalUserById as PersonalUserByIdResolver)(
				{},
				{ id: 'user-123' },
				context,
				{} as GraphQLResolveInfo,
			);
		});
		Then(
			'the resolver should call "User.PersonalUser.queryById" with id "user-123"',
			() => {
				expect(
					context.applicationServices.User.PersonalUser.queryById,
				).toHaveBeenCalledWith({ id: 'user-123' });
			},
		);
		And('it should return the corresponding PersonalUser object', () => {
			expect(result).toBeDefined();
			expect((result as { id: string }).id).toBe('user-123');
		});
	});

	Scenario(
		'Creating or fetching the current personal user',
		({ Given, When, Then, And }) => {
			Given('a verified user with email "john.doe@example.com"', () => {
				// Already set up in makeGraphContext
			});
			When(
				'I execute the query "currentPersonalUserAndCreateIfNotExists"',
				async () => {
					result =
						await (personalUserResolvers.Query?.currentPersonalUserAndCreateIfNotExists as CurrentPersonalUserAndCreateIfNotExistsResolver)(
							{},
							{},
							context,
							{} as GraphQLResolveInfo,
						);
				},
			);
			Then(
				'the resolver should call "User.PersonalUser.createIfNotExists"',
				() => {
					expect(
						context.applicationServices.User.PersonalUser.createIfNotExists,
					).toHaveBeenCalledWith({
						email: 'john.doe@example.com',
						firstName: 'John',
						lastName: 'Doe',
					});
				},
			);
			And(
				'it should return the existing or newly created PersonalUser entity',
				() => {
					expect(result).toBeDefined();
					expect((result as { account: { email: string } }).account.email).toBe('john.doe@example.com');
				},
			);
		},
	);

	Scenario(
		'Fetching all users with filters and pagination',
		({ Given, When, Then, And }) => {
			Given('the admin requests all users with page "1" and pageSize "20"', () => {
				// Args will be passed in the resolver call
			});
			When('I execute the query "allUsers"', async () => {
				result = await (personalUserResolvers.Query?.allUsers as AllUsersResolver)(
					{},
					{ page: 1, pageSize: 20 },
					context,
					{} as GraphQLResolveInfo,
				);
			});
			Then('the resolver should call "User.PersonalUser.getAllUsers"', () => {
				expect(
					context.applicationServices.User.PersonalUser.getAllUsers,
				).toHaveBeenCalledWith({
					page: 1,
					pageSize: 20,
					searchText: undefined,
					statusFilters: undefined,
					sorter: undefined,
				});
			});
			And('return a paginated list of users matching the filters', () => {
				expect(result).toBeDefined();
				expect(result).toHaveProperty('items');
				expect(result).toHaveProperty('total');
				expect((result as { page: number }).page).toBe(1);
				expect((result as { pageSize: number }).pageSize).toBe(20);
			});
		},
	);

	Scenario(
		'Updating personal user information',
		({ Given, When, Then, And }) => {
			Given(
				'a valid user update input with id "user-123" and new name "Alice"',
				() => {
					// Input will be passed in the resolver call
				},
			);
			When('I execute the mutation "personalUserUpdate"', async () => {
				result = await (personalUserResolvers.Mutation?.personalUserUpdate as PersonalUserUpdateResolver)(
					{},
					{
						input: {
							id: 'user-123',
							account: { profile: { firstName: 'Alice' } },
						},
					},
					context,
					{} as GraphQLResolveInfo,
				);
			});
			Then('the resolver should call "User.PersonalUser.update"', () => {
				expect(
					context.applicationServices.User.PersonalUser.update,
				).toHaveBeenCalled();
			});
			And('it should update the record and return the updated user', () => {
				expect(result).toBeDefined();
				expect((result as { id: string }).id).toBe('user-123');
			});
		},
	);

	Scenario('Blocking a user', ({ Given, When, Then, And }) => {
		Given('a valid userId "user-456"', () => {
			// User ID will be passed in the resolver call
		});
		When('I execute the mutation "blockUser"', async () => {
			result = await (personalUserResolvers.Mutation?.blockUser as BlockUserResolver)(
				{},
				{ userId: 'user-456' },
				context,
				{} as GraphQLResolveInfo,
			);
		});
		Then(
			'the resolver should call "User.PersonalUser.update" with "isBlocked" set to true',
			() => {
				expect(
					context.applicationServices.User.PersonalUser.update,
				).toHaveBeenCalledWith({
					id: 'user-456',
					isBlocked: true,
				});
			},
		);
		And('the user should be marked as blocked', () => {
			expect(result).toBeDefined();
			expect((result as { isBlocked: boolean }).isBlocked).toBe(true);
		});
	});

	Scenario('Unblocking a user', ({ Given, When, Then, And }) => {
		Given('a valid userId "user-456"', () => {
			// User ID will be passed in the resolver call
		});
		When('I execute the mutation "unblockUser"', async () => {
			result = await (personalUserResolvers.Mutation?.unblockUser as UnblockUserResolver)(
				{},
				{ userId: 'user-456' },
				context,
				{} as GraphQLResolveInfo,
			);
		});
		Then(
			'the resolver should call "User.PersonalUser.update" with "isBlocked" set to false',
			() => {
				expect(
					context.applicationServices.User.PersonalUser.update,
				).toHaveBeenCalledWith({
					id: 'user-456',
					isBlocked: false,
				});
			},
		);
		And('the user should be unblocked successfully', () => {
			expect(result).toBeDefined();
			expect((result as { isBlocked: boolean }).isBlocked).toBe(false);
		});
	});

	Scenario(
		'Processing a payment successfully',
		({ Given, When, Then, And }) => {
			Given('a valid payment request with order and billing information', () => {
				context.applicationServices.Payment.processPayment = vi.fn(
					async () => ({
						status: 'SUCCEEDED',
						transactionId: 'txn-123',
					}),
				);
			});
			When('I execute the mutation "processPayment"', async () => {
				result = await (personalUserResolvers.Mutation?.processPayment as ProcessPaymentResolver)(
					{},
					{
						request: {
							orderInformation: {
								billTo: {
									firstName: 'John',
									lastName: 'Doe',
									address1: '123 Main St',
									locality: 'City',
									administrativeArea: 'State',
									postalCode: '12345',
									country: 'US',
								},
								amountDetails: {
									totalAmount: '100.00',
									currency: 'USD',
								},
							},
						},
					},
					context,
					{} as GraphQLResolveInfo,
				);
			});
			Then(
				'it should call "Payment.processPayment" with sanitized fields',
				() => {
					expect(
						context.applicationServices.Payment.processPayment,
					).toHaveBeenCalled();
				},
			);
			And(
				'return a PaymentResponse with status "SUCCEEDED" and success true',
				() => {
					expect(result).toBeDefined();
					expect((result as { status: string; success: boolean }).status).toBe('SUCCEEDED');
					expect((result as { status: string; success: boolean }).success).toBe(true);
				},
			);
		},
	);

	Scenario(
		'Handling payment processing failure',
		({ Given, When, Then, And }) => {
			Given('a payment request that causes an error', () => {
				context.applicationServices.Payment.processPayment = vi.fn(
					() => {
						throw new Error('Payment failed');
					},
				);
			});
			When('I execute the mutation "processPayment"', async () => {
				result = await (personalUserResolvers.Mutation?.processPayment as ProcessPaymentResolver)(
					{},
					{
						request: {
							orderInformation: {
								billTo: {
									firstName: 'John',
									lastName: 'Doe',
									address1: '123 Main St',
									locality: 'City',
									administrativeArea: 'State',
									postalCode: '12345',
									country: 'US',
								},
								amountDetails: {
									totalAmount: '100.00',
									currency: 'USD',
								},
							},
						},
					},
					context,
					{} as GraphQLResolveInfo,
				);
			});
			Then('it should return a PaymentResponse with status "FAILED"', () => {
				expect((result as { status: string; success: boolean }).status).toBe('FAILED');
				expect((result as { status: string; success: boolean }).success).toBe(false);
			});
			And(
				'include errorInformation with reason "PROCESSING_ERROR"',
				() => {
					expect((result as { errorInformation: { reason: string } }).errorInformation).toBeDefined();
					expect((result as { errorInformation: { reason: string } }).errorInformation.reason).toBe(
						'PROCESSING_ERROR',
					);
				},
			);
		},
	);

	Scenario(
		'Refunding a successful payment',
		({ Given, When, Then, And }) => {
			Given(
				'a valid refund request with transactionId "txn-789" and amount "100.00"',
				() => {
					context.applicationServices.Payment.refundPayment = vi.fn(
						async () => ({
							status: 'REFUNDED',
							transactionId: 'txn-789',
						}),
					);
				},
			);
			When('I execute the mutation "refundPayment"', async () => {
				result = await (personalUserResolvers.Mutation?.refundPayment as RefundPaymentResolver)(
					{},
					{
						request: {
							transactionId: 'txn-789',
							amount: 100.0,
						},
					},
					context,
					{} as GraphQLResolveInfo,
				);
			});
			Then('it should call "Payment.refundPayment"', () => {
				expect(
					context.applicationServices.Payment.refundPayment,
				).toHaveBeenCalled();
			});
			And(
				'return a RefundResponse with status "REFUNDED" and success true',
				() => {
					expect(result).toBeDefined();
					expect((result as { status: string; success: boolean }).status).toBe('REFUNDED');
					expect((result as { status: string; success: boolean }).success).toBe(true);
				},
			);
		},
	);

	Scenario('Handling refund failure', ({ Given, When, Then, And }) => {
		Given('a refund request that causes an error', () => {
			context.applicationServices.Payment.refundPayment = vi.fn(() => {
				throw new Error('Refund failed');
			});
		});
		When('I execute the mutation "refundPayment"', async () => {
			result = await (personalUserResolvers.Mutation?.refundPayment as RefundPaymentResolver)(
				{},
				{
					request: {
						transactionId: 'txn-789',
						amount: 100.0,
					},
				},
				context,
				{} as GraphQLResolveInfo,
			);
		});
		Then('it should return a RefundResponse with status "FAILED"', () => {
			expect((result as { status: string; success: boolean }).status).toBe('FAILED');
			expect((result as { status: string; success: boolean }).success).toBe(false);
		});
		And('include errorInformation with reason "PROCESSING_ERROR"', () => {
			expect((result as { errorInformation: { reason: string } }).errorInformation).toBeDefined();
			expect((result as { errorInformation: { reason: string } }).errorInformation.reason).toBe('PROCESSING_ERROR');
		});
	});
});
