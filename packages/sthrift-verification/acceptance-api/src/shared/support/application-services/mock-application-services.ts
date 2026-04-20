import type { MessagingService } from '@cellix/service-messaging-base';
import type { ServiceMongoose } from '@cellix/service-mongoose';
import type { PaymentService } from '@cellix/service-payment-base';
import type {
	TokenValidation,
	TokenValidationResult,
} from '@cellix/service-token-validation';
import {
	type ApplicationServicesFactory,
	buildApplicationServicesFactory,
} from '@sthrift/application-services';
import type { ApiContextSpec } from '@sthrift/context-spec';
import { Persistence } from '@sthrift/persistence';
import { defaultActor } from '@sthrift-verification/verification-shared/test-data';

function createMockTokenValidation(): TokenValidation {
	return {
		verifyJwt: <ClaimsType>(
			_token: string,
		): Promise<TokenValidationResult<ClaimsType> | null> => {
			return Promise.resolve({
				verifiedJwt: {
					given_name: defaultActor.givenName,
					family_name: defaultActor.familyName,
					email: defaultActor.email,
					sub: `test-${defaultActor.name.toLowerCase()}-sub`,
				} as unknown as ClaimsType,
				openIdConfigKey: 'UserPortal',
			});
		},
	};
}

function createNoOpMessagingService(): MessagingService {
	const notImplemented = () => {
		throw new Error('MessagingService not implemented in mongodb test session');
	};
	const service: MessagingService = {
		startUp: () =>
			Promise.resolve(service) as ReturnType<MessagingService['startUp']>,
		shutDown: () => Promise.resolve(),
		getConversation: notImplemented,
		sendMessage: notImplemented,
		getMessages: notImplemented,
		deleteConversation: notImplemented,
		listConversations: notImplemented,
		createConversation: notImplemented,
	};
	return service;
}

function createNoOpPaymentService(): PaymentService {
	const notImplemented = () => {
		throw new Error('PaymentService not implemented in mongodb test session');
	};
	const service: PaymentService = {
		startUp: () =>
			Promise.resolve(service) as ReturnType<PaymentService['startUp']>,
		shutDown: () => Promise.resolve(),
		generatePublicKey: notImplemented,
		createCustomerProfile: notImplemented,
		getCustomerProfile: notImplemented,
		addCustomerPaymentInstrument: notImplemented,
		getCustomerPaymentInstrument: notImplemented,
		getCustomerPaymentInstruments: notImplemented,
		deleteCustomerPaymentInstrument: notImplemented,
		updateCustomerPaymentInstrument: notImplemented,
		processPayment: notImplemented,
		processRefund: notImplemented,
		getSuccessOrLatestFailedTransactionsByReferenceId: notImplemented,
		createPlan: notImplemented,
		listOfPlans: notImplemented,
		getPlan: notImplemented,
		createSubscription: notImplemented,
		updatePlanForSubscription: notImplemented,
		listOfSubscriptions: notImplemented,
		suspendSubscription: notImplemented,
	};
	return service;
}

export function createMockApplicationServicesFactory(
	serviceMongoose: ServiceMongoose,
): ApplicationServicesFactory {
	const dataSourcesFactory = Persistence(serviceMongoose);

	const apiContextSpec: ApiContextSpec = {
		dataSourcesFactory,
		tokenValidationService: createMockTokenValidation(),
		messagingService: createNoOpMessagingService(),
		paymentService: createNoOpPaymentService(),
	};

	const mockApplicationServicesFactory =
		buildApplicationServicesFactory(apiContextSpec);

	return {
		forRequest: (_rawAuthHeader, hints) => {
			return mockApplicationServicesFactory.forRequest(
				'Bearer test-token',
				hints,
			);
		},
	};
}
