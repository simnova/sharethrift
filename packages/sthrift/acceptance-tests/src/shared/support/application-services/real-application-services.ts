import type { ServiceMongoose } from '@cellix/service-mongoose';
import { Persistence } from '@sthrift/persistence';
import {
	buildApplicationServicesFactory,
	type ApplicationServicesFactory,
} from '@sthrift/application-services';
import type { ApiContextSpec } from '@sthrift/context-spec';
import type {
	TokenValidation,
	TokenValidationResult,
} from '@cellix/service-token-validation';
import type { MessagingService } from '@cellix/service-messaging-base';
import type { PaymentService } from '@cellix/service-payment-base';

function createMockTokenValidation(): TokenValidation {
	return {
		verifyJwt: <ClaimsType>(
			_token: string,
		): Promise<TokenValidationResult<ClaimsType> | null> => {
			return Promise.resolve({
				verifiedJwt: {
					given_name: 'Alice',
					family_name: 'Smith',
					email: 'alice@example.com',
					sub: 'test-alice-sub',
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
		startUp: () => Promise.resolve(service) as ReturnType<MessagingService['startUp']>,
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
		startUp: () => Promise.resolve(service) as ReturnType<PaymentService['startUp']>,
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

export function createRealApplicationServicesFactory(
	serviceMongoose: ServiceMongoose,
): ApplicationServicesFactory {
	const dataSourcesFactory = Persistence(serviceMongoose);

	const apiContextSpec: ApiContextSpec = {
		dataSourcesFactory,
		tokenValidationService: createMockTokenValidation(),
		messagingService: createNoOpMessagingService(),
		paymentService: createNoOpPaymentService(),
	};

	const realFactory = buildApplicationServicesFactory(apiContextSpec);

	return {
		forRequest: (_rawAuthHeader, hints) => {
			return realFactory.forRequest('Bearer test-token', hints);
		},
	};
}
