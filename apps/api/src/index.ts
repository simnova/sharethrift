import './service-config/otel-starter.ts';

import type { MessagingService } from '@cellix/service-messaging-base';
import { ServiceMessagingMock } from '@cellix/service-messaging-mock';
import { ServiceMessagingTwilio } from '@cellix/service-messaging-twilio';
import { ServiceMongoose } from '@cellix/service-mongoose';
import type { PaymentService } from '@cellix/service-payment-base';
import { ServicePaymentCybersource } from '@cellix/service-payment-cybersource';
import { ServicePaymentMock } from '@cellix/service-payment-mock';

import { ServiceTokenValidation } from '@cellix/service-token-validation';
import { type ApplicationServices, buildApplicationServicesFactory } from '@sthrift/application-services';
import type { ApiContextSpec } from '@sthrift/context-spec';
import { RegisterEventHandlers } from '@sthrift/event-handler';
import { graphHandlerCreator } from '@sthrift/graphql';
import { restHandlerCreator } from '@sthrift/rest';
import { ServiceBlobStorage } from '@sthrift/service-blob-storage';
import { Cellix } from './cellix.ts';
import * as MongooseConfig from './service-config/mongoose/index.ts';
import * as TokenValidationConfig from './service-config/token-validation/index.ts';

const { NODE_ENV } = process.env;
const isDevelopment = NODE_ENV === 'development';

Cellix.initializeInfrastructureServices<ApiContextSpec, ApplicationServices>((serviceRegistry) => {
	serviceRegistry
		.registerInfrastructureService(new ServiceMongoose(MongooseConfig.mongooseConnectionString, MongooseConfig.mongooseConnectOptions))
		.registerInfrastructureService(new ServiceBlobStorage())
		.registerInfrastructureService(new ServiceTokenValidation(TokenValidationConfig.portalTokens))
		.registerInfrastructureService(isDevelopment ? new ServiceMessagingMock() : new ServiceMessagingTwilio())
		.registerInfrastructureService(isDevelopment ? new ServicePaymentMock() : new ServicePaymentCybersource());
})
	.setContext((serviceRegistry) => {
		const dataSourcesFactory = MongooseConfig.mongooseContextBuilder(serviceRegistry.getInfrastructureService<ServiceMongoose>(ServiceMongoose));

		const messagingService = isDevelopment ? serviceRegistry.getInfrastructureService<MessagingService>(ServiceMessagingMock) : serviceRegistry.getInfrastructureService<MessagingService>(ServiceMessagingTwilio);

		const paymentService = isDevelopment ? serviceRegistry.getInfrastructureService<PaymentService>(ServicePaymentMock) : serviceRegistry.getInfrastructureService<PaymentService>(ServicePaymentCybersource);

		const { domainDataSource } = dataSourcesFactory.withSystemPassport();
		RegisterEventHandlers(domainDataSource);

		return {
			dataSourcesFactory,
			tokenValidationService: serviceRegistry.getInfrastructureService<ServiceTokenValidation>(ServiceTokenValidation),
			paymentService,
			messagingService,
		};
	})
	.initializeApplicationServices((context) => buildApplicationServicesFactory(context))
	.registerAzureFunctionHttpHandler(
		'graphql',
		{
			route: 'graphql/{*segments}',
			methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'],
		},
		graphHandlerCreator,
	)
	.registerAzureFunctionHttpHandler('rest', { route: '{communityId}/{role}/{memberId}/{*rest}' }, restHandlerCreator)
	.startUp();
