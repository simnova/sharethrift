import type { DataSources } from '@sthrift/persistence';
import type {RefundPaymentRequest, RefundResponse} from '@cellix/payment-service';

export interface RefundPaymentCommand {
	request: RefundPaymentRequest;
}



export const refundPayment = (dataSources: DataSources) => {
	return async (command: RefundPaymentCommand): Promise<RefundResponse> => {
		try {
			if (
				command.request.amount === undefined ||
				command.request.amount === 0
			) {
				throw new Error('Refund amount must be greater than zero');
			}

			const { amount } = command.request;
			const receipt =
				await dataSources.paymentDataSource?.PersonalUser.PersonalUser.PaymentPersonalUserRepo.processRefund(
					command.request,
				);

			if (!receipt?.isSuccess) {
				const failure: RefundResponse = {
					status: 'FAILED',
					success: false,
					errorInformation: {
						reason: receipt?.errorCode ?? 'PROCESSING_ERROR',
						message: receipt?.errorMessage ?? 'Refund failed',
					},
					orderInformation: {
						amountDetails: {
							totalAmount: amount.toString(),
							currency: command.request.orderInformation.amountDetails.currency,
						},
					},
				};
				if (receipt?.transactionId) {
					failure.id = receipt.transactionId;
				}
				return failure;
			}

			const success: RefundResponse = {
				status: 'REFUNDED',
				success: true,
				orderInformation: {
					amountDetails: {
						totalAmount: amount.toString(),
						currency: command.request.orderInformation.amountDetails.currency,
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
				success: false,
				errorInformation: {
					reason: 'PROCESSING_ERROR',
					message:
						error instanceof Error ? error.message : 'Unknown error occurred',
				},
			};
		}
	};
};
