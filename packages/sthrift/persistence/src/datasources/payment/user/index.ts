import type { Domain } from '@sthrift/domain';
import type { PaymentService } from '@cellix/payment-service';
export type { PaymentPersonalUserRepository } from './personal-user/index.ts';
import { PaymentPersonalUserRepositoryImpl } from './personal-user/index.ts';

export const PaymentPersonalUserContext = (
	paymentService: PaymentService,
	passport: Domain.Passport,
) => {
	return {
		PersonalUser: PaymentPersonalUserRepositoryImpl(paymentService, passport),
	};
};
