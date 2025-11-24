import type { DataSources } from '@sthrift/persistence';
import type { ProcessPaymentRequest } from '@cellix/payment-service';

export interface ProcessPaymentCommand {
	request: ProcessPaymentRequest;
}

export interface PaymentResponse {
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
				throw new Error('User not found');
			}

			const accountPlan =
				await dataSources.readonlyDataSource.AccountPlan.AccountPlan.AccountPlanReadRepo.getByName(
					personalUser.account.accountType,
				);

			if (!accountPlan) {
				throw new Error('Account plan not found');
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
				!response.cybersourceCustomerId ||
				!response.transactionId ||
				!response.referenceId ||
				!response.completedAt
			) {
				throw new Error('Payment processing failed');
			}

			// create subscription
			const subscriptionStartDay = new Date();
			const subscription =
				await dataSources.paymentDataSource.PersonalUser.PersonalUser.PaymentPersonalUserRepo.createSubscription(
					{
						planId: accountPlan?.cybersourcePlanId ?? '',
						cybersourceCustomerId: response.cybersourceCustomerId,
						startDate: subscriptionStartDay,
					},
				);

			// update user with subscription, customer id, and transaction
			await dataSources.domainDataSource.User.PersonalUser.PersonalUserUnitOfWork.withScopedTransaction(
				async (repo) => {
					const existingPersonalUser = await repo.getById(
						command.request.userId,
					);

					existingPersonalUser.hasCompletedOnboarding = true;

					existingPersonalUser.account.profile.billing.cybersourceCustomerId =
						response.cybersourceCustomerId as string;

					existingPersonalUser.account.profile.billing.subscription.subscriptionId =
						subscription.id;
					existingPersonalUser.account.profile.billing.subscription.planCode =
						accountPlan?.cybersourcePlanId;
					existingPersonalUser.account.profile.billing.subscription.status =
						subscription.status;
					existingPersonalUser.account.profile.billing.subscription.startDate =
						subscriptionStartDay;

					existingPersonalUser.requestAddAccountProfileBillingTransaction(
						response.transactionId as string,
						sanitizedRequest.paymentAmount,
						response.referenceId ?? '',
						response.status,
						response.completedAt ?? new Date(),
					);

					await repo.save(existingPersonalUser);
				},
			);

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
