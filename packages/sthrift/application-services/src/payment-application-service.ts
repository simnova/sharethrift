import type {
	PaymentService,
	PlanCreation,
	SubscriptionResponse,
	PlanResponse,
	Subscription,
} from '@cellix/payment-service';

export interface PaymentApplicationService {
	processPayment(
		request: ProcessPaymentRequest,
	): Promise<ProcessPaymentResponse>;
	refundPayment(request: RefundPaymentRequest): Promise<RefundPaymentResponse>;
	createSubscription(request: {
		planId: string;
		cybersourceCustomerId: string;
		startDate: Date;
	}): Promise<SubscriptionResponse>;
	generatePublicKey(): Promise<string>;
	createPlan(request: PlanCreation): Promise<PlanResponse>;
}

export interface ProcessPaymentRequest {
	userId: string;
	paymentAmount: number;
	currency: string;

	paymentInstrument: {
		billingFirstName: string;
		billingLastName: string;
		billingAddressLine1: string;
		billingAddressLine2?: string;
		billingCity: string;
		billingState: string;
		billingPostalCode: string;
		billingCountry: string;
		billingPhone?: string;
		billingEmail: string;
		paymentToken: string;
	};
}

export interface ProcessPaymentResponse {
	id?: string;
	status?: string;
	cybersourceCustomerId?: string;
	errorInformation?: {
		reason?: string;
		message?: string;
	};
	orderInformation?: {
		amountDetails?: {
			totalAmount?: string;
			currency?: string;
		};
	};
}

export interface RefundPaymentRequest {
	userId: string;
	transactionId: string;
	amount?: number;
	orderInformation: {
		amountDetails: {
			totalAmount: number;
			currency: string;
		};
	};
}

export interface RefundPaymentResponse {
	id?: string;
	status: string;
	errorInformation?: {
		reason?: string;
		message?: string;
	};
	orderInformation?: {
		amountDetails?: {
			totalAmount?: string;
			currency?: string;
		};
	};
}

export class DefaultPaymentApplicationService
	implements PaymentApplicationService
{
	private readonly paymentService: PaymentService;

	constructor(paymentService: PaymentService) {
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

			const receipt = await this.paymentService.processPayment(
				request.userId,
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

	async refundPayment(
		request: RefundPaymentRequest,
	): Promise<RefundPaymentResponse> {
		try {
			const amount =
				request.amount ?? request.orderInformation.amountDetails.totalAmount;
			const receipt = await this.paymentService.processRefund(
				request.transactionId,
				amount,
				request.userId,
			);

			if (!receipt?.isSuccess) {
				const failure: RefundPaymentResponse = {
					status: 'FAILED',
					errorInformation: {
						reason: receipt?.errorCode ?? 'PROCESSING_ERROR',
						message: receipt?.errorMessage ?? 'Refund failed',
					},
					orderInformation: {
						amountDetails: {
							totalAmount: amount.toString(),
							currency: request.orderInformation.amountDetails.currency,
						},
					},
				};
				if (receipt?.transactionId) {
					failure.id = receipt.transactionId;
				}
				return failure;
			}

			const success: RefundPaymentResponse = {
				status: 'REFUNDED',
				orderInformation: {
					amountDetails: {
						totalAmount: amount.toString(),
						currency: request.orderInformation.amountDetails.currency,
					},
				},
			};
			if (receipt.transactionId) {
				success.id = receipt.transactionId;
			}
			return success;
		} catch (error) {
			console.error('Refund processing error:', error);
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

	async generatePublicKey(): Promise<string> {
		return await this.paymentService.generatePublicKey();
	}

	async createSubscription(request: {
		cybersourceCustomerId: string;
		planId: string;
		startDate: Date;
	}): Promise<SubscriptionResponse> {
		const subscriptionInput: Subscription = {
			subscriptionInformation: {
				planId: request.planId,
				name: request.planId,
				startDate: request.startDate.toISOString(),
			},
			paymentInformation: {
				customer: {
					id: request.cybersourceCustomerId,
				},
			},
		};
		return await this.paymentService.createSubscription(subscriptionInput);
	}

	async createPlan(request: PlanCreation): Promise<PlanResponse> {
		return await this.paymentService.createPlan(request);
	}
}
