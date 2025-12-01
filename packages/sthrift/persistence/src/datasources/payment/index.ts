import type { Domain } from '@sthrift/domain';
import type { PaymentService } from '@cellix/payment-service';
import { PaymentPersonalUserContext } from './user/index.ts';
import type * as PersonalUser from './user/personal-user/index.ts';

export interface PaymentDataSource {
	PersonalUser: {
		PersonalUser: {
			PaymentPersonalUserRepo: PersonalUser.PaymentPersonalUserRepository;
		};
	};
}

export const PaymentDataSourceImplementation = (
	paymentService: PaymentService,
	passport: Domain.Passport,
): PaymentDataSource => {
	return {
		PersonalUser: PaymentPersonalUserContext(paymentService, passport),
	};
};
