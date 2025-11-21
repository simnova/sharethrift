import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import {
	DefaultPaymentApplicationService,
	type PaymentApplicationService,
	type ProcessPaymentRequest,
	type ProcessPaymentResponse,
	type RefundPaymentRequest,
	type RefundPaymentResponse,
} from './index.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, './features/index.feature'),
);

test.for(feature, ({ Scenario }) => {
	Scenario('Exporting DefaultPaymentApplicationService class', ({ When, Then, And }) => {
		When('the payment module is imported', () => {
			// Module is already imported
		});

		Then('it should export DefaultPaymentApplicationService class', () => {
			expect(DefaultPaymentApplicationService).toBeDefined();
		});

		And('the class should be a function constructor', () => {
			expect(typeof DefaultPaymentApplicationService).toBe('function');
		});
	});

	Scenario('Exporting PaymentApplicationService interface', ({ When, Then, And }) => {
		When('the payment module is imported', () => {
			// Module is already imported
		});

		Then('it should export PaymentApplicationService interface type', () => {
			const mockService: PaymentApplicationService = {
				processPayment: async () => ({ status: 'SUCCEEDED' }),
				refundPayment: async () => ({ status: 'REFUNDED' }),
			};
			expect(mockService).toBeDefined();
		});

		And('the interface should define processPayment method', () => {
			const mockService: PaymentApplicationService = {
				processPayment: async () => ({ status: 'SUCCEEDED' }),
				refundPayment: async () => ({ status: 'REFUNDED' }),
			};
			expect(mockService.processPayment).toBeDefined();
		});

		And('the interface should define refundPayment method', () => {
			const mockService: PaymentApplicationService = {
				processPayment: async () => ({ status: 'SUCCEEDED' }),
				refundPayment: async () => ({ status: 'REFUNDED' }),
			};
			expect(mockService.refundPayment).toBeDefined();
		});
	});

	Scenario('Exporting ProcessPaymentRequest interface', ({ When, Then, And }) => {
		When('the payment module is imported', () => {
			// Module is already imported
		});

		Then('it should export ProcessPaymentRequest interface type', () => {
			const mockRequest: ProcessPaymentRequest = {
				userId: 'test-user',
				orderInformation: {
					amountDetails: {
						totalAmount: 100,
						currency: 'USD',
					},
					billTo: {
						firstName: 'John',
						lastName: 'Doe',
						address1: '123 Main St',
						city: 'New York',
						state: 'NY',
						postalCode: '10001',
						country: 'US',
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
			};
			expect(mockRequest).toBeDefined();
		});

		And('the interface should define userId property', () => {
			const mockRequest: ProcessPaymentRequest = {
				userId: 'test-user',
				orderInformation: {
					amountDetails: {
						totalAmount: 100,
						currency: 'USD',
					},
					billTo: {
						firstName: 'John',
						lastName: 'Doe',
						address1: '123 Main St',
						city: 'New York',
						state: 'NY',
						postalCode: '10001',
						country: 'US',
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
			};
			expect(mockRequest.userId).toBe('test-user');
		});

		And('the interface should define orderInformation property', () => {
			const mockRequest: ProcessPaymentRequest = {
				userId: 'test-user',
				orderInformation: {
					amountDetails: {
						totalAmount: 100,
						currency: 'USD',
					},
					billTo: {
						firstName: 'John',
						lastName: 'Doe',
						address1: '123 Main St',
						city: 'New York',
						state: 'NY',
						postalCode: '10001',
						country: 'US',
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
			};
			expect(mockRequest.orderInformation).toBeDefined();
		});

		And('the interface should define paymentInformation property', () => {
			const mockRequest: ProcessPaymentRequest = {
				userId: 'test-user',
				orderInformation: {
					amountDetails: {
						totalAmount: 100,
						currency: 'USD',
					},
					billTo: {
						firstName: 'John',
						lastName: 'Doe',
						address1: '123 Main St',
						city: 'New York',
						state: 'NY',
						postalCode: '10001',
						country: 'US',
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
			};
			expect(mockRequest.paymentInformation).toBeDefined();
		});
	});

	Scenario('Exporting ProcessPaymentResponse interface', ({ When, Then, And }) => {
		When('the payment module is imported', () => {
			// Module is already imported
		});

		Then('it should export ProcessPaymentResponse interface type', () => {
			const mockResponse: ProcessPaymentResponse = {
				id: 'txn-123',
				status: 'SUCCEEDED',
			};
			expect(mockResponse).toBeDefined();
		});

		And('the interface should allow optional id property', () => {
			const mockResponse: ProcessPaymentResponse = {
				status: 'SUCCEEDED',
			};
			expect(mockResponse.id).toBeUndefined();
		});

		And('the interface should allow optional status property', () => {
			const mockResponse: ProcessPaymentResponse = {
				id: 'txn-123',
			};
			expect(mockResponse.status).toBeUndefined();
		});

		And('the interface should allow optional errorInformation property', () => {
			const mockResponse: ProcessPaymentResponse = {
				id: 'txn-123',
				status: 'FAILED',
				errorInformation: {
					reason: 'ERROR',
					message: 'Payment failed',
				},
			};
			expect(mockResponse.errorInformation).toBeDefined();
		});
	});

	Scenario('Exporting RefundPaymentRequest interface', ({ When, Then, And }) => {
		When('the payment module is imported', () => {
			// Module is already imported
		});

		Then('it should export RefundPaymentRequest interface type', () => {
			const mockRequest: RefundPaymentRequest = {
				userId: 'test-user',
				transactionId: 'txn-123',
				orderInformation: {
					amountDetails: {
						totalAmount: 100,
						currency: 'USD',
					},
				},
			};
			expect(mockRequest).toBeDefined();
		});

		And('the interface should define userId property', () => {
			const mockRequest: RefundPaymentRequest = {
				userId: 'test-user',
				transactionId: 'txn-123',
				orderInformation: {
					amountDetails: {
						totalAmount: 100,
						currency: 'USD',
					},
				},
			};
			expect(mockRequest.userId).toBe('test-user');
		});

		And('the interface should define transactionId property', () => {
			const mockRequest: RefundPaymentRequest = {
				userId: 'test-user',
				transactionId: 'txn-123',
				orderInformation: {
					amountDetails: {
						totalAmount: 100,
						currency: 'USD',
					},
				},
			};
			expect(mockRequest.transactionId).toBe('txn-123');
		});

		And('the interface should define optional amount property', () => {
			const mockRequest: RefundPaymentRequest = {
				userId: 'test-user',
				transactionId: 'txn-123',
				amount: 50,
				orderInformation: {
					amountDetails: {
						totalAmount: 100,
						currency: 'USD',
					},
				},
			};
			expect(mockRequest.amount).toBe(50);
		});

		And('the interface should define orderInformation property', () => {
			const mockRequest: RefundPaymentRequest = {
				userId: 'test-user',
				transactionId: 'txn-123',
				orderInformation: {
					amountDetails: {
						totalAmount: 100,
						currency: 'USD',
					},
				},
			};
			expect(mockRequest.orderInformation).toBeDefined();
		});
	});

	Scenario('Exporting RefundPaymentResponse interface', ({ When, Then, And }) => {
		When('the payment module is imported', () => {
			// Module is already imported
		});

		Then('it should export RefundPaymentResponse interface type', () => {
			const mockResponse: RefundPaymentResponse = {
				id: 'refund-123',
				status: 'REFUNDED',
			};
			expect(mockResponse).toBeDefined();
		});

		And('the interface should allow optional id property', () => {
			const mockResponse: RefundPaymentResponse = {
				status: 'REFUNDED',
			};
			expect(mockResponse.id).toBeUndefined();
		});

		And('the interface should define status property', () => {
			const mockResponse: RefundPaymentResponse = {
				id: 'refund-123',
				status: 'REFUNDED',
			};
			expect(mockResponse.status).toBe('REFUNDED');
		});

		And('the interface should allow optional errorInformation property', () => {
			const mockResponse: RefundPaymentResponse = {
				id: 'refund-123',
				status: 'FAILED',
				errorInformation: {
					reason: 'ERROR',
					message: 'Refund failed',
				},
			};
			expect(mockResponse.errorInformation).toBeDefined();
		});
	});
});
