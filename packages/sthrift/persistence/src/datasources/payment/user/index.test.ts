import { describe, expect, it, vi } from 'vitest';
import type { Domain } from '@sthrift/domain';
import type { PaymentService } from '@cellix/payment-service';
import { PaymentPersonalUserContext } from './index.ts';

function makePassport(): Domain.Passport {
	return vi.mocked({} as Domain.Passport);
}

function makePaymentService(): PaymentService {
	return {
		createCustomerProfile: vi.fn().mockResolvedValue({}),
		getCustomerPaymentInstruments: vi.fn().mockResolvedValue({}),
		processPayment: vi.fn().mockResolvedValue({}),
		createSubscription: vi.fn().mockResolvedValue({}),
		generatePublicKey: vi.fn().mockResolvedValue('key'),
		processRefund: vi.fn().mockResolvedValue({}),
	} as unknown as PaymentService;
}

describe('PaymentPersonalUserContext', () => {
	it('should create PersonalUser context with PaymentPersonalUserRepo', () => {
		const paymentService = makePaymentService();
		const passport = makePassport();

		const result = PaymentPersonalUserContext(paymentService, passport);

		expect(result).toBeDefined();
		expect(result.PersonalUser).toBeDefined();
		expect(result.PersonalUser.PaymentPersonalUserRepo).toBeDefined();
	});

	it('should have all repository methods available', () => {
		const paymentService = makePaymentService();
		const passport = makePassport();

		const result = PaymentPersonalUserContext(paymentService, passport);
		const repo = result.PersonalUser.PaymentPersonalUserRepo;

		expect(typeof repo.processPayment).toBe('function');
		expect(typeof repo.createSubscription).toBe('function');
		expect(typeof repo.generatePublicKey).toBe('function');
		expect(typeof repo.processRefund).toBe('function');
	});
});
