import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect, vi, beforeEach } from 'vitest';
import { ServiceCybersource } from './index.ts';
import type {
	CustomerProfile,
	PaymentTokenInfo,
	PaymentInstrumentInfo,
	PlanCreation,
	Subscription,
} from './cybersource-interface.ts';

// Mock axios
vi.mock('axios', () => ({
	default: {
		create: vi.fn(() => ({
			post: vi.fn(),
			get: vi.fn(),
			patch: vi.fn(),
			delete: vi.fn(),
		})),
	},
}));

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/index.feature'),
);

test.for(feature, ({ Scenario }) => {
	let service: ServiceCybersource;
	let mockAxios: ReturnType<typeof vi.fn>;
	const originalEnv = process.env['NODE_ENV'];

	beforeEach(async () => {
		const axios = await import('axios');
		mockAxios = axios.default.create as ReturnType<typeof vi.fn>;
		mockAxios.mockClear();
	});

	Scenario('Constructing ServiceCybersource with default base URL', ({ Given, When, Then }) => {
		Given('no base URL is provided', () => {
			delete process.env['PAYMENT_API_URL'];
		});

		When('the ServiceCybersource is constructed', () => {
			service = new ServiceCybersource();
		});

		Then(
			'it should use the environment variable or empty string as base URL',
			() => {
				// biome-ignore lint/suspicious/noExplicitAny: test access to private property
				expect((service as any).baseUrl).toBe('');
			},
		);
	});

	Scenario('Constructing ServiceCybersource with custom base URL', ({ Given, When, Then }) => {
		const customUrl = 'https://custom-payment-api.example.com';

		Given('a custom base URL', () => {
			// Set in the When step
		});

		When('the ServiceCybersource is constructed with the custom URL', () => {
			service = new ServiceCybersource(customUrl);
		});

		Then('it should initialize with the provided base URL', () => {
			// biome-ignore lint/suspicious/noExplicitAny: test access to private property
			expect((service as any).baseUrl).toBe(customUrl);
		});
	});

	Scenario('Starting up the service in development mode', ({ Given, When, Then, And }) => {
		Given('a ServiceCybersource instance', () => {
			service = new ServiceCybersource('https://test-api.example.com');
		});

		And('NODE_ENV is set to development', () => {
			process.env['NODE_ENV'] = 'development';
		});

		When('startUp is called', () => {
			service.startUp();
		});

		Then('it should create an axios client with the base URL', () => {
			expect(mockAxios).toHaveBeenCalledWith({
				baseURL: 'https://test-api.example.com',
			});
			// biome-ignore lint/suspicious/noExplicitAny: test access to private property
			expect((service as any).client).toBeDefined();
		});

		// Cleanup
		process.env['NODE_ENV'] = originalEnv;
	});

	Scenario('Starting up the service when already started', ({ Given, When, Then }) => {
		Given('a started ServiceCybersource instance', () => {
			service = new ServiceCybersource('https://test-api.example.com');
			process.env['NODE_ENV'] = 'development';
			service.startUp();
		});

		When('startUp is called again', () => {
			// Handled in Then
		});

		Then('it should throw an error indicating the service is already started', () => {
			expect(() => service.startUp()).toThrow(
				'ServiceCybersource is already started',
			);
		});

		// Cleanup
		process.env['NODE_ENV'] = originalEnv;
	});

	Scenario('Shutting down the service', ({ Given, When, Then }) => {
		Given('a started ServiceCybersource instance', () => {
			service = new ServiceCybersource('https://test-api.example.com');
			process.env['NODE_ENV'] = 'development';
			service.startUp();
		});

		When('shutDown is called', () => {
			service.shutDown();
		});

		Then('it should clear the client instance', () => {
			// biome-ignore lint/suspicious/noExplicitAny: test access to private property
			expect((service as any).client).toBeUndefined();
		});

		// Cleanup
		process.env['NODE_ENV'] = originalEnv;
	});

	Scenario('Accessing service property when started', ({ Given, When, Then }) => {
		Given('a started ServiceCybersource instance', () => {
			service = new ServiceCybersource('https://test-api.example.com');
			process.env['NODE_ENV'] = 'development';
			service.startUp();
		});

		When('the service property is accessed', () => {
			// Handled in Then
		});

		Then('it should return the axios client', () => {
			expect(service.service).toBeDefined();
		});

		// Cleanup
		process.env['NODE_ENV'] = originalEnv;
	});

	Scenario('Accessing service property when not started', ({ Given, When, Then }) => {
		Given('a ServiceCybersource instance that has not been started', () => {
			service = new ServiceCybersource();
		});

		When('the service property is accessed', () => {
			// Handled in Then
		});

		Then('it should throw an error indicating the service is not started', () => {
			expect(() => service.service).toThrow(
				'ServiceCybersource is not started - cannot access service',
			);
		});
	});

	Scenario('Generating a public key', ({ Given, When, Then }) => {
		let result: string;
		const mockClient = {
			post: vi.fn().mockResolvedValue({ data: { publicKey: 'test-public-key' } }),
		};

		Given('a started ServiceCybersource instance', () => {
			service = new ServiceCybersource('https://test-api.example.com');
			process.env['NODE_ENV'] = 'development';
			service.startUp();
			// biome-ignore lint/suspicious/noExplicitAny: test replacement of client
			(service as any).client = mockClient;
		});

		When('generatePublicKey is called', async () => {
			result = await service.generatePublicKey();
		});

		Then('it should post to the public key endpoint and return a key', () => {
			expect(mockClient.post).toHaveBeenCalledWith('/pts/v2/public-key');
			expect(result).toBe('test-public-key');
		});

		// Cleanup
		process.env['NODE_ENV'] = originalEnv;
	});

	Scenario('Creating a customer profile', ({ Given, When, Then, And }) => {
		const mockClient = {
			post: vi.fn().mockResolvedValue({ data: { id: 'customer-123' } }),
		};
		const customerProfile: CustomerProfile = {
			customerId: 'cust-1',
			billingFirstName: 'John',
			billingLastName: 'Doe',
			billingEmail: 'john@example.com',
			billingAddressLine1: '123 Main St',
			billingCity: 'New York',
			billingState: 'NY',
			billingPostalCode: '10001',
			billingCountry: 'US',
		};
		const paymentTokenInfo: PaymentTokenInfo = {
			paymentToken: 'token-123',
			isDefault: true,
		};

		Given('a started ServiceCybersource instance', () => {
			service = new ServiceCybersource('https://test-api.example.com');
			process.env['NODE_ENV'] = 'development';
			service.startUp();
			// biome-ignore lint/suspicious/noExplicitAny: test replacement of client
			(service as any).client = mockClient;
		});

		And('a customer profile and payment token info', () => {
			// Already defined above
		});

		When('createCustomerProfile is called', async () => {
			await service.createCustomerProfile(customerProfile, paymentTokenInfo);
		});

		Then('it should post to the customers endpoint', () => {
			expect(mockClient.post).toHaveBeenCalledWith('/pts/v2/customers', {
				customerProfile,
				paymentTokenInfo,
			});
		});

		// Cleanup
		process.env['NODE_ENV'] = originalEnv;
	});

	Scenario('Getting a customer profile', ({ Given, When, Then, And }) => {
		const customerId = 'customer-123';
		const mockClient = {
			get: vi.fn().mockResolvedValue({ data: { id: customerId } }),
		};

		Given('a started ServiceCybersource instance', () => {
			service = new ServiceCybersource('https://test-api.example.com');
			process.env['NODE_ENV'] = 'development';
			service.startUp();
			// biome-ignore lint/suspicious/noExplicitAny: test replacement of client
			(service as any).client = mockClient;
		});

		And('a customer ID', () => {
			// Already defined above
		});

		When('getCustomerProfile is called', async () => {
			await service.getCustomerProfile(customerId);
		});

		Then('it should get from the customer endpoint', () => {
			expect(mockClient.get).toHaveBeenCalledWith(
				`/pts/v2/customers/${customerId}`,
			);
		});

		// Cleanup
		process.env['NODE_ENV'] = originalEnv;
	});

	Scenario('Adding a customer payment instrument', ({ Given, When, Then, And }) => {
		const customerProfile: CustomerProfile = {
			customerId: 'cust-1',
			billingFirstName: 'John',
			billingLastName: 'Doe',
			billingEmail: 'john@example.com',
			billingAddressLine1: '123 Main St',
			billingCity: 'New York',
			billingState: 'NY',
			billingPostalCode: '10001',
			billingCountry: 'US',
		};
		const paymentTokenInfo: PaymentTokenInfo = {
			paymentToken: 'token-123',
			isDefault: true,
		};
		const mockClient = {
			post: vi.fn().mockResolvedValue({ data: { id: 'instrument-123' } }),
		};

		Given('a started ServiceCybersource instance', () => {
			service = new ServiceCybersource('https://test-api.example.com');
			process.env['NODE_ENV'] = 'development';
			service.startUp();
			// biome-ignore lint/suspicious/noExplicitAny: test replacement of client
			(service as any).client = mockClient;
		});

		And('a customer profile and payment token info', () => {
			// Already defined above
		});

		When('addCustomerPaymentInstrument is called', async () => {
			await service.addCustomerPaymentInstrument(
				customerProfile,
				paymentTokenInfo,
			);
		});

		Then('it should post to the payment instruments endpoint', () => {
			expect(mockClient.post).toHaveBeenCalledWith(
				`/tms/v2/customers/${customerProfile.customerId}/payment-instruments`,
				{ paymentTokenInfo },
			);
		});

		// Cleanup
		process.env['NODE_ENV'] = originalEnv;
	});

	Scenario('Getting a customer payment instrument', ({ Given, When, Then, And }) => {
		const customerId = 'customer-123';
		const paymentInstrumentId = 'instrument-456';
		const mockClient = {
			get: vi.fn().mockResolvedValue({ data: { id: paymentInstrumentId } }),
		};

		Given('a started ServiceCybersource instance', () => {
			service = new ServiceCybersource('https://test-api.example.com');
			process.env['NODE_ENV'] = 'development';
			service.startUp();
			// biome-ignore lint/suspicious/noExplicitAny: test replacement of client
			(service as any).client = mockClient;
		});

		And('a customer ID and payment instrument ID', () => {
			// Already defined above
		});

		When('getCustomerPaymentInstrument is called', async () => {
			await service.getCustomerPaymentInstrument(
				customerId,
				paymentInstrumentId,
			);
		});

		Then('it should get the specific payment instrument', () => {
			expect(mockClient.get).toHaveBeenCalledWith(
				`/tms/v2/customers/${customerId}/payment-instruments/${paymentInstrumentId}`,
			);
		});

		// Cleanup
		process.env['NODE_ENV'] = originalEnv;
	});

	Scenario('Getting customer payment instruments with pagination', ({ Given, When, Then, And }) => {
		const customerId = 'customer-123';
		const offset = 10;
		const limit = 20;
		const mockClient = {
			get: vi.fn().mockResolvedValue({ data: { instruments: [] } }),
		};

		Given('a started ServiceCybersource instance', () => {
			service = new ServiceCybersource('https://test-api.example.com');
			process.env['NODE_ENV'] = 'development';
			service.startUp();
			// biome-ignore lint/suspicious/noExplicitAny: test replacement of client
			(service as any).client = mockClient;
		});

		And('a customer ID with offset and limit', () => {
			// Already defined above
		});

		When('getCustomerPaymentInstruments is called', async () => {
			await service.getCustomerPaymentInstruments(customerId, offset, limit);
		});

		Then('it should get payment instruments with pagination params', () => {
			expect(mockClient.get).toHaveBeenCalledWith(
				`/tms/v2/customers/${customerId}/payment-instruments?offset=${offset}&limit=${limit}`,
			);
		});

		// Cleanup
		process.env['NODE_ENV'] = originalEnv;
	});

	Scenario('Deleting a customer payment instrument', ({ Given, When, Then, And }) => {
		const customerId = 'customer-123';
		const paymentInstrumentId = 'instrument-456';
		const mockClient = {
			delete: vi.fn().mockResolvedValue({ data: true }),
		};

		Given('a started ServiceCybersource instance', () => {
			service = new ServiceCybersource('https://test-api.example.com');
			process.env['NODE_ENV'] = 'development';
			service.startUp();
			// biome-ignore lint/suspicious/noExplicitAny: test replacement of client
			(service as any).client = mockClient;
		});

		And('a customer ID and payment instrument ID', () => {
			// Already defined above
		});

		When('deleteCustomerPaymentInstrument is called', async () => {
			await service.deleteCustomerPaymentInstrument(
				customerId,
				paymentInstrumentId,
			);
		});

		Then('it should delete the payment instrument', () => {
			expect(mockClient.delete).toHaveBeenCalledWith(
				`/tms/v2/customers/${customerId}/payment-instruments/${paymentInstrumentId}`,
			);
		});

		// Cleanup
		process.env['NODE_ENV'] = originalEnv;
	});

	Scenario('Updating a customer payment instrument', ({ Given, When, Then, And }) => {
		const customerProfile: CustomerProfile = {
			customerId: 'cust-1',
			billingFirstName: 'John',
			billingLastName: 'Doe',
			billingEmail: 'john@example.com',
			billingAddressLine1: '123 Main St',
			billingCity: 'New York',
			billingState: 'NY',
			billingPostalCode: '10001',
			billingCountry: 'US',
		};
		const paymentInstrumentInfo: PaymentInstrumentInfo = {
			id: 'instrument-123',
			paymentInstrumentId: 'pi-123',
			cardType: 'Visa',
			cardExpirationMonth: '12',
			cardExpirationYear: '2025',
		};
		const mockClient = {
			patch: vi.fn().mockResolvedValue({ data: { id: 'instrument-123' } }),
		};

		Given('a started ServiceCybersource instance', () => {
			service = new ServiceCybersource('https://test-api.example.com');
			process.env['NODE_ENV'] = 'development';
			service.startUp();
			// biome-ignore lint/suspicious/noExplicitAny: test replacement of client
			(service as any).client = mockClient;
		});

		And('a customer profile and payment instrument info', () => {
			// Already defined above
		});

		When('updateCustomerPaymentInstrument is called', async () => {
			await service.updateCustomerPaymentInstrument(
				customerProfile,
				paymentInstrumentInfo,
			);
		});

		Then('it should patch the payment instrument', () => {
			expect(mockClient.patch).toHaveBeenCalledWith(
				`/tms/v2/customers/${customerProfile.customerId}/payment-instruments/${paymentInstrumentInfo.id}`,
				{ customerProfile, paymentInstrumentInfo },
			);
		});

		// Cleanup
		process.env['NODE_ENV'] = originalEnv;
	});

	Scenario('Processing a payment', ({ Given, When, Then, And }) => {
		const clientReferenceCode = 'ref-123';
		const paymentInstrumentId = 'instrument-456';
		const amount = 100;
		const mockClient = {
			post: vi
				.fn()
				.mockResolvedValue({ data: { transactionId: 'txn-789' } }),
		};

		Given('a started ServiceCybersource instance', () => {
			service = new ServiceCybersource('https://test-api.example.com');
			process.env['NODE_ENV'] = 'development';
			service.startUp();
			// biome-ignore lint/suspicious/noExplicitAny: test replacement of client
			(service as any).client = mockClient;
		});

		And('payment details', () => {
			// Already defined above
		});

		When('processPayment is called', async () => {
			await service.processPayment(
				clientReferenceCode,
				paymentInstrumentId,
				amount,
			);
		});

		Then('it should post to the payments endpoint', () => {
			expect(mockClient.post).toHaveBeenCalledWith('/pts/v2/payments', {
				clientReferenceCode,
				paymentInstrumentId,
				amount,
			});
		});

		// Cleanup
		process.env['NODE_ENV'] = originalEnv;
	});

	Scenario('Processing a refund', ({ Given, When, Then, And }) => {
		const transactionId = 'txn-123';
		const amount = 50;
		const referenceId = 'ref-456';
		const mockClient = {
			post: vi.fn().mockResolvedValue({ data: { refundId: 'refund-789' } }),
		};

		Given('a started ServiceCybersource instance', () => {
			service = new ServiceCybersource('https://test-api.example.com');
			process.env['NODE_ENV'] = 'development';
			service.startUp();
			// biome-ignore lint/suspicious/noExplicitAny: test replacement of client
			(service as any).client = mockClient;
		});

		And('refund details', () => {
			// Already defined above
		});

		When('processRefund is called', async () => {
			await service.processRefund(transactionId, amount, referenceId);
		});

		Then('it should post to the refunds endpoint', () => {
			expect(mockClient.post).toHaveBeenCalledWith('/pts/v2/refunds', {
				transactionId,
				amount,
				referenceId,
			});
		});

		// Cleanup
		process.env['NODE_ENV'] = originalEnv;
	});

	Scenario('Getting transaction by reference ID', ({ Given, When, Then, And }) => {
		const referenceId = 'ref-123';
		let result: Awaited<
			ReturnType<
				typeof service.getSuccessOrLatestFailedTransactionsByReferenceId
			>
		>;

		Given('a ServiceCybersource instance', () => {
			service = new ServiceCybersource();
		});

		And('a reference ID', () => {
			// Already defined above
		});

		When(
			'getSuccessOrLatestFailedTransactionsByReferenceId is called',
			async () => {
				result =
					await service.getSuccessOrLatestFailedTransactionsByReferenceId(
						referenceId,
					);
			},
		);

		Then('it should return a mock transaction receipt', () => {
			expect(result).toBeDefined();
			expect(result.vendor).toBe('MOCK_CYBERSOURCE');
			expect(result.isSuccess).toBe(true);
		});
	});

	Scenario('Creating a plan', ({ Given, When, Then, And }) => {
		const plan: PlanCreation = {
			name: 'Test Plan',
			description: 'Monthly subscription',
			periodLength: 1,
			periodUnit: 'month',
			billingCycles: 12,
			amount: 49.99,
			currency: 'USD',
		};
		const mockClient = {
			post: vi.fn().mockResolvedValue({ data: { id: 'plan-123' } }),
		};

		Given('a started ServiceCybersource instance', () => {
			service = new ServiceCybersource('https://test-api.example.com');
			process.env['NODE_ENV'] = 'development';
			service.startUp();
			// biome-ignore lint/suspicious/noExplicitAny: test replacement of client
			(service as any).client = mockClient;
		});

		And('plan creation details', () => {
			// Already defined above
		});

		When('createPlan is called', async () => {
			await service.createPlan(plan);
		});

		Then('it should post to the plans endpoint', () => {
			expect(mockClient.post).toHaveBeenCalledWith('/rbs/v1/plans', plan);
		});

		// Cleanup
		process.env['NODE_ENV'] = originalEnv;
	});

	Scenario('Getting list of plans', ({ Given, When, Then }) => {
		const mockClient = {
			get: vi.fn().mockResolvedValue({ data: { plans: [] } }),
		};

		Given('a started ServiceCybersource instance', () => {
			service = new ServiceCybersource('https://test-api.example.com');
			process.env['NODE_ENV'] = 'development';
			service.startUp();
			// biome-ignore lint/suspicious/noExplicitAny: test replacement of client
			(service as any).client = mockClient;
		});

		When('listOfPlans is called', async () => {
			await service.listOfPlans();
		});

		Then('it should get from the plans endpoint', () => {
			expect(mockClient.get).toHaveBeenCalledWith('/rbs/v1/plans');
		});

		// Cleanup
		process.env['NODE_ENV'] = originalEnv;
	});

	Scenario('Getting a specific plan', ({ Given, When, Then, And }) => {
		const planId = 'plan-123';
		const mockClient = {
			get: vi.fn().mockResolvedValue({ data: { id: planId } }),
		};

		Given('a started ServiceCybersource instance', () => {
			service = new ServiceCybersource('https://test-api.example.com');
			process.env['NODE_ENV'] = 'development';
			service.startUp();
			// biome-ignore lint/suspicious/noExplicitAny: test replacement of client
			(service as any).client = mockClient;
		});

		And('a plan ID', () => {
			// Already defined above
		});

		When('getPlan is called', async () => {
			await service.getPlan(planId);
		});

		Then('it should get the specific plan', () => {
			expect(mockClient.get).toHaveBeenCalledWith(`/rbs/v1/plans/${planId}`);
		});

		// Cleanup
		process.env['NODE_ENV'] = originalEnv;
	});

	Scenario('Creating a subscription', ({ Given, When, Then, And }) => {
		const subscription: Subscription = {
			subscriptionInformation: {
				planId: 'plan-123',
				name: 'Test Subscription',
				startDate: '2024-01-01',
			},
			paymentInformation: {
				customer: {
					id: 'cust-123',
				},
			},
		};
		const mockClient = {
			post: vi.fn().mockResolvedValue({ data: { id: 'sub-456' } }),
		};

		Given('a started ServiceCybersource instance', () => {
			service = new ServiceCybersource('https://test-api.example.com');
			process.env['NODE_ENV'] = 'development';
			service.startUp();
			// biome-ignore lint/suspicious/noExplicitAny: test replacement of client
			(service as any).client = mockClient;
		});

		And('subscription details', () => {
			// Already defined above
		});

		When('createSubscription is called', async () => {
			await service.createSubscription(subscription);
		});

		Then('it should post to the subscriptions endpoint', () => {
			expect(mockClient.post).toHaveBeenCalledWith(
				'/rbs/v1/subscriptions',
				subscription,
			);
		});

		// Cleanup
		process.env['NODE_ENV'] = originalEnv;
	});

	Scenario('Updating plan for subscription', ({ Given, When, Then, And }) => {
		const subscriptionId = 'sub-123';
		const planId = 'plan-456';
		const mockClient = {
			patch: vi.fn().mockResolvedValue({ data: { id: subscriptionId } }),
		};

		Given('a started ServiceCybersource instance', () => {
			service = new ServiceCybersource('https://test-api.example.com');
			process.env['NODE_ENV'] = 'development';
			service.startUp();
			// biome-ignore lint/suspicious/noExplicitAny: test replacement of client
			(service as any).client = mockClient;
		});

		And('a subscription ID and plan ID', () => {
			// Already defined above
		});

		When('updatePlanForSubscription is called', async () => {
			await service.updatePlanForSubscription(subscriptionId, planId);
		});

		Then('it should patch the subscription', () => {
			expect(mockClient.patch).toHaveBeenCalledWith(
				`/rbs/v1/subscriptions/${subscriptionId}`,
				{ planId },
			);
		});

		// Cleanup
		process.env['NODE_ENV'] = originalEnv;
	});

	Scenario('Getting list of subscriptions', ({ Given, When, Then }) => {
		const mockClient = {
			get: vi.fn().mockResolvedValue({ data: { subscriptions: [] } }),
		};

		Given('a started ServiceCybersource instance', () => {
			service = new ServiceCybersource('https://test-api.example.com');
			process.env['NODE_ENV'] = 'development';
			service.startUp();
			// biome-ignore lint/suspicious/noExplicitAny: test replacement of client
			(service as any).client = mockClient;
		});

		When('listOfSubscriptions is called', async () => {
			await service.listOfSubscriptions();
		});

		Then('it should get from the subscriptions endpoint', () => {
			expect(mockClient.get).toHaveBeenCalledWith('/rbs/v1/subscriptions');
		});

		// Cleanup
		process.env['NODE_ENV'] = originalEnv;
	});

	Scenario('Suspending a subscription', ({ Given, When, Then, And }) => {
		const subscriptionId = 'sub-123';
		const mockClient = {
			post: vi.fn().mockResolvedValue({ data: { status: 'SUSPENDED' } }),
		};

		Given('a started ServiceCybersource instance', () => {
			service = new ServiceCybersource('https://test-api.example.com');
			process.env['NODE_ENV'] = 'development';
			service.startUp();
			// biome-ignore lint/suspicious/noExplicitAny: test replacement of client
			(service as any).client = mockClient;
		});

		And('a subscription ID', () => {
			// Already defined above
		});

		When('suspendSubscription is called', async () => {
			await service.suspendSubscription(subscriptionId);
		});

		Then('it should post to the suspend endpoint', () => {
			expect(mockClient.post).toHaveBeenCalledWith(
				`/rbs/v1/subscriptions/${subscriptionId}/suspend`,
			);
		});

		// Cleanup
		process.env['NODE_ENV'] = originalEnv;
	});
});
