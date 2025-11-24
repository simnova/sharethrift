import type { Domain } from '@sthrift/domain';
import type {
	PaymentService,
	Subscription,
	SubscriptionResponse,
	TransactionReceipt,
  ProcessPaymentRequest,
  ProcessPaymentResponse,
  RefundPaymentRequest,

} from '@cellix/payment-service';

export interface PaymentPersonalUserRepository {
	processPayment: (
		request: ProcessPaymentRequest,
	) => Promise<ProcessPaymentResponse>;
	createSubscription: (params: {
		planId: string;
		cybersourceCustomerId: string;
		startDate: Date;
	}) => Promise<SubscriptionResponse>;
	generatePublicKey: () => Promise<string>;
	processRefund: (request: RefundPaymentRequest) => Promise<TransactionReceipt>;
}

export class PaymentPersonalUserRepositoryImpl
	implements PaymentPersonalUserRepository
{
	private readonly paymentService: PaymentService;
	constructor(paymentService: PaymentService, _passport: Domain.Passport) {
		this.paymentService = paymentService;
	}

	async processPayment(
		request: ProcessPaymentRequest,
	): Promise<ProcessPaymentResponse> {
		try {
			const amount = request.paymentAmount;
			// create cybersource customer using paymentInstrument info
			const cybersourceCustomerProfile =
				await this.paymentService.createCustomerProfile(
					request.paymentInstrument,
					{
						paymentToken: request.paymentInstrument.paymentToken,
						isDefault: true,
					},
				);
			const cybersourceCustomerId =
				cybersourceCustomerProfile?.tokenInformation.customer.id;

			// get payment instrument info using cybersourceCustomerId
			const paymentInstruments =
				await this.paymentService.getCustomerPaymentInstruments(
					cybersourceCustomerId,
				);
			const paymentInstrumentId =
				paymentInstruments._embedded.paymentInstruments?.[0]?.id;

			if (!paymentInstrumentId) {
				const failure: ProcessPaymentResponse = {
					status: 'FAILED',
					errorInformation: {
						reason: 'NO_PAYMENT_INSTRUMENT',
						message: 'No valid payment instrument found',
					},
				};

				return failure;
			}

			const referenceId = `sharethrift-${request.userId}`;

			const receipt = await this.paymentService.processPayment(
				referenceId,
				paymentInstrumentId,
				amount,
			);

			if (!receipt?.isSuccess) {
				const failure: ProcessPaymentResponse = {
					status: 'FAILED',
					errorInformation: {
						reason: receipt?.errorCode ?? 'PROCESSING_ERROR',
						message: receipt?.errorMessage ?? 'Payment failed',
					},
					orderInformation: {
						amountDetails: {
							totalAmount: amount.toString(),
							currency: request.currency,
						},
					},
				};
				if (receipt?.transactionId) {
					failure.id = receipt.transactionId;
				}
				return failure;
			}

			const success: ProcessPaymentResponse = {
				status: 'SUCCEEDED',
				cybersourceCustomerId: cybersourceCustomerId,
				orderInformation: {
					amountDetails: {
						totalAmount: amount.toString(),
						currency: request.currency,
					},
				},
				referenceId: referenceId,
				completedAt: receipt.completedAt,
				transactionId: receipt.transactionId ?? '',
			};
			if (receipt.transactionId) {
				success.id = receipt.transactionId;
			}
			return success;
		} catch (error) {
			console.error('Payment processing error:', error);
			return {
				status: 'FAILED',
				errorInformation: {
					reason: 'PROCESSING_ERROR',
					message:
						error instanceof Error ? error.message : 'Unknown error occurred',
				},
			};
		}
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
