import { Domain } from '@sthrift/domain';
import type { PaymentService } from '@cellix/payment-service';
import { toDomainMessage } from './messaging-conversation.domain-adapter.ts';
import { processPayment } from '../../../../../../application-services/src/contexts/user/personal-user/process-payment';

export interface PaymentPersonalUserRepository {
	processPayment: (
    userId: string,
    amount: number,
    currency: string,
    paymentMethod: string,
  ) => Promise<Domain.Contexts.User.PersonalUser.PaymentResult>;
}

export class PaymentPersonalUserRepositoryImpl implements PaymentPersonalUserRepository {
	private readonly paymentService: PaymentService;
	constructor(paymentService: PaymentService, _passport: Domain.Passport) {
		this.paymentService = paymentService;
	}

	async processPayment(
    userId: string,
    amount: number,
    currency: string,
    paymentMethod: string,
  ): Promise<Domain.Contexts.User.PersonalUser.PaymentResult> {
    await console.log('Processing payment in repository...');
    return processPayment(
      this.paymentService,
      userId,
      amount,
      currency,
      paymentMethod,
    );
  }
}

export const getPaymentPersonalUserRepository = (
	paymentService: PaymentService,
	passport: Domain.Passport,
): PaymentPersonalUserRepository => {
	return new PaymentPersonalUserRepositoryImpl(paymentService, passport);
};
