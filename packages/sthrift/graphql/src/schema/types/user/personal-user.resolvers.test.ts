import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect, vi } from 'vitest';
import type { GraphContext } from '../../../init/context.ts';
import personalUserResolvers from './personal-user.resolvers.ts';
import type { Domain } from '@sthrift/domain';
// Define a type for the payment response based on the interface structure
interface ProcessPaymentResponse {
	id?: string;
	status?: string;
	errorInformation?: {
		reason?: string;
		message?: string;
	};
	orderInformation?: {
		amountDetails?: {
			totalAmount?: string;
			currency?: string;
		};
	};
}

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/personal-user.resolvers.feature'),
);

// Mock data factories
function createMockLocation(): Domain.Contexts.User.PersonalUser.PersonalUserAccountProfileLocationProps {
	return {
		address1: '123 Main St',
		address2: null,
		city: 'New York',
		state: 'NY',
		country: 'USA',
		zipCode: '10001',
	};
}

function createMockBilling(): Domain.Contexts.User.PersonalUser.PersonalUserAccountProfileBillingProps {
	return {
		subscriptionId: null,
		cybersourceCustomerId: null,
		paymentState: 'inactive',
		lastTransactionId: null,
		lastPaymentAmount: null,
	};
}

function createMockProfile(
	overrides: Partial<Domain.Contexts.User.PersonalUser.PersonalUserProfileProps> = {},
): Domain.Contexts.User.PersonalUser.PersonalUserProfileProps {
	return {
		firstName: 'John',
		lastName: 'Doe',
		aboutMe: 'Test user',
		location: createMockLocation(),
		billing: createMockBilling(),
		...overrides,
	};
}

function createMockAccount(
	overrides: Partial<Domain.Contexts.User.PersonalUser.PersonalUserAccountProps> = {},
): Domain.Contexts.User.PersonalUser.PersonalUserAccountProps {
	return {
		accountType: 'personal',
		email: 'test@example.com',
		username: 'testuser',
		profile: createMockProfile(),
		...overrides,
	};
}

function createMockPersonalUser(
	overrides: Partial<Domain.Contexts.User.PersonalUser.PersonalUserEntityReference> = {},
): Domain.Contexts.User.PersonalUser.PersonalUserEntityReference {
	const mockAccount = createMockAccount();
	const mockProfile = createMockProfile();
	const mockLocation = createMockLocation();
	const mockBilling = createMockBilling();

	return {
		id: 'user-123',
		userType: 'personal',
		isBlocked: false,
		hasCompletedOnboarding: true,
		account: {
			...mockAccount,
			profile: {
				...mockProfile,
				location: mockLocation,
				billing: mockBilling,
			},
		},
		schemaVersion: '1.0',
		createdAt: new Date(),
		updatedAt: new Date(),
		...overrides,
	};
}

function createMockProcessPaymentResponse(
	overrides: Partial<ProcessPaymentResponse> = {},
): ProcessPaymentResponse {
	return {
		id: 'payment-123',
		status: 'SUCCEEDED',
		orderInformation: {
			amountDetails: {
				totalAmount: '100.00',
				currency: 'USD',
			},
		},
		...overrides,
	};
}

function makeMockGraphContext(
	overrides: Partial<GraphContext> = {},
): GraphContext {
	return {
		applicationServices: {
			User: {
				PersonalUser: {
					queryById: vi.fn(),
					createIfNotExists: vi.fn(),
					getAllUsers: vi.fn(),
					update: vi.fn(),
				},
			},
			Payment: {
				processPayment: vi.fn(),
				refundPayment: vi.fn(),
			},
			verifiedUser: {
				verifiedJwt: {
					email: 'john.doe@example.com',
					given_name: 'John',
					family_name: 'Doe',
				},
			},
			...overrides.applicationServices,
		},
		...overrides,
	} as GraphContext;
}

