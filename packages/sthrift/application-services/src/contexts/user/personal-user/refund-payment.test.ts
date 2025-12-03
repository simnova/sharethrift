import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import type { DataSources } from '@sthrift/persistence';
import { expect, vi } from 'vitest';
import { refundPayment, type RefundPaymentCommand } from './refund-payment.ts';
import type { RefundResponse } from '@cellix/payment-service';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/refund-payment.feature'),
);

test.for(feature, ({ Scenario, BeforeEachScenario }) => {
	let mockDataSources: DataSources;
	let command: RefundPaymentCommand;
	let result: RefundResponse | undefined;

	BeforeEachScenario(() => {
		mockDataSources = {
			paymentDataSource: {
				PersonalUser: {
					PersonalUser: {
						PaymentPersonalUserRepo: {
							processRefund: vi.fn().mockResolvedValue({
								transactionId: 'refund-123',
								isSuccess: true,
							}),
						},
					},
				},
			},
			// biome-ignore lint/suspicious/noExplicitAny: Test mock type assertion
		} as any;

		command = {
			request: {
				transactionId: 'txn-123',
				amount: 9.99,
				orderInformation: {
					amountDetails: {
						currency: 'USD',
					},
				},
			},
		};

		result = undefined;
	});

	Scenario('Refund amount is zero', ({ Given, When, Then }) => {
		Given('a refund request with amount zero', () => {
			command.request.amount = 0;
		});

		When('the refundPayment command is executed', async () => {
			const refundFn = refundPayment(mockDataSources);
			result = await refundFn(command);
		});

		Then(
			'a failed refund response should be returned with message "Refund amount must be greater than zero"',
			() => {
				expect(result).toBeDefined();
				expect(result?.success).toBe(false);
				expect(result?.status).toBe('FAILED');
				expect(result?.errorInformation?.message).toBe(
					'Refund amount must be greater than zero',
				);
			},
		);
	});

	Scenario('Refund amount is undefined', ({ Given, When, Then }) => {
		Given('a refund request with undefined amount', () => {
			command.request.amount = undefined as unknown as number;
		});

		When('the refundPayment command is executed', async () => {
			const refundFn = refundPayment(mockDataSources);
			result = await refundFn(command);
		});

		Then(
			'a failed refund response should be returned with message "Refund amount must be greater than zero"',
			() => {
				expect(result).toBeDefined();
				expect(result?.success).toBe(false);
				expect(result?.status).toBe('FAILED');
				expect(result?.errorInformation?.message).toBe(
					'Refund amount must be greater than zero',
				);
			},
		);
	});

	Scenario(
		'Refund processing fails without transaction ID',
		({ Given, And, When, Then }) => {
			Given('a valid refund request', () => {
				command.request.amount = 5.0;
			});

			And(
				'the payment data source returns a failed refund without transaction ID',
				() => {
					(
						// biome-ignore lint/suspicious/noExplicitAny: Test mock access
						mockDataSources.paymentDataSource as any
					).PersonalUser.PersonalUser.PaymentPersonalUserRepo.processRefund.mockResolvedValue(
						{
							isSuccess: false,
							errorCode: 'DECLINED',
							errorMessage: 'Refund declined by processor',
						},
					);
				},
			);

			When('the refundPayment command is executed', async () => {
				const refundFn = refundPayment(mockDataSources);
				result = await refundFn(command);
			});

			Then(
				'a failed refund response should be returned without transaction ID',
				() => {
					expect(result).toBeDefined();
					expect(result?.success).toBe(false);
					expect(result?.status).toBe('FAILED');
					expect(result?.id).toBeUndefined();
					expect(result?.errorInformation?.reason).toBe('DECLINED');
					expect(result?.errorInformation?.message).toBe(
						'Refund declined by processor',
					);
				},
			);
		},
	);

	Scenario(
		'Refund processing fails with transaction ID',
		({ Given, And, When, Then }) => {
			Given('a valid refund request', () => {
				command.request.amount = 5.0;
			});

			And(
				'the payment data source returns a failed refund with transaction ID',
				() => {
					(
						// biome-ignore lint/suspicious/noExplicitAny: Test mock access
						mockDataSources.paymentDataSource as any
					).PersonalUser.PersonalUser.PaymentPersonalUserRepo.processRefund.mockResolvedValue(
						{
							transactionId: 'refund-failed-123',
							isSuccess: false,
							errorCode: 'INSUFFICIENT_FUNDS',
							errorMessage: 'Insufficient funds for refund',
						},
					);
				},
			);

			When('the refundPayment command is executed', async () => {
				const refundFn = refundPayment(mockDataSources);
				result = await refundFn(command);
			});

			Then(
				'a failed refund response should be returned with transaction ID',
				() => {
					expect(result).toBeDefined();
					expect(result?.success).toBe(false);
					expect(result?.status).toBe('FAILED');
					expect(result?.id).toBe('refund-failed-123');
					expect(result?.errorInformation?.reason).toBe('INSUFFICIENT_FUNDS');
				},
			);
		},
	);

	Scenario(
		'Successfully processing a refund without transaction ID',
		({ Given, And, When, Then }) => {
			Given('a valid refund request', () => {
				command.request.amount = 9.99;
			});

			And(
				'the payment data source returns a successful refund without transaction ID',
				() => {
					(
						// biome-ignore lint/suspicious/noExplicitAny: Test mock access
						mockDataSources.paymentDataSource as any
					).PersonalUser.PersonalUser.PaymentPersonalUserRepo.processRefund.mockResolvedValue(
						{
							isSuccess: true,
						},
					);
				},
			);

			When('the refundPayment command is executed', async () => {
				const refundFn = refundPayment(mockDataSources);
				result = await refundFn(command);
			});

			Then(
				'a successful refund response should be returned without transaction ID',
				() => {
					expect(result).toBeDefined();
					expect(result?.success).toBe(true);
					expect(result?.status).toBe('REFUNDED');
					expect(result?.id).toBeUndefined();
					expect(result?.orderInformation?.amountDetails.totalAmount).toBe(
						'9.99',
					);
					expect(result?.orderInformation?.amountDetails.currency).toBe('USD');
				},
			);
		},
	);

	Scenario(
		'Successfully processing a refund with transaction ID',
		({ Given, And, When, Then }) => {
			Given('a valid refund request', () => {
				command.request.amount = 15.5;
			});

			And(
				'the payment data source returns a successful refund with transaction ID',
				() => {
					(
						// biome-ignore lint/suspicious/noExplicitAny: Test mock access
						mockDataSources.paymentDataSource as any
					).PersonalUser.PersonalUser.PaymentPersonalUserRepo.processRefund.mockResolvedValue(
						{
							transactionId: 'refund-success-456',
							isSuccess: true,
						},
					);
				},
			);

			When('the refundPayment command is executed', async () => {
				const refundFn = refundPayment(mockDataSources);
				result = await refundFn(command);
			});

			Then(
				'a successful refund response should be returned with transaction ID',
				() => {
					expect(result).toBeDefined();
					expect(result?.success).toBe(true);
					expect(result?.status).toBe('REFUNDED');
					expect(result?.id).toBe('refund-success-456');
					expect(result?.orderInformation?.amountDetails.totalAmount).toBe(
						'15.5',
					);
				},
			);
		},
	);

	Scenario(
		'Refund processing throws an error',
		({ Given, And, When, Then }) => {
			Given('a valid refund request', () => {
				command.request.amount = 10.0;
			});

			And('the payment data source throws an error', () => {
				(
					// biome-ignore lint/suspicious/noExplicitAny: Test mock access
					mockDataSources.paymentDataSource as any
				).PersonalUser.PersonalUser.PaymentPersonalUserRepo.processRefund.mockRejectedValue(
					new Error('Network connection failed'),
				);
			});

			When('the refundPayment command is executed', async () => {
				const refundFn = refundPayment(mockDataSources);
				result = await refundFn(command);
			});

			Then(
				'a failed refund response should be returned with error information',
				() => {
					expect(result).toBeDefined();
					expect(result?.success).toBe(false);
					expect(result?.status).toBe('FAILED');
					expect(result?.errorInformation?.reason).toBe('PROCESSING_ERROR');
					expect(result?.errorInformation?.message).toBe(
						'Network connection failed',
					);
				},
			);
		},
	);
});
