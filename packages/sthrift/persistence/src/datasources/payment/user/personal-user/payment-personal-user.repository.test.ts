import { describe, expect, it, vi } from 'vitest';
import type { Domain } from '@sthrift/domain';
import type { PaymentService } from '@cellix/payment-service';
import {
	PaymentPersonalUserRepositoryImpl,
	getPaymentPersonalUserRepository,
} from './payment-personal-user.repository.ts';

function makePassport(): Domain.Passport {
	return vi.mocked({} as Domain.Passport);
}

function makePaymentService(): PaymentService {
	return {
		createCustomerProfile: vi.fn().mockResolvedValue({
			status: 'AUTHORIZED',
			clientReferenceCode: 'ref-123',
			customer: { id: 'cust-123' },
		}),
		getCustomerPaymentInstruments: vi.fn().mockResolvedValue({
			paymentInstruments: [{ id: 'instr-1' }],
		}),
		processPayment: vi.fn().mockResolvedValue({
			id: 'txn-123',
			status: 'AUTHORIZED',
		}),
		createSubscription: vi.fn().mockResolvedValue({
			id: 'sub-123',
			status: 'ACTIVE',
		}),
		generatePublicKey: vi.fn().mockResolvedValue('public-key-123'),
		processRefund: vi.fn().mockResolvedValue({
			id: 'refund-123',
			status: 'PENDING',
		}),
	} as unknown as PaymentService;
}

