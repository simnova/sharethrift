import { describe, expect, it, vi } from 'vitest';
import type { Domain } from '@sthrift/domain';
import type { PaymentService } from '@cellix/payment-service';
import { PaymentDataSourceImplementation } from './index.ts';

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

describe('PaymentDataSourceImplementation', () => {
	it('should create PaymentDataSource with PersonalUser context', () => {
		const paymentService = makePaymentService();
		const passport = makePassport();

		const result = PaymentDataSourceImplementation(paymentService, passport);

		expect(result).toBeDefined();
		expect(result.PersonalUser).toBeDefined();
	});

	it('should have PersonalUser with PersonalUser containing PaymentPersonalUserRepo', () => {
		const paymentService = makePaymentService();
		const passport = makePassport();

		const result = PaymentDataSourceImplementation(paymentService, passport);

		expect(result.PersonalUser.PersonalUser).toBeDefined();
		expect(
			result.PersonalUser.PersonalUser.PaymentPersonalUserRepo,
		).toBeDefined();
	});

	it('should have all repository methods on PaymentPersonalUserRepo', () => {
		const paymentService = makePaymentService();
		const passport = makePassport();

		const result = PaymentDataSourceImplementation(paymentService, passport);
		const repo = result.PersonalUser.PersonalUser.PaymentPersonalUserRepo;

		expect(typeof repo.processPayment).toBe('function');
		expect(typeof repo.createSubscription).toBe('function');
		expect(typeof repo.generatePublicKey).toBe('function');
		expect(typeof repo.processRefund).toBe('function');
		expect(typeof repo.createCustomerProfile).toBe('function');
		expect(typeof repo.getCustomerPaymentInstruments).toBe('function');
	});
});
