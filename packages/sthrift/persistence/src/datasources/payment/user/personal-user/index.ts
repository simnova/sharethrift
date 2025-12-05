import type { Domain } from '@sthrift/domain';
import type { PaymentService } from '@cellix/payment-service';
import { getPaymentPersonalUserRepository } from './payment-personal-user.repository.ts';
export type { PaymentPersonalUserRepository } from './payment-personal-user.repository.ts';

export const PaymentPersonalUserRepositoryImpl = (
	paymentService: PaymentService,
	passport: Domain.Passport,
) => {
	return {
		PaymentPersonalUserRepo: getPaymentPersonalUserRepository(paymentService, passport),
	};
};