test.for(feature, ({ Scenario, Background, BeforeEachScenario }) => {
	let context: GraphContext;
	let result: unknown;

	BeforeEachScenario(() => {
		context = makeMockGraphContext();
		vi.clearAllMocks();
	});

	Background(({ Given, And }) => {
		Given('a verified JWT user context exists', () => {
			// Already set up in BeforeEachScenario
		});
		And(
			'the GraphContext is initialized with User and Payment application services',
			() => {
				// Already set up in BeforeEachScenario
			},
		);
	});

	Scenario('Fetching a personal user by ID', ({ Given, When, Then, And }) => {
		Given('a valid user ID "user-123"', () => {
			// User ID will be passed in the resolver call
		});
		When('I execute the query "personalUserById"', async () => {
			const mockUser = createMockPersonalUser({ id: 'user-123' });
			vi.mocked(
				context.applicationServices.User.PersonalUser.queryById,
			).mockResolvedValue(mockUser);

			const resolver = personalUserResolvers.Query?.personalUserById;
			if (typeof resolver === 'function') {
				result = await resolver({}, { id: 'user-123' }, context, {} as never);
			}
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
				// Already set up in BeforeEachScenario
			});
			When(
				'I execute the query "currentPersonalUserAndCreateIfNotExists"',
				async () => {
					const mockUser = createMockPersonalUser({
						id: 'user-456',
						account: createMockAccount({
							email: 'john.doe@example.com',
							profile: createMockProfile({
								firstName: 'John',
								lastName: 'Doe',
							}),
						}),
					});
					vi.mocked(
						context.applicationServices.User.PersonalUser.createIfNotExists,
					).mockResolvedValue(mockUser);

					const resolver =
						personalUserResolvers.Query
							?.currentPersonalUserAndCreateIfNotExists;
					if (typeof resolver === 'function') {
						result = await resolver({}, {}, context, {} as never);
					}
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
					expect((result as { account: { email: string } }).account.email).toBe(
						'john.doe@example.com',
					);
				},
			);
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
				const mockUser = createMockPersonalUser({
					id: 'user-123',
					account: createMockAccount({
						profile: createMockProfile({ firstName: 'Alice' }),
					}),
				});
				vi.mocked(
					context.applicationServices.User.PersonalUser.update,
				).mockResolvedValue(mockUser);

				const resolver = personalUserResolvers.Mutation?.personalUserUpdate;
				if (typeof resolver === 'function') {
					result = await resolver(
						{},
						{
							input: {
								id: 'user-123',
								account: { profile: { firstName: 'Alice' } },
							},
						},
						context,
						{} as never,
					);
				}
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
			const mockUser = createMockPersonalUser({
				id: 'user-456',
				isBlocked: true,
			});
			vi.mocked(
				context.applicationServices.User.PersonalUser.update,
			).mockResolvedValue(mockUser);

			const resolver = personalUserResolvers.Mutation?.blockUser;
			if (typeof resolver === 'function') {
				result = await resolver(
					{},
					{ userId: 'user-456' },
					context,
					{} as never,
				);
			}
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
			const mockUser = createMockPersonalUser({
				id: 'user-456',
				isBlocked: false,
			});
			vi.mocked(
				context.applicationServices.User.PersonalUser.update,
			).mockResolvedValue(mockUser);

			const resolver = personalUserResolvers.Mutation?.unblockUser;
			if (typeof resolver === 'function') {
				result = await resolver(
					{},
					{ userId: 'user-456' },
					context,
					{} as never,
				);
			}
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
			Given(
				'a valid payment request with order and billing information',
				() => {
					const mockResponse = createMockProcessPaymentResponse({
						status: 'SUCCEEDED',
						id: 'txn-123',
					});
					vi.mocked(
						context.applicationServices.Payment.processPayment,
					).mockResolvedValue(mockResponse);
				},
			);
			When('I execute the mutation "processPayment"', async () => {
				const resolver = personalUserResolvers.Mutation?.processPayment;
				if (typeof resolver === 'function') {
					result = await resolver(
						{},
						{
							request: {
								userId: 'user-123',
								orderInformation: {
									billTo: {
										firstName: 'John',
										lastName: 'Doe',
										address1: '123 Main St',
										city: 'City',
										postalCode: '12345',
										country: 'US',
										state: 'State',
									},
									amountDetails: {
										totalAmount: 100,
										currency: 'USD',
									},
								},
								paymentInformation: {
									card: {
										number: '4111111111111111',
										expirationMonth: '12',
										expirationYear: '2025',
										securityCode: '123',
									},
								},
							},
						},
						context,
						{} as never,
					);
				}
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
					expect((result as { status: string }).status).toBe('SUCCEEDED');
					expect((result as { success: boolean }).success).toBe(true);
				},
			);
		},
	);

	Scenario(
		'Handling payment processing failure',
		({ Given, When, Then, And }) => {
			Given('a payment request that causes an error', () => {
				vi.mocked(
					context.applicationServices.Payment.processPayment,
				).mockRejectedValue(new Error('Payment failed'));
			});
			When('I execute the mutation "processPayment"', async () => {
				const resolver = personalUserResolvers.Mutation?.processPayment;
				if (typeof resolver === 'function') {
					result = await resolver(
						{},
						{
							request: {
								userId: 'user-123',
								orderInformation: {
									billTo: {
										firstName: 'John',
										lastName: 'Doe',
										address1: '123 Main St',
										postalCode: '12345',
										country: 'US',
										state: 'State',
										city: 'City',
									},
									amountDetails: {
										totalAmount: 100,
										currency: 'USD',
									},
								},
								paymentInformation: {
									card: {
										number: '4111111111111111',
										expirationMonth: '12',
										expirationYear: '2025',
										securityCode: '123',
									},
								},
							},
						},
						context,
						{} as never,
					);
				}
			});
			Then('it should return a PaymentResponse with status "FAILED"', () => {
				expect((result as { status: string }).status).toBe('FAILED');
				expect((result as { success: boolean }).success).toBe(false);
			});
			And('include errorInformation with reason "PROCESSING_ERROR"', () => {
				expect(
					(result as { errorInformation: { reason: string } }).errorInformation,
				).toBeDefined();
				expect(
					(result as { errorInformation: { reason: string } }).errorInformation
						.reason,
				).toBe('PROCESSING_ERROR');
			});
		},
	);

	Scenario('Refunding a successful payment', ({ Given, When, Then, And }) => {
		Given(
			'a valid refund request with transactionId "txn-789" and amount "100.00"',
			() => {
				vi.mocked(
					context.applicationServices.Payment.refundPayment,
				).mockResolvedValue({
					id: 'txn-789',
					status: 'REFUNDED',
				});
			},
		);
		When('I execute the mutation "refundPayment"', async () => {
			const resolver = personalUserResolvers.Mutation?.refundPayment;
			if (typeof resolver === 'function') {
				result = await resolver(
					{},
					{
						request: {
							userId: 'user-123',
							transactionId: 'txn-789',
							amount: 100,
							orderInformation: {
								amountDetails: {
									totalAmount: 100.0,
									currency: 'USD',
								},
							},
						},
					},
					context,
					{} as never,
				);
			}
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
				expect((result as { status: string }).status).toBe('REFUNDED');
				expect((result as { success: boolean }).success).toBe(true);
			},
		);
	});

	Scenario('Handling refund failure', ({ Given, When, Then, And }) => {
		Given('a refund request that causes an error', () => {
			vi.mocked(
				context.applicationServices.Payment.refundPayment,
			).mockRejectedValue(new Error('Refund failed'));
		});
		When('I execute the mutation "refundPayment"', async () => {
			const resolver = personalUserResolvers.Mutation?.refundPayment;
			if (typeof resolver === 'function') {
				result = await resolver(
					{},
					{
						request: {
							userId: 'user-123',
							transactionId: 'txn-789',
							amount: 100,
							orderInformation: {
								amountDetails: {
									totalAmount: 100,
									currency: 'USD',
								},
							},
						},
					},
					context,
					{} as never,
				);
			}
		});
		Then('it should return a RefundResponse with status "FAILED"', () => {
			expect((result as { status: string }).status).toBe('FAILED');
			expect((result as { success: boolean }).success).toBe(false);
		});
		And('include errorInformation with reason "PROCESSING_ERROR"', () => {
			expect(
				(result as { errorInformation: { reason: string } }).errorInformation,
			).toBeDefined();
			expect(
				(result as { errorInformation: { reason: string } }).errorInformation
					.reason,
			).toBe('PROCESSING_ERROR');
		});
	});
});
