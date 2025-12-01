import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import type { Domain } from '@sthrift/domain';
import type { PaymentResponse } from '@sthrift/application-services';
import { expect, vi } from 'vitest';
import type { GraphContext } from '../../../init/context.ts';
import personalUserResolvers from './personal-user.resolvers.ts';

// Define a type for the payment response based on the interface structure

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

function createMockBilling(): Domain.Contexts.User.PersonalUser.PersonalUserAccountProfileBillingEntityReference {
	return {
		cybersourceCustomerId: 'cust-12345',
		subscription: {
			subscriptionId: 'sub-67890',
			planCode: 'verified-personal',
			status: 'ACTIVE',
			startDate: new Date('2024-01-01T00:00:00Z'),
		},
		transactions: [
			{
				id: '1',
				transactionId: 'txn_123',
				amount: 1000,
				referenceId: 'ref_123',
				status: 'completed',
				completedAt: new Date('2020-01-01T00:00:00Z'),
				errorMessage: null,
			},
		],
	};
}

function createMockProfile(
	overrides: Partial<Domain.Contexts.User.PersonalUser.PersonalUserProfileEntityReference> = {},
): Domain.Contexts.User.PersonalUser.PersonalUserProfileEntityReference {
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
	overrides: Partial<Domain.Contexts.User.PersonalUser.PersonalUserAccountEntityReference> = {},
): Domain.Contexts.User.PersonalUser.PersonalUserAccountEntityReference {
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
	overrides: Partial<PaymentResponse> = {},
) {
	return {
		id: 'payment-123',
		status: 'SUCCEEDED',
		success: true,
		message: 'Payment processed successfully',
		cybersourceCustomerId: 'cust-12345',
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
					queryByEmail: vi.fn(),
					createIfNotExists: vi.fn(),
					getAllUsers: vi.fn(),
					update: vi.fn(),
					processPayment: vi.fn(),
				},
				AdminUser: {
					queryByEmail: vi.fn(),
				},
			},
			AccountPlan: {
				AccountPlan: {
					queryByName: vi.fn(),
				},
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
				expect(
					(result as { personalUser: { id: string } }).personalUser.id,
				).toBe('user-123');
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
					// Mock payment processing
					const mockPaymentResponse = createMockProcessPaymentResponse({
						status: 'SUCCEEDED',
						id: 'txn-123',
						cybersourceCustomerId: 'cust-12345',
					});
					vi.mocked(
						context.applicationServices.User.PersonalUser.processPayment,
					).mockResolvedValue(mockPaymentResponse);
				},
			);
			When('I execute the mutation "processPayment"', async () => {
				const resolver = personalUserResolvers.Mutation?.processPayment;
				if (typeof resolver === 'function') {
					result = await resolver(
						{},
						{
							input: {
								userId: 'user-123',
								currency: 'USD',
								paymentAmount: 100.0,
								paymentInstrument: {
									billingAddressLine1: '123 Main St',
									billingCity: 'City',
									billingState: 'State',
									billingCountry: 'US',
									billingPostalCode: '12345',
									billingEmail: 'john.doe@example.com',
									billingFirstName: 'John',
									billingLastName: 'Doe',
									paymentToken: 'token-abc-123',
									billingAddressLine2: null,
									billingPhone: null,
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
						context.applicationServices.User.PersonalUser.processPayment,
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
				// Mock payment processing error
				vi.mocked(
					context.applicationServices.User.PersonalUser.processPayment,
				).mockRejectedValue(new Error('Payment failed'));
			});
			When('I execute the mutation "processPayment"', async () => {
				const resolver = personalUserResolvers.Mutation?.processPayment;
				if (typeof resolver === 'function') {
					result = await resolver(
						{},
						{
							input: {
								userId: 'user-123',
								currency: 'USD',
								paymentAmount: 100.0,
								paymentInstrument: {
									billingAddressLine1: '123 Main St',
									billingCity: 'City',
									billingState: 'State',
									billingCountry: 'US',
									billingPostalCode: '12345',
									billingEmail: 'john.doe@example.com',
									billingFirstName: 'John',
									billingLastName: 'Doe',
									paymentToken: 'token-abc-123',
									billingAddressLine2: null,
									billingPhone: null,
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

  // TBD: Re-enable once refundPayment is implemented
	// Scenario('Refunding a successful payment', ({ Given, When, Then, And }) => {
	// 	Given(
	// 		'a valid refund request with transactionId "txn-789" and amount "100.00"',
	// 		() => {
	// 			vi.mocked(
	// 				context.applicationServices.User.PersonalUser.refundPayment,
	// 			).mockResolvedValue({
	// 				id: 'txn-789',
	// 				status: 'REFUNDED',
	// 			});
	// 		},
	// 	);
	// 	When('I execute the mutation "refundPayment"', async () => {
	// 		const resolver = personalUserResolvers.Mutation?.refundPayment;
	// 		if (typeof resolver === 'function') {
	// 			result = await resolver(
	// 				{},
	// 				{
	// 					request: {
	// 						userId: 'user-123',
	// 						transactionId: 'txn-789',
	// 						amount: 100,
	// 						orderInformation: {
	// 							amountDetails: {
	// 								totalAmount: 100.0,
	// 								currency: 'USD',
	// 							},
	// 						},
	// 					},
	// 				},
	// 				context,
	// 				{} as never,
	// 			);
	// 		}
	// 	});
	// 	Then('it should call "Payment.refundPayment"', () => {
	// 		expect(
	// 			context.applicationServices.Payment.refundPayment,
	// 		).toHaveBeenCalled();
	// 	});
	// 	And(
	// 		'return a RefundResponse with status "REFUNDED" and success true',
	// 		() => {
	// 			expect(result).toBeDefined();
	// 			expect((result as { status: string }).status).toBe('REFUNDED');
	// 			expect((result as { success: boolean }).success).toBe(true);
	// 		},
	// 	);
	// });

	// TBD: Re-enable once refundPayment is implemented
	// Scenario('Handling refund failure', ({ Given, When, Then, And }) => {
	// 	Given('a refund request that causes an error', () => {
	// 		vi.mocked(
	// 			context.applicationServices.Payment.refundPayment,
	// 		).mockRejectedValue(new Error('Refund failed'));
	// 	});
	// 	When('I execute the mutation "refundPayment"', async () => {
	// 		const resolver = personalUserResolvers.Mutation?.refundPayment;
	// 		if (typeof resolver === 'function') {
	// 			result = await resolver(
	// 				{},
	// 				{
	// 					request: {
	// 						userId: 'user-123',
	// 						transactionId: 'txn-789',
	// 						amount: 100,
	// 						orderInformation: {
	// 							amountDetails: {
	// 								totalAmount: 100,
	// 								currency: 'USD',
	// 							},
	// 						},
	// 					},
	// 				},
	// 				context,
	// 				{} as never,
	// 			);
	// 		}
	// 	});
	// 	Then('it should return a RefundResponse with status "FAILED"', () => {
	// 		expect((result as { status: string }).status).toBe('FAILED');
	// 		expect((result as { success: boolean }).success).toBe(false);
	// 	});
	// 	And('include errorInformation with reason "PROCESSING_ERROR"', () => {
	// 		expect(
	// 			(result as { errorInformation: { reason: string } }).errorInformation,
	// 		).toBeDefined();
	// 		expect(
	// 			(result as { errorInformation: { reason: string } }).errorInformation
	// 				.reason,
	// 		).toBe('PROCESSING_ERROR');
	// 	});
	// });

	Scenario(
		'Fetching all users with admin permission',
		({ Given, When, Then, And }) => {
			Given('a verified admin user with "canViewAllUsers" permission', () => {
				const mockAdminUser = {
					id: 'admin-123',
					userType: 'admin-user',
					role: {
						permissions: {
							userPermissions: {
								canViewAllUsers: true,
							},
						},
					},
				};
				// Mock AdminUser.queryByEmail to return admin user
				vi.mocked(
					context.applicationServices.User.AdminUser.queryByEmail,
				).mockResolvedValue(mockAdminUser as never);
			});
			And('pagination parameters page 1 and pageSize 10', () => {
				// Parameters will be passed in the resolver call
			});
			When('I execute the query "allUsers"', async () => {
			vi.mocked(
				context.applicationServices.User.PersonalUser.getAllUsers,
			).mockResolvedValue({
				items: [createMockPersonalUser()],
				total: 1,
				page: 1,
				pageSize: 10,
			});				const resolver = personalUserResolvers.Query?.allUsers;
				if (typeof resolver === 'function') {
					result = await resolver(
						{},
						{ page: 1, pageSize: 10 },
						context,
						{} as never,
					);
				}
			});
			Then(
				'it should call "User.PersonalUser.getAllUsers" with pagination parameters',
				() => {
					expect(
						context.applicationServices.User.PersonalUser.getAllUsers,
					).toHaveBeenCalledWith({
						page: 1,
						pageSize: 10,
						searchText: undefined,
						statusFilters: undefined,
						sorter: undefined,
					});
			},
		);
		And('return a list of all personal users', () => {
			expect(result).toBeDefined();
			expect((result as { items: unknown[] }).items).toHaveLength(1);
		});
	},
);	Scenario(
		'Fetching all users without authentication',
		({ Given, When, Then }) => {
			Given('no authenticated user context', () => {
				(context.applicationServices as { verifiedUser: unknown }).verifiedUser = undefined;
			});
			When('I execute the query "allUsers"', async () => {
				const resolver = personalUserResolvers.Query?.allUsers;
				if (typeof resolver === 'function') {
					try {
						await resolver({}, { page: 1, pageSize: 10 }, context, {} as never);
					} catch (error) {
						result = error;
					}
				}
			});
			Then(
				'it should throw an error "Unauthorized: Authentication required"',
				() => {
					expect(result).toBeInstanceOf(Error);
					expect((result as Error).message).toBe(
						'Unauthorized: Authentication required',
					);
				},
			);
		},
	);

	Scenario(
		'Fetching all users without admin permission',
		({ Given, When, Then }) => {
			Given('a verified personal user without admin role', () => {
				const mockPersonalUser = {
					id: 'user-123',
					userType: 'personal-user',
				};
				// Mock AdminUser.queryByEmail to return null (not an admin)
				vi.mocked(
					context.applicationServices.User.AdminUser.queryByEmail,
				).mockResolvedValue(null as never);
				// Mock PersonalUser.queryByEmail to return personal user
				vi.mocked(
					context.applicationServices.User.PersonalUser.queryByEmail,
				).mockResolvedValue(mockPersonalUser as never);
			});
			When('I execute the query "allUsers"', async () => {
				const resolver = personalUserResolvers.Query?.allUsers;
				if (typeof resolver === 'function') {
					try {
						await resolver({}, { page: 1, pageSize: 10 }, context, {} as never);
					} catch (error) {
						result = error;
					}
				}
			});
			Then(
				'it should throw an error "Forbidden: Only admins with canViewAllUsers permission can access this query"',
				() => {
					expect(result).toBeInstanceOf(Error);
					expect((result as Error).message).toBe(
						'Forbidden: Only admins with canViewAllUsers permission can access this query',
					);
				},
			);
		},
	);

	Scenario(
		'Fetching all users as admin without canViewAllUsers permission',
		({ Given, When, Then }) => {
			Given('a verified admin user without "canViewAllUsers" permission', () => {
				const mockAdminUser = {
					id: 'admin-123',
					userType: 'admin-user',
					role: {
						permissions: {
							userPermissions: {
								canViewAllUsers: false,
							},
						},
					},
				};
				// Mock AdminUser.queryByEmail to return admin without permission
				vi.mocked(
					context.applicationServices.User.AdminUser.queryByEmail,
				).mockResolvedValue(mockAdminUser as never);
			});
			When('I execute the query "allUsers"', async () => {
				const resolver = personalUserResolvers.Query?.allUsers;
				if (typeof resolver === 'function') {
					try {
						await resolver({}, { page: 1, pageSize: 10 }, context, {} as never);
					} catch (error) {
						result = error;
					}
				}
			});
			Then(
				'it should throw an error "Forbidden: Only admins with canViewAllUsers permission can access this query"',
				() => {
					expect(result).toBeInstanceOf(Error);
					expect((result as Error).message).toBe(
						'Forbidden: Only admins with canViewAllUsers permission can access this query',
					);
				},
			);
		},
	);

	Scenario(
		'Updating personal user without authentication',
		({ Given, When, Then }) => {
			Given('no authenticated user context', () => {
				(context.applicationServices as { verifiedUser: unknown }).verifiedUser = undefined;
			});
			When('I execute the mutation "personalUserUpdate"', async () => {
				const resolver = personalUserResolvers.Mutation?.personalUserUpdate;
				if (typeof resolver === 'function') {
					try {
						await resolver(
							{},
							{ input: { id: 'user-123' } },
							context,
							{} as never,
						);
					} catch (error) {
						result = error;
					}
				}
			});
			Then('it should throw an error "Unauthorized"', () => {
				expect(result).toBeInstanceOf(Error);
				expect((result as Error).message).toBe('Unauthorized');
			});
		},
	);

	Scenario('Blocking user without authentication', ({ Given, When, Then }) => {
		Given('no authenticated user context', () => {
			(context.applicationServices as { verifiedUser: unknown }).verifiedUser = undefined;
		});
		When('I execute the mutation "blockUser"', async () => {
			const resolver = personalUserResolvers.Mutation?.blockUser;
			if (typeof resolver === 'function') {
				try {
					await resolver({}, { userId: 'user-456' }, context, {} as never);
				} catch (error) {
					result = error;
				}
			}
		});
		Then('it should throw an error "Unauthorized"', () => {
			expect(result).toBeInstanceOf(Error);
			expect((result as Error).message).toBe('Unauthorized');
		});
	});

	Scenario(
		'Unblocking user without authentication',
		({ Given, When, Then }) => {
			Given('no authenticated user context', () => {
				(context.applicationServices as { verifiedUser: unknown }).verifiedUser = undefined;
			});
			When('I execute the mutation "unblockUser"', async () => {
				const resolver = personalUserResolvers.Mutation?.unblockUser;
				if (typeof resolver === 'function') {
					try {
						await resolver({}, { userId: 'user-456' }, context, {} as never);
					} catch (error) {
						result = error;
					}
				}
			});
			Then('it should throw an error "Unauthorized"', () => {
				expect(result).toBeInstanceOf(Error);
				expect((result as Error).message).toBe('Unauthorized');
			});
		},
	);

	Scenario(
		'Attempting to create personal user when logged in as admin',
		({ Given, When, Then }) => {
			Given('a verified admin user with email "admin@example.com"', () => {
				const mockAdminUser = {
					id: 'admin-123',
					userType: 'admin-user',
					account: {
						email: 'admin@example.com',
					},
				};
				// Mock AdminUser.queryByEmail to return admin user
				vi.mocked(
					context.applicationServices.User.AdminUser.queryByEmail,
				).mockResolvedValue(mockAdminUser as never);
				(context.applicationServices as { verifiedUser: unknown }).verifiedUser = {
					verifiedJwt: {
						email: 'admin@example.com',
						given_name: 'Admin',
						family_name: 'User',
					},
				};
			});
			When(
				'I execute the query "currentPersonalUserAndCreateIfNotExists"',
				async () => {
					const resolver =
						personalUserResolvers.Query
							?.currentPersonalUserAndCreateIfNotExists;
					if (typeof resolver === 'function') {
						try {
							await resolver({}, {}, context, {} as never);
						} catch (error) {
							result = error;
						}
					}
				},
			);
			Then(
				'it should throw an error "Admin users cannot use this query. Use currentUser instead."',
				() => {
					expect(result).toBeInstanceOf(Error);
					expect((result as Error).message).toBe(
						'Admin users cannot use this query. Use currentUser instead.',
					);
				},
			);
		},
	);

	Scenario(
		'Creating personal user without authentication',
		({ Given, When, Then }) => {
			Given('no authenticated user context', () => {
				(context.applicationServices as { verifiedUser: unknown }).verifiedUser = undefined;
			});
			When(
				'I execute the query "currentPersonalUserAndCreateIfNotExists"',
				async () => {
					const resolver =
						personalUserResolvers.Query
							?.currentPersonalUserAndCreateIfNotExists;
					if (typeof resolver === 'function') {
						try {
							await resolver({}, {}, context, {} as never);
						} catch (error) {
							result = error;
						}
					}
				},
			);
			Then('it should throw an error "Unauthorized"', () => {
				expect(result).toBeInstanceOf(Error);
				expect((result as Error).message).toBe('Unauthorized');
			});
		},
	);

	Scenario('Accessing PersonalUser account field', ({ Given, When, Then }) => {
		Given('a PersonalUser object with account information', () => {
			// Will be provided in When step
		});
		When('I access the account field resolver', () => {
			const mockUser = createMockPersonalUser();
			const resolver = personalUserResolvers.PersonalUser?.account;
			if (typeof resolver === 'function') {
				result = resolver(mockUser as never, {}, context, {} as never);
			}
		});
		Then('it should return the account object', () => {
			expect(result).toBeDefined();
			expect((result as { email: string }).email).toBe('test@example.com');
		});
	});

	Scenario(
		'Accessing PersonalUser account field with null account',
		({ Given, When, Then }) => {
			Given('a PersonalUser object with null account', () => {
				// Will be provided in When step
			});
			When('I access the account field resolver', () => {
				const mockUser = createMockPersonalUser({ account: null as never });
				const resolver = personalUserResolvers.PersonalUser?.account;
				if (typeof resolver === 'function') {
					result = resolver(mockUser as never, {}, context, {} as never);
				}
			});
			Then('it should return null', () => {
				expect(result).toBeNull();
			});
		},
	);

	Scenario(
		'Checking if current viewer is admin via PersonalUser field',
		({ Given, When, Then, And }) => {
			Given('a PersonalUser object', () => {
				// Will be provided in When step
			});
			And('the current viewer is an admin user', () => {
				const mockAdminUser = {
					id: 'admin-123',
					userType: 'admin-user',
					role: {
						permissions: {},
					},
				};
				// Mock AdminUser.queryByEmail to return admin user
				vi.mocked(
					context.applicationServices.User.AdminUser.queryByEmail,
				).mockResolvedValue(mockAdminUser as never);
			});
			When('I access the userIsAdmin field resolver', async () => {
				const mockUser = createMockPersonalUser();
				const resolver = personalUserResolvers.PersonalUser?.userIsAdmin;
				if (typeof resolver === 'function') {
					result = await resolver(mockUser as never, {}, context, {} as never);
				}
			});
			Then('it should return true', () => {
				expect(result).toBe(true);
			});
		},
	);

	Scenario(
		'Checking if current viewer is not admin via PersonalUser field',
		({ Given, When, Then, And }) => {
			Given('a PersonalUser object', () => {
				// Will be provided in When step
			});
			And('the current viewer is not an admin user', () => {
				const mockPersonalUser = {
					id: 'user-123',
					userType: 'personal-user',
				};
				// Mock AdminUser.queryByEmail to return null
				vi.mocked(
					context.applicationServices.User.AdminUser.queryByEmail,
				).mockResolvedValue(null as never);
				// Mock PersonalUser.queryByEmail to return personal user
				vi.mocked(
					context.applicationServices.User.PersonalUser.queryByEmail,
				).mockResolvedValue(mockPersonalUser as never);
			});
			When('I access the userIsAdmin field resolver', async () => {
				const mockUser = createMockPersonalUser();
				const resolver = personalUserResolvers.PersonalUser?.userIsAdmin;
				if (typeof resolver === 'function') {
					result = await resolver(mockUser as never, {}, context, {} as never);
				}
			});
			Then('it should return false', () => {
				expect(result).toBe(false);
			});
		},
	);
});