describe('PaymentPersonalUserRepository', () => {
	describe('getPaymentPersonalUserRepository', () => {
		it('should return a PaymentPersonalUserRepository instance', () => {
			const paymentService = makePaymentService();
			const passport = makePassport();

			const result = getPaymentPersonalUserRepository(paymentService, passport);

			expect(result).toBeDefined();
			expect(result.processPayment).toBeDefined();
			expect(result.createSubscription).toBeDefined();
		});
	});

	describe('createCustomerProfile', () => {
		it('should call paymentService.createCustomerProfile with correct params', async () => {
			const paymentService = makePaymentService();
			const passport = makePassport();
			const repo = new PaymentPersonalUserRepositoryImpl(
				paymentService,
				passport,
			);

			const customerProfile = {
				email: 'test@example.com',
				firstName: 'John',
				lastName: 'Doe',
			};
			const paymentTokenInfo = {
				transientToken: 'token-123',
			};

			await repo.createCustomerProfile(
				customerProfile as never,
				paymentTokenInfo as never,
			);

			expect(paymentService.createCustomerProfile).toHaveBeenCalledWith(
				customerProfile,
				paymentTokenInfo,
			);
		});

		it('should return the transaction response', async () => {
			const paymentService = makePaymentService();
			const passport = makePassport();
			const repo = new PaymentPersonalUserRepositoryImpl(
				paymentService,
				passport,
			);

			const result = await repo.createCustomerProfile({} as never, {} as never);

			expect(result).toEqual({
				status: 'AUTHORIZED',
				clientReferenceCode: 'ref-123',
				customer: { id: 'cust-123' },
			});
		});
	});

	describe('getCustomerPaymentInstruments', () => {
		it('should call paymentService.getCustomerPaymentInstruments with customerId', async () => {
			const paymentService = makePaymentService();
			const passport = makePassport();
			const repo = new PaymentPersonalUserRepositoryImpl(
				paymentService,
				passport,
			);

			await repo.getCustomerPaymentInstruments('cust-123');

			expect(paymentService.getCustomerPaymentInstruments).toHaveBeenCalledWith(
				'cust-123',
			);
		});

		it('should return the payment instruments', async () => {
			const paymentService = makePaymentService();
			const passport = makePassport();
			const repo = new PaymentPersonalUserRepositoryImpl(
				paymentService,
				passport,
			);

			const result = await repo.getCustomerPaymentInstruments('cust-123');

			expect(result).toEqual({
				paymentInstruments: [{ id: 'instr-1' }],
			});
		});
	});

	describe('processPayment', () => {
		it('should call paymentService.processPayment with correct params', async () => {
			const paymentService = makePaymentService();
			const passport = makePassport();
			const repo = new PaymentPersonalUserRepositoryImpl(
				paymentService,
				passport,
			);

			await repo.processPayment('ref-123', 'instr-123', 100);

			expect(paymentService.processPayment).toHaveBeenCalledWith(
				'ref-123',
				'instr-123',
				100,
			);
		});

		it('should return the transaction receipt', async () => {
			const paymentService = makePaymentService();
			const passport = makePassport();
			const repo = new PaymentPersonalUserRepositoryImpl(
				paymentService,
				passport,
			);

			const result = await repo.processPayment('ref-123', 'instr-123', 100);

			expect(result).toEqual({
				id: 'txn-123',
				status: 'AUTHORIZED',
			});
		});
	});

	describe('createSubscription', () => {
		it('should call paymentService.createSubscription with correct input', async () => {
			const paymentService = makePaymentService();
			const passport = makePassport();
			const repo = new PaymentPersonalUserRepositoryImpl(
				paymentService,
				passport,
			);

			const startDate = new Date('2024-01-01');
			await repo.createSubscription({
				planId: 'plan-123',
				cybersourceCustomerId: 'cust-123',
				startDate,
			});

			expect(paymentService.createSubscription).toHaveBeenCalledWith({
				subscriptionInformation: {
					planId: 'plan-123',
					name: 'plan-123',
					startDate: startDate.toISOString(),
				},
				paymentInformation: {
					customer: {
						id: 'cust-123',
					},
				},
			});
		});

		it('should return the subscription response', async () => {
			const paymentService = makePaymentService();
			const passport = makePassport();
			const repo = new PaymentPersonalUserRepositoryImpl(
				paymentService,
				passport,
			);

			const result = await repo.createSubscription({
				planId: 'plan-123',
				cybersourceCustomerId: 'cust-123',
				startDate: new Date(),
			});

			expect(result).toEqual({
				id: 'sub-123',
				status: 'ACTIVE',
			});
		});
	});

	describe('generatePublicKey', () => {
		it('should call paymentService.generatePublicKey', async () => {
			const paymentService = makePaymentService();
			const passport = makePassport();
			const repo = new PaymentPersonalUserRepositoryImpl(
				paymentService,
				passport,
			);

			await repo.generatePublicKey();

			expect(paymentService.generatePublicKey).toHaveBeenCalled();
		});

		it('should return the public key', async () => {
			const paymentService = makePaymentService();
			const passport = makePassport();
			const repo = new PaymentPersonalUserRepositoryImpl(
				paymentService,
				passport,
			);

			const result = await repo.generatePublicKey();

			expect(result).toBe('public-key-123');
		});
	});

	describe('processRefund', () => {
		it('should call paymentService.processRefund with correct params', async () => {
			const paymentService = makePaymentService();
			const passport = makePassport();
			const repo = new PaymentPersonalUserRepositoryImpl(
				paymentService,
				passport,
			);

			await repo.processRefund({
				userId: 'user-123',
				transactionId: 'txn-123',
				amount: 50,
				orderInformation: {
					amountDetails: {
						totalAmount: 50,
						currency: 'USD',
					},
				},
			});

			expect(paymentService.processRefund).toHaveBeenCalledWith(
				'txn-123',
				50,
				'txn-123',
			);
		});

		it('should return the transaction receipt', async () => {
			const paymentService = makePaymentService();
			const passport = makePassport();
			const repo = new PaymentPersonalUserRepositoryImpl(
				paymentService,
				passport,
			);

			const result = await repo.processRefund({
				userId: 'user-123',
				transactionId: 'txn-123',
				amount: 50,
				orderInformation: {
					amountDetails: {
						totalAmount: 50,
						currency: 'USD',
					},
				},
			});

			expect(result).toEqual({
				id: 'refund-123',
				status: 'PENDING',
			});
		});
	});
});
