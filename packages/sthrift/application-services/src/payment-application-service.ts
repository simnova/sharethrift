import type { ServiceCybersource } from '@sthrift/service-cybersource';

export interface PaymentApplicationService {
	processPayment(
		request: ProcessPaymentRequest,
	): Promise<ProcessPaymentResponse>;
	refundPayment(request: RefundPaymentRequest): Promise<RefundPaymentResponse>;
	generatePublicKey(): Promise<string>;
}

export interface ProcessPaymentRequest {
	userId: string;
	orderInformation: {
		amountDetails: {
			totalAmount: number;
			currency: string;
		};
		billTo: {
			firstName: string;
			lastName: string;
			address1: string;
			address2?: string;
			city: string;
			state: string;
			postalCode: string;
			country: string;
			phoneNumber?: string;
			email?: string;
		};
	};
	paymentInformation: {
		card: {
			number: string;
			expirationMonth: string;
			expirationYear: string;
			securityCode: string;
		};
	};
}

export interface ProcessPaymentResponse {
	id?: string;
	status?: string;
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
	private readonly paymentService: ServiceCybersource;

	constructor(paymentService: ServiceCybersource) {
		this.paymentService = paymentService;
	}

	async processPayment(
		request: ProcessPaymentRequest,
	): Promise<ProcessPaymentResponse> {
		try {
			const amount = request.orderInformation.amountDetails.totalAmount;
			// For now we treat card.number as a temporary paymentInstrumentId placeholder.
			// In future, a real payment instrument identifier should be provided by caller.
			const paymentInstrumentId = request.paymentInformation.card.number;
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
							currency: request.orderInformation.amountDetails.currency,
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
}
