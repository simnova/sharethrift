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

			const amount = command.request.paymentAmount;
			// create cybersource customer using paymentInstrument info
			const cybersourceCustomerProfile =
				await dataSources.paymentDataSource?.PersonalUser.PersonalUser.PaymentPersonalUserRepo.createCustomerProfile(
					sanitizedRequest.paymentInstrument,
					{
						paymentToken: command.request.paymentInstrument.paymentToken,
						isDefault: true,
					},
				);

			const cybersourceCustomerId =
				cybersourceCustomerProfile?.tokenInformation.customer.id;

			// get payment instrument info using cybersourceCustomerId
			const paymentInstruments =
				await dataSources.paymentDataSource?.PersonalUser.PersonalUser.PaymentPersonalUserRepo.getCustomerPaymentInstruments(
					cybersourceCustomerId,
				);
			const paymentInstrumentId =
				paymentInstruments._embedded.paymentInstruments?.[0]?.id;

			if (!paymentInstrumentId) {
				throw new Error('No valid payment instrument found');
			}
			const referenceId = `sharethrift-${command.request.userId}`;
			const receipt =
				await dataSources.paymentDataSource?.PersonalUser.PersonalUser.PaymentPersonalUserRepo.processPayment(
					referenceId,
					paymentInstrumentId,
					amount,
				);

			if (!receipt.isSuccess) {
				throw new Error('Payment processing failed');
			}

			// create subscription
			const subscriptionStartDay = new Date();
			const subscription =
				await dataSources.paymentDataSource.PersonalUser.PersonalUser.PaymentPersonalUserRepo.createSubscription(
					{
						planId: accountPlan?.cybersourcePlanId ?? '',
						cybersourceCustomerId: cybersourceCustomerId,
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
						cybersourceCustomerId as string;

					existingPersonalUser.account.profile.billing.subscription.subscriptionId =
						subscription.id;
					existingPersonalUser.account.profile.billing.subscription.planCode =
						accountPlan?.cybersourcePlanId;
					existingPersonalUser.account.profile.billing.subscription.status =
						subscription.status;
					existingPersonalUser.account.profile.billing.subscription.startDate =
						subscriptionStartDay;

					existingPersonalUser.requestAddAccountProfileBillingTransaction(
						receipt.transactionId as string,
						amount,
						referenceId,
						receipt.isSuccess ? 'SUCCEEDED' : 'FAILED',
						receipt.completedAt ?? new Date(),
					);

					await repo.save(existingPersonalUser);
				},
			);

			return {
				id: receipt.transactionId,
				success: receipt.isSuccess,
				cybersourceCustomerId: cybersourceCustomerId,
				cybersourceSubscriptionId: subscription.id,
				cybersourcePlanId: accountPlan?.cybersourcePlanId ?? '',
				message: receipt.isSuccess
					? 'Payment processed successfully'
					: undefined,
				status: receipt.isSuccess ? 'SUCCEEDED' : 'FAILED',
        orderInformation:{
          amountDetails: {
            totalAmount: command.request.paymentAmount.toString(),
            currency: command.request.currency,
          }
        }
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
