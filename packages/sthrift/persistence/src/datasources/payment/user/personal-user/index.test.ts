import { describe, expect, it, vi } from 'vitest';
import type { Domain } from '@sthrift/domain';
import type { PaymentService } from '@cellix/payment-service';

function makePassport(): Domain.Passport {
	return vi.mocked({} as Domain.Passport);
}

function makePaymentService(): PaymentService {
	return {
		createCustomerProfile: vi.fn().mockResolvedValue({
			status: 'AUTHORIZED',
		}),
		getCustomerPaymentInstruments: vi.fn().mockResolvedValue({
			paymentInstruments: [],
		}),
		processPayment: vi.fn().mockResolvedValue({
			id: 'txn-123',
		}),
		createSubscription: vi.fn().mockResolvedValue({
			id: 'sub-123',
		}),
		generatePublicKey: vi.fn().mockResolvedValue('key'),
		processRefund: vi.fn().mockResolvedValue({
			id: 'refund-123',
		}),
	} as unknown as PaymentService;
}

describe('PaymentPersonalUserRepositoryImpl index', () => {
	it('should export PaymentPersonalUserRepositoryImpl from index', async () => {
		const { PaymentPersonalUserRepositoryImpl: RepoImpl } = await import(
			'./index.ts'
		);

		const paymentService = makePaymentService();
		const passport = makePassport();
		const result = RepoImpl(paymentService, passport);

		expect(result).toBeDefined();
		expect(result.PaymentPersonalUserRepo).toBeDefined();
	});

	it('should return repo with all methods', async () => {
		const { PaymentPersonalUserRepositoryImpl: RepoImpl } = await import(
			'./index.ts'
		);

		const paymentService = makePaymentService();
		const passport = makePassport();
		const result = RepoImpl(paymentService, passport);

		expect(result.PaymentPersonalUserRepo.processPayment).toBeDefined();
		expect(result.PaymentPersonalUserRepo.createSubscription).toBeDefined();
		expect(result.PaymentPersonalUserRepo.generatePublicKey).toBeDefined();
		expect(result.PaymentPersonalUserRepo.processRefund).toBeDefined();
		expect(result.PaymentPersonalUserRepo.createCustomerProfile).toBeDefined();
		expect(
			result.PaymentPersonalUserRepo.getCustomerPaymentInstruments,
		).toBeDefined();
	});
});
