import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import type { DataSources } from '@sthrift/persistence';
import { expect, vi } from 'vitest';
import {
	processPayment,
	type ProcessPaymentCommand,
	type PaymentResponse,
} from './process-payment.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/process-payment.feature'),
);

test.for(feature, ({ Scenario, BeforeEachScenario }) => {
	let mockDataSources: DataSources;
	let command: ProcessPaymentCommand;
	let result: PaymentResponse | undefined;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock variable
	let error: any;

	const mockPersonalUser = {
		id: 'user-123',
		hasCompletedOnboarding: false,
		account: {
			accountType: 'verified-personal',
			profile: {
				billing: {
					cybersourceCustomerId: '',
					subscription: {
						subscriptionId: '',
						planCode: '',
						status: '',
						startDate: null,
					},
				},
			},
		},
		requestAddAccountProfileBillingTransaction: vi.fn(),
	};

	const mockAccountPlan = {
		id: 'plan-123',
		name: 'verified-personal',
		cybersourcePlanId: 'cyb-plan-123',
	};

	const mockCustomerProfile = {
		tokenInformation: {
			customer: {
				id: 'cyb-cust-123',
			},
		},
	};

	const mockPaymentInstruments = {
		_embedded: {
			paymentInstruments: [{ id: 'pi-123' }],
		},
	};

	const mockReceipt = {
		transactionId: 'txn-123',
		isSuccess: true,
		completedAt: new Date(),
	};

	const mockSubscription = {
		id: 'sub-123',
		status: 'ACTIVE',
	};

	BeforeEachScenario(() => {
		mockDataSources = {
			paymentDataSource: {
				PersonalUser: {
					PersonalUser: {
						PaymentPersonalUserRepo: {
							createCustomerProfile: vi
								.fn()
								.mockResolvedValue(mockCustomerProfile),
							getCustomerPaymentInstruments: vi
								.fn()
								.mockResolvedValue(mockPaymentInstruments),
							processPayment: vi.fn().mockResolvedValue(mockReceipt),
							createSubscription: vi.fn().mockResolvedValue(mockSubscription),
						},
					},
				},
			},
			readonlyDataSource: {
				User: {
					PersonalUser: {
						PersonalUserReadRepo: {
							getById: vi.fn().mockResolvedValue(mockPersonalUser),
						},
					},
				},
				AccountPlan: {
					AccountPlan: {
						AccountPlanReadRepo: {
							getByName: vi.fn().mockResolvedValue(mockAccountPlan),
						},
					},
				},
			},
			domainDataSource: {
				User: {
					PersonalUser: {
						PersonalUserUnitOfWork: {
							withScopedTransaction: vi.fn(async (callback) => {
								const mockRepo = {
									getById: vi.fn().mockResolvedValue({
										...mockPersonalUser,
										requestAddAccountProfileBillingTransaction: vi.fn(),
									}),
									save: vi.fn().mockResolvedValue(mockPersonalUser),
								};
								await callback(mockRepo);
							}),
						},
					},
				},
			},
			// biome-ignore lint/suspicious/noExplicitAny: Test mock type assertion
		} as any;

		command = {
			request: {
				userId: 'user-123',
				paymentAmount: 9.99,
				currency: 'USD',
				paymentInstrument: {
					paymentToken: 'token-123',
					billingFirstName: 'John',
					billingLastName: 'Doe',
					billingAddressLine1: '123 Main St',
					billingAddressLine2: 'Apt 4B',
					billingCity: 'New York',
					billingState: 'NY',
					billingPostalCode: '10001',
					billingCountry: 'US',
					billingPhone: '555-1234',
					billingEmail: 'john@example.com',
				},
			},
		};

		result = undefined;
		error = undefined;
	});

	Scenario(
		'Payment data source is not available',
		({ Given, When, Then }) => {
			Given('the payment data source is undefined', () => {
				// biome-ignore lint/suspicious/noExplicitAny: Test mock access
				(mockDataSources as any).paymentDataSource = undefined;
			});

			When('the processPayment command is executed', async () => {
				const processFn = processPayment(mockDataSources);
				try {
					result = await processFn(command);
				} catch (e) {
					error = e;
				}
			});

			Then(
				'an error should be thrown with message "Payment data source is not available"',
				() => {
					expect(error).toBeDefined();
					expect(error.message).toBe('Payment data source is not available');
				},
			);
		},
	);

	Scenario(
		'User not found during payment processing',
		({ Given, And, When, Then }) => {
			Given('the payment data source is available', () => {
				// Mock already set up
			});

			And('the user does not exist', () => {
				(
					// biome-ignore lint/suspicious/noExplicitAny: Test mock access
					mockDataSources.readonlyDataSource as any
				).User.PersonalUser.PersonalUserReadRepo.getById.mockResolvedValue(
					null,
				);
			});

			When('the processPayment command is executed', async () => {
				const processFn = processPayment(mockDataSources);
				result = await processFn(command);
			});

			Then(
				'a failed payment response should be returned with message "User not found"',
				() => {
					expect(result).toBeDefined();
					expect(result?.success).toBe(false);
					expect(result?.status).toBe('FAILED');
					expect(result?.message).toBe('User not found');
				},
			);
		},
	);

	Scenario(
		'Account plan not found during payment processing',
		({ Given, And, When, Then }) => {
			Given('the payment data source is available', () => {
				// Mock already set up
			});

			And('the user exists', () => {
				// Mock already set up
			});

			And('the account plan does not exist', () => {
				(
					// biome-ignore lint/suspicious/noExplicitAny: Test mock access
					mockDataSources.readonlyDataSource as any
				).AccountPlan.AccountPlan.AccountPlanReadRepo.getByName.mockResolvedValue(
					null,
				);
			});

			When('the processPayment command is executed', async () => {
				const processFn = processPayment(mockDataSources);
				result = await processFn(command);
			});

			Then(
				'a failed payment response should be returned with message "Account plan not found"',
				() => {
					expect(result).toBeDefined();
					expect(result?.success).toBe(false);
					expect(result?.status).toBe('FAILED');
					expect(result?.message).toBe('Account plan not found');
				},
			);
		},
	);

	Scenario('No valid payment instrument found', ({ Given, And, When, Then }) => {
		Given('the payment data source is available', () => {
			// Mock already set up
		});

		And('the user exists', () => {
			// Mock already set up
		});

		And('the account plan exists', () => {
			// Mock already set up
		});

		And('customer profile is created', () => {
			// Mock already set up
		});

		And('no payment instrument is available', () => {
			(
				// biome-ignore lint/suspicious/noExplicitAny: Test mock access
				mockDataSources.paymentDataSource as any
			).PersonalUser.PersonalUser.PaymentPersonalUserRepo.getCustomerPaymentInstruments.mockResolvedValue(
				{
					_embedded: {
						paymentInstruments: [],
					},
				},
			);
		});

		When('the processPayment command is executed', async () => {
			const processFn = processPayment(mockDataSources);
			result = await processFn(command);
		});

		Then(
			'a failed payment response should be returned with message "No valid payment instrument found"',
			() => {
				expect(result).toBeDefined();
				expect(result?.success).toBe(false);
				expect(result?.status).toBe('FAILED');
				expect(result?.message).toBe('No valid payment instrument found');
			},
		);
	});

	Scenario('Payment processing fails', ({ Given, And, When, Then }) => {
		Given('the payment data source is available', () => {
			// Mock already set up
		});

		And('the user exists', () => {
			// Mock already set up
		});

		And('the account plan exists', () => {
			// Mock already set up
		});

		And('customer profile is created', () => {
			// Mock already set up
		});

		And('payment instrument is available', () => {
			// Mock already set up
		});

		And('payment processing fails', () => {
			(
				// biome-ignore lint/suspicious/noExplicitAny: Test mock access
				mockDataSources.paymentDataSource as any
			).PersonalUser.PersonalUser.PaymentPersonalUserRepo.processPayment.mockResolvedValue(
				{
					transactionId: 'txn-failed',
					isSuccess: false,
					completedAt: new Date(),
				},
			);
		});

		When('the processPayment command is executed', async () => {
			const processFn = processPayment(mockDataSources);
			result = await processFn(command);
		});

		Then(
			'a failed payment response should be returned with message "Payment processing failed"',
			() => {
				expect(result).toBeDefined();
				expect(result?.success).toBe(false);
				expect(result?.status).toBe('FAILED');
				expect(result?.message).toBe('Payment processing failed');
			},
		);
	});

	Scenario('Successfully processing a payment', ({ Given, And, When, Then }) => {
		Given('the payment data source is available', () => {
			// Mock already set up
		});

		And('the user exists', () => {
			// Mock already set up
		});

		And('the account plan exists', () => {
			// Mock already set up
		});

		And('customer profile is created', () => {
			// Mock already set up
		});

		And('payment instrument is available', () => {
			// Mock already set up
		});

		And('payment processing succeeds', () => {
			// Mock already set up with isSuccess: true
		});

		And('subscription is created', () => {
			// Mock already set up
		});

		When('the processPayment command is executed', async () => {
			const processFn = processPayment(mockDataSources);
			result = await processFn(command);
		});

		Then('a successful payment response should be returned', () => {
			expect(result).toBeDefined();
			expect(result?.success).toBe(true);
			expect(result?.status).toBe('SUCCEEDED');
			expect(result?.id).toBe('txn-123');
			expect(result?.cybersourceCustomerId).toBe('cyb-cust-123');
			expect(result?.cybersourceSubscriptionId).toBe('sub-123');
			expect(result?.cybersourcePlanId).toBe('cyb-plan-123');
			expect(result?.message).toBe('Payment processed successfully');
		});
	});

	Scenario(
		'Processing payment with optional billing fields',
		({ Given, And, When, Then }) => {
			Given('the payment data source is available', () => {
				// Mock already set up
			});

			And('the user exists', () => {
				// Mock already set up
			});

			And('the account plan exists', () => {
				// Mock already set up
			});

			And('customer profile is created', () => {
				// Mock already set up
			});

			And('payment instrument is available', () => {
				// Mock already set up
			});

			And('payment processing succeeds', () => {
				// Mock already set up
			});

			And('subscription is created', () => {
				// Mock already set up
			});

			And('the payment request has empty optional fields', () => {
				command.request.paymentInstrument.billingAddressLine2 = undefined;
				command.request.paymentInstrument.billingPhone = undefined;
				command.request.paymentInstrument.billingEmail = undefined;
			});

			When('the processPayment command is executed', async () => {
				const processFn = processPayment(mockDataSources);
				result = await processFn(command);
			});

			Then('a successful payment response should be returned', () => {
				expect(result).toBeDefined();
				expect(result?.success).toBe(true);
				expect(result?.status).toBe('SUCCEEDED');
			});
		},
	);
});
