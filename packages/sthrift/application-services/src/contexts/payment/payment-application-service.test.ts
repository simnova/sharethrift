import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import type { ServiceCybersource } from '@sthrift/service-cybersource';
import { expect, vi } from 'vitest';
import {
	DefaultPaymentApplicationService,
	type ProcessPaymentRequest,
	type RefundPaymentRequest,
} from './payment-application-service.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, './features/payment-application-service.feature'),
);

test.for(feature, ({ Scenario, BeforeEachScenario }) => {
	let mockPaymentService: ServiceCybersource;
	let paymentService: DefaultPaymentApplicationService;
	let paymentRequest: ProcessPaymentRequest;
	let refundRequest: RefundPaymentRequest;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock variable
	let result: any;

	BeforeEachScenario(() => {
		mockPaymentService = {
			processPayment: vi.fn(),
			processRefund: vi.fn(),
			createPaymentInstrument: vi.fn(),
			deletePaymentInstrument: vi.fn(),
			getPaymentInstruments: vi.fn(),
			// biome-ignore lint/suspicious/noExplicitAny: Test mock type assertion
		} as any;

		paymentService = new DefaultPaymentApplicationService(mockPaymentService);

		paymentRequest = {
			userId: 'user-123',
			orderInformation: {
				amountDetails: {
					totalAmount: 100.5,
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
					email: 'john.doe@example.com',
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

		refundRequest = {
			userId: 'user-123',
			transactionId: 'txn-123',
			amount: 50.25,
			orderInformation: {
				amountDetails: {
					totalAmount: 100.5,
					currency: 'USD',
				},
			},
		};

		result = undefined;
	});

	Scenario(
		'Successfully processing a payment',
		({
			Given,
			And,
			When,
			Then,
		}: {
			// biome-ignore lint/suspicious/noExplicitAny: Test mock callback
			Given: any;
			// biome-ignore lint/suspicious/noExplicitAny: Test mock callback
			And: any;
			// biome-ignore lint/suspicious/noExplicitAny: Test mock callback
			When: any;
			// biome-ignore lint/suspicious/noExplicitAny: Test mock callback
			Then: any;
		}) => {
			Given('a valid payment request for user "user-123"', () => {
				expect(paymentRequest.userId).toBe('user-123');
			});

			And(
				'the payment service processes successfully with transaction "txn-123"',
				() => {
					vi.mocked(mockPaymentService.processPayment).mockResolvedValue({
						isSuccess: true,
						transactionId: 'txn-123',
						amount: 100.5,
					});
				},
			);

			When('the processPayment command is executed', async () => {
				result = await paymentService.processPayment(paymentRequest);
			});

			Then('the payment status should be "SUCCEEDED"', () => {
				expect(result.status).toBe('SUCCEEDED');
			});

			And('the transaction ID should be "txn-123"', () => {
				expect(result.id).toBe('txn-123');
			});

			And('the payment amount should be "100.5"', () => {
				expect(result.orderInformation?.amountDetails?.totalAmount).toBe(
					'100.5',
				);
			});
		},
	);

	Scenario(
		'Handling failed payment with error details',
		({
			Given,
			And,
			When,
			Then,
		}: {
			// biome-ignore lint/suspicious/noExplicitAny: Test mock callback
			Given: any;
			// biome-ignore lint/suspicious/noExplicitAny: Test mock callback
			And: any;
			// biome-ignore lint/suspicious/noExplicitAny: Test mock callback
			When: any;
			// biome-ignore lint/suspicious/noExplicitAny: Test mock callback
			Then: any;
		}) => {
			Given('a valid payment request for user "user-123"', () => {
				expect(paymentRequest.userId).toBe('user-123');
			});

			And(
				'the payment service fails with error "INSUFFICIENT_FUNDS"',
				() => {
					vi.mocked(mockPaymentService.processPayment).mockResolvedValue({
						isSuccess: false,
						transactionId: 'txn-failed-123',
						errorCode: 'INSUFFICIENT_FUNDS',
						errorMessage: 'Card declined due to insufficient funds',
					});
				},
			);

			When('the processPayment command is executed', async () => {
				result = await paymentService.processPayment(paymentRequest);
			});

			Then('the payment status should be "FAILED"', () => {
				expect(result.status).toBe('FAILED');
			});

			And('the error reason should be "INSUFFICIENT_FUNDS"', () => {
				expect(result.errorInformation?.reason).toBe('INSUFFICIENT_FUNDS');
			});

			And(
				'the error message should be "Card declined due to insufficient funds"',
				() => {
					expect(result.errorInformation?.message).toBe(
						'Card declined due to insufficient funds',
					);
				},
			);
		},
	);

	Scenario(
		'Handling payment failure without transaction ID',
		({
			Given,
			And,
			When,
			Then,
		}: {
			// biome-ignore lint/suspicious/noExplicitAny: Test mock callback
			Given: any;
			// biome-ignore lint/suspicious/noExplicitAny: Test mock callback
			And: any;
			// biome-ignore lint/suspicious/noExplicitAny: Test mock callback
			When: any;
			// biome-ignore lint/suspicious/noExplicitAny: Test mock callback
			Then: any;
		}) => {
			Given('a valid payment request for user "user-123"', () => {
				expect(paymentRequest.userId).toBe('user-123');
			});

			And('the payment service fails without transaction ID', () => {
				vi.mocked(mockPaymentService.processPayment).mockResolvedValue({
					isSuccess: false,
					errorCode: 'VALIDATION_ERROR',
					errorMessage: 'Invalid card number',
				});
			});

			When('the processPayment command is executed', async () => {
				result = await paymentService.processPayment(paymentRequest);
			});

			Then('the payment status should be "FAILED"', () => {
				expect(result.status).toBe('FAILED');
			});

			And('the error reason should be "VALIDATION_ERROR"', () => {
				expect(result.errorInformation?.reason).toBe('VALIDATION_ERROR');
			});
		},
	);

	Scenario(
		'Handling exceptions during payment processing',
		({
			Given,
			And,
			When,
			Then,
		}: {
			// biome-ignore lint/suspicious/noExplicitAny: Test mock callback
			Given: any;
			// biome-ignore lint/suspicious/noExplicitAny: Test mock callback
			And: any;
			// biome-ignore lint/suspicious/noExplicitAny: Test mock callback
			When: any;
			// biome-ignore lint/suspicious/noExplicitAny: Test mock callback
			Then: any;
		}) => {
			Given('a valid payment request for user "user-123"', () => {
				expect(paymentRequest.userId).toBe('user-123');
			});

			And('the payment service throws an error', () => {
				vi.mocked(mockPaymentService.processPayment).mockRejectedValue(
					new Error('Network error'),
				);
			});

			When('the processPayment command is executed', async () => {
				result = await paymentService.processPayment(paymentRequest);
			});

			Then('the payment status should be "FAILED"', () => {
				expect(result.status).toBe('FAILED');
			});

			And('the error reason should be "PROCESSING_ERROR"', () => {
				expect(result.errorInformation?.reason).toBe('PROCESSING_ERROR');
			});
		},
	);

	Scenario(
		'Handling non-Error exceptions',
		({
			Given,
			And,
			When,
			Then,
		}: {
			// biome-ignore lint/suspicious/noExplicitAny: Test mock callback
			Given: any;
			// biome-ignore lint/suspicious/noExplicitAny: Test mock callback
			And: any;
			// biome-ignore lint/suspicious/noExplicitAny: Test mock callback
			When: any;
			// biome-ignore lint/suspicious/noExplicitAny: Test mock callback
			Then: any;
		}) => {
			Given('a valid payment request for user "user-123"', () => {
				expect(paymentRequest.userId).toBe('user-123');
			});

			And('the payment service throws a non-Error exception', () => {
				vi.mocked(mockPaymentService.processPayment).mockRejectedValue(
					'Unknown error',
				);
			});

			When('the processPayment command is executed', async () => {
				result = await paymentService.processPayment(paymentRequest);
			});

			Then('the payment status should be "FAILED"', () => {
				expect(result.status).toBe('FAILED');
			});

			And('the error message should be "Unknown error occurred"', () => {
				expect(result.errorInformation?.message).toBe('Unknown error occurred');
			});
		},
	);

	Scenario(
		'Handling payment success without transaction ID',
		({
			Given,
			And,
			When,
			Then,
		}: {
			// biome-ignore lint/suspicious/noExplicitAny: Test mock callback
			Given: any;
			// biome-ignore lint/suspicious/noExplicitAny: Test mock callback
			And: any;
			// biome-ignore lint/suspicious/noExplicitAny: Test mock callback
			When: any;
			// biome-ignore lint/suspicious/noExplicitAny: Test mock callback
			Then: any;
		}) => {
			Given('a valid payment request for user "user-123"', () => {
				expect(paymentRequest.userId).toBe('user-123');
			});

			And(
				'the payment service processes successfully without transaction ID',
				() => {
					vi.mocked(mockPaymentService.processPayment).mockResolvedValue({
						isSuccess: true,
						amount: 100.5,
					});
				},
			);

			When('the processPayment command is executed', async () => {
				result = await paymentService.processPayment(paymentRequest);
			});

			Then('the payment status should be "SUCCEEDED"', () => {
				expect(result.status).toBe('SUCCEEDED');
			});
		},
	);

	Scenario(
		'Successfully processing a refund with specified amount',
		({
			Given,
			And,
			When,
			Then,
		}: {
			// biome-ignore lint/suspicious/noExplicitAny: Test mock callback
			Given: any;
			// biome-ignore lint/suspicious/noExplicitAny: Test mock callback
			And: any;
			// biome-ignore lint/suspicious/noExplicitAny: Test mock callback
			When: any;
			// biome-ignore lint/suspicious/noExplicitAny: Test mock callback
			Then: any;
		}) => {
			Given('a valid refund request for transaction "txn-123"', () => {
				expect(refundRequest.transactionId).toBe('txn-123');
			});

			And(
				'the refund service processes successfully with transaction "refund-123"',
				() => {
					vi.mocked(mockPaymentService.processRefund).mockResolvedValue({
						isSuccess: true,
						transactionId: 'refund-123',
						amount: 50.25,
					});
				},
			);

			When('the refundPayment command is executed', async () => {
				result = await paymentService.refundPayment(refundRequest);
			});

			Then('the refund status should be "REFUNDED"', () => {
				expect(result.status).toBe('REFUNDED');
			});

			And('the refund transaction ID should be "refund-123"', () => {
				expect(result.id).toBe('refund-123');
			});

			And('the refund amount should be "50.25"', () => {
				expect(result.orderInformation?.amountDetails?.totalAmount).toBe(
					'50.25',
				);
			});
		},
	);

	Scenario(
		'Using total amount when specific amount not provided',
		({
			Given,
			And,
			When,
			Then,
		}: {
			// biome-ignore lint/suspicious/noExplicitAny: Test mock callback
			Given: any;
			// biome-ignore lint/suspicious/noExplicitAny: Test mock callback
			And: any;
			// biome-ignore lint/suspicious/noExplicitAny: Test mock callback
			When: any;
			// biome-ignore lint/suspicious/noExplicitAny: Test mock callback
			Then: any;
		}) => {
			Given('a refund request without specific amount', () => {
				delete refundRequest.amount;
				expect(refundRequest.amount).toBeUndefined();
			});

			And(
				'the refund service processes successfully with full amount',
				() => {
					vi.mocked(mockPaymentService.processRefund).mockResolvedValue({
						isSuccess: true,
						transactionId: 'refund-full-123',
						amount: 100.5,
					});
				},
			);

			When('the refundPayment command is executed', async () => {
				result = await paymentService.refundPayment(refundRequest);
			});

			Then('the refund status should be "REFUNDED"', () => {
				expect(result.status).toBe('REFUNDED');
			});

			And('the refund amount should be "100.5"', () => {
				expect(mockPaymentService.processRefund).toHaveBeenCalledWith(
					'txn-123',
					100.5,
					'user-123',
				);
			});
		},
	);

	Scenario(
		'Handling failed refund with error details',
		({
			Given,
			And,
			When,
			Then,
		}: {
			// biome-ignore lint/suspicious/noExplicitAny: Test mock callback
			Given: any;
			// biome-ignore lint/suspicious/noExplicitAny: Test mock callback
			And: any;
			// biome-ignore lint/suspicious/noExplicitAny: Test mock callback
			When: any;
			// biome-ignore lint/suspicious/noExplicitAny: Test mock callback
			Then: any;
		}) => {
			Given('a valid refund request for transaction "txn-123"', () => {
				expect(refundRequest.transactionId).toBe('txn-123');
			});

			And('the refund service fails with error "ALREADY_REFUNDED"', () => {
				vi.mocked(mockPaymentService.processRefund).mockResolvedValue({
					isSuccess: false,
					transactionId: 'refund-failed-123',
					errorCode: 'ALREADY_REFUNDED',
					errorMessage: 'Transaction has already been refunded',
				});
			});

			When('the refundPayment command is executed', async () => {
				result = await paymentService.refundPayment(refundRequest);
			});

			Then('the refund status should be "FAILED"', () => {
				expect(result.status).toBe('FAILED');
			});

			And('the refund error reason should be "ALREADY_REFUNDED"', () => {
				expect(result.errorInformation?.reason).toBe('ALREADY_REFUNDED');
			});
		},
	);

	Scenario(
		'Handling refund failure without transaction ID',
		({
			Given,
			And,
			When,
			Then,
		}: {
			// biome-ignore lint/suspicious/noExplicitAny: Test mock callback
			Given: any;
			// biome-ignore lint/suspicious/noExplicitAny: Test mock callback
			And: any;
			// biome-ignore lint/suspicious/noExplicitAny: Test mock callback
			When: any;
			// biome-ignore lint/suspicious/noExplicitAny: Test mock callback
			Then: any;
		}) => {
			Given('a valid refund request for transaction "txn-123"', () => {
				expect(refundRequest.transactionId).toBe('txn-123');
			});

			And('the refund service fails without transaction ID', () => {
				vi.mocked(mockPaymentService.processRefund).mockResolvedValue({
					isSuccess: false,
					errorCode: 'TRANSACTION_NOT_FOUND',
					errorMessage: 'Original transaction not found',
				});
			});

			When('the refundPayment command is executed', async () => {
				result = await paymentService.refundPayment(refundRequest);
			});

			Then('the refund status should be "FAILED"', () => {
				expect(result.status).toBe('FAILED');
			});

			And(
				'the refund error reason should be "TRANSACTION_NOT_FOUND"',
				() => {
					expect(result.errorInformation?.reason).toBe('TRANSACTION_NOT_FOUND');
				},
			);
		},
	);

	Scenario(
		'Handling exceptions during refund processing',
		({
			Given,
			And,
			When,
			Then,
		}: {
			// biome-ignore lint/suspicious/noExplicitAny: Test mock callback
			Given: any;
			// biome-ignore lint/suspicious/noExplicitAny: Test mock callback
			And: any;
			// biome-ignore lint/suspicious/noExplicitAny: Test mock callback
			When: any;
			// biome-ignore lint/suspicious/noExplicitAny: Test mock callback
			Then: any;
		}) => {
			Given('a valid refund request for transaction "txn-123"', () => {
				expect(refundRequest.transactionId).toBe('txn-123');
			});

			And('the refund service throws an error', () => {
				vi.mocked(mockPaymentService.processRefund).mockRejectedValue(
					new Error('Service unavailable'),
				);
			});

			When('the refundPayment command is executed', async () => {
				result = await paymentService.refundPayment(refundRequest);
			});

			Then('the refund status should be "FAILED"', () => {
				expect(result.status).toBe('FAILED');
			});

			And('the refund error reason should be "PROCESSING_ERROR"', () => {
				expect(result.errorInformation?.reason).toBe('PROCESSING_ERROR');
			});
		},
	);

	Scenario(
		'Handling refund success without transaction ID',
		({
			Given,
			And,
			When,
			Then,
		}: {
			// biome-ignore lint/suspicious/noExplicitAny: Test mock callback
			Given: any;
			// biome-ignore lint/suspicious/noExplicitAny: Test mock callback
			And: any;
			// biome-ignore lint/suspicious/noExplicitAny: Test mock callback
			When: any;
			// biome-ignore lint/suspicious/noExplicitAny: Test mock callback
			Then: any;
		}) => {
			Given('a valid refund request for transaction "txn-123"', () => {
				expect(refundRequest.transactionId).toBe('txn-123');
			});

			And(
				'the refund service processes successfully without transaction ID',
				() => {
					vi.mocked(mockPaymentService.processRefund).mockResolvedValue({
						isSuccess: true,
						amount: 50.25,
					});
				},
			);

			When('the refundPayment command is executed', async () => {
				result = await paymentService.refundPayment(refundRequest);
			});

			Then('the refund status should be "REFUNDED"', () => {
				expect(result.status).toBe('REFUNDED');
			});
		},
	);

	Scenario(
		'Handling payment failure with default error details',
		({
			Given,
			And,
			When,
			Then,
		}: {
			// biome-ignore lint/suspicious/noExplicitAny: Test mock callback
			Given: any;
			// biome-ignore lint/suspicious/noExplicitAny: Test mock callback
			And: any;
			// biome-ignore lint/suspicious/noExplicitAny: Test mock callback
			When: any;
			// biome-ignore lint/suspicious/noExplicitAny: Test mock callback
			Then: any;
		}) => {
			Given('a valid payment request for user "user-123"', () => {
				expect(paymentRequest.userId).toBe('user-123');
			});

			And('the payment service fails without error code or message', () => {
				vi.mocked(mockPaymentService.processPayment).mockResolvedValue({
					isSuccess: false,
					transactionId: 'txn-default-error',
				});
			});

			When('the processPayment command is executed', async () => {
				result = await paymentService.processPayment(paymentRequest);
			});

			Then('the payment status should be "FAILED"', () => {
				expect(result.status).toBe('FAILED');
			});

			And('the error reason should be "PROCESSING_ERROR"', () => {
				expect(result.errorInformation?.reason).toBe('PROCESSING_ERROR');
			});

			And('the error message should be "Payment failed"', () => {
				expect(result.errorInformation?.message).toBe('Payment failed');
			});
		},
	);

	Scenario(
		'Handling refund failure with default error details',
		({
			Given,
			And,
			When,
			Then,
		}: {
			// biome-ignore lint/suspicious/noExplicitAny: Test mock callback
			Given: any;
			// biome-ignore lint/suspicious/noExplicitAny: Test mock callback
			And: any;
			// biome-ignore lint/suspicious/noExplicitAny: Test mock callback
			When: any;
			// biome-ignore lint/suspicious/noExplicitAny: Test mock callback
			Then: any;
		}) => {
			Given('a valid refund request for transaction "txn-123"', () => {
				expect(refundRequest.transactionId).toBe('txn-123');
			});

			And('the refund service fails without error code or message', () => {
				vi.mocked(mockPaymentService.processRefund).mockResolvedValue({
					isSuccess: false,
					transactionId: 'refund-default-error',
				});
			});

			When('the refundPayment command is executed', async () => {
				result = await paymentService.refundPayment(refundRequest);
			});

			Then('the refund status should be "FAILED"', () => {
				expect(result.status).toBe('FAILED');
			});

			And('the refund error reason should be "PROCESSING_ERROR"', () => {
				expect(result.errorInformation?.reason).toBe('PROCESSING_ERROR');
			});

			And('the refund error message should be "Refund failed"', () => {
				expect(result.errorInformation?.message).toBe('Refund failed');
			});
		},
	);

	Scenario(
		'Handling non-Error exceptions during refund',
		({
			Given,
			And,
			When,
			Then,
		}: {
			// biome-ignore lint/suspicious/noExplicitAny: Test mock callback
			Given: any;
			// biome-ignore lint/suspicious/noExplicitAny: Test mock callback
			And: any;
			// biome-ignore lint/suspicious/noExplicitAny: Test mock callback
			When: any;
			// biome-ignore lint/suspicious/noExplicitAny: Test mock callback
			Then: any;
		}) => {
			Given('a valid refund request for transaction "txn-123"', () => {
				expect(refundRequest.transactionId).toBe('txn-123');
			});

			And('the refund service throws a non-Error exception', () => {
				vi.mocked(mockPaymentService.processRefund).mockRejectedValue(
					'Unknown refund error',
				);
			});

			When('the refundPayment command is executed', async () => {
				result = await paymentService.refundPayment(refundRequest);
			});

			Then('the refund status should be "FAILED"', () => {
				expect(result.status).toBe('FAILED');
			});

			And('the refund error message should be "Unknown error occurred"', () => {
				expect(result.errorInformation?.message).toBe('Unknown error occurred');
			});
		},
	);
});
