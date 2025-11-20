import type { DataSources } from '@sthrift/persistence';
import type { ProcessPaymentRequest } from '@cellix/payment-service';
import { update } from './update.ts';

export interface ProcessPaymentCommand {
	request: ProcessPaymentRequest;
}

interface PaymentResponse {
	id?: string;
	status: string;
	success: boolean;
	message?: string;
	cybersourceCustomerId?: string;
	cybersourceSubscriptionId?: string;
	cybersourcePlanId?: string;
	errorInformation?: {
		reason: string;
		message: string;
	};
	orderInformation?: {
		amountDetails: {
			totalAmount: string;
			currency: string;
		};
	};
}

export const processPayment = (dataSources: DataSources) => {
	return async (command: ProcessPaymentCommand): Promise<PaymentResponse> => {
		if (!dataSources.paymentDataSource) {
			throw new Error('Payment data source is not available');
		}

		try {
			const personalUser =
				await dataSources.readonlyDataSource.User.PersonalUser.PersonalUserReadRepo.getById(
					command.request.userId,
				);
			if (!personalUser) {
				return {
					status: 'FAILED',
					success: false,
					message: 'User not found',
				};
			}

			const accountPlan =
				await dataSources.readonlyDataSource.AccountPlan.AccountPlan.AccountPlanReadRepo.getByName(
					personalUser.account.accountType,
				);

			if (!accountPlan) {
				return {
					status: 'FAILED',
					success: false,
					message: 'Account plan not found',
				} as PaymentResponse;
			}

			const sanitizedRequest: ProcessPaymentRequest = {
				...command.request,
				paymentInstrument: {
					...command.request.paymentInstrument,
					billingAddressLine2:
						command.request.paymentInstrument.billingAddressLine2 ?? '',
					billingPhone: command.request.paymentInstrument.billingPhone ?? '',
					billingEmail: command.request.paymentInstrument.billingEmail ?? '',
				},
			};

			const response =
				await dataSources.paymentDataSource?.PersonalUser.PersonalUser.PaymentPersonalUserRepo.processPayment(
					sanitizedRequest,
				);

			if (
				response.status === 'FAILED' ||
				response.cybersourceCustomerId === undefined ||
				response.transactionId === undefined ||
				response.referenceId === undefined ||
				response.completedAt === undefined
			) {
				return {
					status: 'FAILED',
					success: false,
					message: 'Payment failed',
				} as PaymentResponse;
			}

			// create subscription
			const startDate = new Date();
			const subscription =
				await dataSources.paymentDataSource.PersonalUser.PersonalUser.PaymentPersonalUserRepo.createSubscription(
					{
						planId: accountPlan?.cybersourcePlanId ?? '',
						cybersourceCustomerId: response.cybersourceCustomerId,
						startDate: startDate,
					},
				);

			// update user with subscription id
			await update(dataSources)({
				id: personalUser.id,
				hasCompletedOnboarding: true,
				account: {
					profile: {
						billing: {
							cybersourceCustomerId: response.cybersourceCustomerId,
							subscription: {
								subscriptionId: subscription.id,
								planCode: accountPlan?.cybersourcePlanId ?? '',
								status: subscription.status,
								startDate: startDate,
							},
							// add transaction
							transactions: [
								{
									transactionId: response.transactionId,
									amount: sanitizedRequest.paymentAmount,
									referenceId: response.referenceId,
									status: response.status,
									completedAt: response.completedAt,
								},
							],
						},
					},
				},
			});

			return {
				...response,
				success: response.status === 'SUCCEEDED',
				cybersourceCustomerId: response.cybersourceCustomerId,
				cybersourceSubscriptionId: subscription.id,
				cybersourcePlanId: accountPlan?.cybersourcePlanId ?? '',
				message:
					response.status === 'SUCCEEDED'
						? 'Payment processed successfully'
						: undefined,
			} as PaymentResponse;
		} catch (error) {
			console.error('Payment processing error:', error);
			return {
				status: 'FAILED',
				success: false,
				message:
					error instanceof Error ? error.message : 'Unknown error occurred',
				errorInformation: {
					reason: 'PROCESSING_ERROR',
					message:
						error instanceof Error ? error.message : 'Unknown error occurred',
				},
			};
		}
	};
};
