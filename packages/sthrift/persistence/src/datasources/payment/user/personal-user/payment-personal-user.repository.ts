import type { Domain } from '@sthrift/domain';
import type {
	CustomerPaymentInstrumentsResponse,
	CustomerProfile,
	PaymentService,
	PaymentTokenInfo,
	PaymentTransactionResponse,
	Subscription,
	SubscriptionResponse,
	TransactionReceipt,
	RefundPaymentRequest,
} from '@cellix/payment-service';

export interface PaymentPersonalUserRepository {
	processPayment: (
		clientReferenceCode: string,
		paymentInstrumentId: string,
		amount: number,
	) => Promise<TransactionReceipt>;
	createSubscription: (params: {
		planId: string;
		cybersourceCustomerId: string;
		startDate: Date;
	}) => Promise<SubscriptionResponse>;
	generatePublicKey: () => Promise<string>;
	processRefund: (request: RefundPaymentRequest) => Promise<TransactionReceipt>;
	createCustomerProfile: (
		paymentInstrument: CustomerProfile,
		paymentTokenInfo: PaymentTokenInfo,
	) => Promise<PaymentTransactionResponse>;
	getCustomerPaymentInstruments: (
		cybersourceCustomerId: string,
	) => Promise<CustomerPaymentInstrumentsResponse>;
}

export class PaymentPersonalUserRepositoryImpl
	implements PaymentPersonalUserRepository
{
	private readonly paymentService: PaymentService;
	constructor(paymentService: PaymentService, _passport: Domain.Passport) {
		this.paymentService = paymentService;
	}

	async createCustomerProfile(
		paymentInstrument: CustomerProfile,
		paymentTokenInfo: PaymentTokenInfo,
	): Promise<PaymentTransactionResponse> {
		return await this.paymentService.createCustomerProfile(
			paymentInstrument,
			paymentTokenInfo,
		);
	}

	async getCustomerPaymentInstruments(
		cybersourceCustomerId: string,
	): Promise<CustomerPaymentInstrumentsResponse> {
		return await this.paymentService.getCustomerPaymentInstruments(
			cybersourceCustomerId,
		);
	}

	async processPayment(
		clientReferenceCode: string,
		paymentInstrumentId: string,
		amount: number,
	): Promise<TransactionReceipt> {
		return await this.paymentService.processPayment(
			clientReferenceCode,
			paymentInstrumentId,
			amount,
		);
	}

	async createSubscription(params: {
		planId: string;
		cybersourceCustomerId: string;
		startDate: Date;
	}): Promise<SubscriptionResponse> {
		const subscriptionInput: Subscription = {
			subscriptionInformation: {
				planId: params.planId,
				name: params.planId,
				startDate: params.startDate.toISOString(),
			},
			paymentInformation: {
				customer: {
					id: params.cybersourceCustomerId,
				},
			},
		};
		return await this.paymentService.createSubscription(subscriptionInput);
	}

	async generatePublicKey(): Promise<string> {
		return await this.paymentService.generatePublicKey();
	}

	async processRefund(
		request: RefundPaymentRequest,
	): Promise<TransactionReceipt> {
		return await this.paymentService.processRefund(
			request.transactionId,
			request.amount,
			request.transactionId,
		);
	}
}

export const getPaymentPersonalUserRepository = (
	paymentService: PaymentService,
	passport: Domain.Passport,
): PaymentPersonalUserRepository => {
	return new PaymentPersonalUserRepositoryImpl(paymentService, passport);
};
