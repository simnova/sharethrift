import './service-config/otel-starter.ts';

import { Cellix } from './cellix.ts';
import type { ApiContextSpec } from '@sthrift/context-spec';

import {
	type ApplicationServices,
	buildApplicationServicesFactory,
} from '@sthrift/application-services';
import { RegisterEventHandlers } from '@sthrift/event-handler';

import { ServiceMongoose } from '@cellix/service-mongoose';
import * as MongooseConfig from './service-config/mongoose/index.ts';

import { ServiceBlobStorage } from '@cellix/service-blob';

import { ServiceTokenValidation } from '@cellix/service-token-validation';
import * as TokenValidationConfig from './service-config/token-validation/index.ts';

import type { MessagingService } from '@cellix/service-messaging-base';
import { ServiceMessagingTwilio } from '@cellix/service-messaging-twilio';
import { ServiceMessagingMock } from '@cellix/service-messaging-mock';

import { graphHandlerCreator } from '@sthrift/graphql';
import { restHandlerCreator } from '@sthrift/rest';

import type { PaymentService } from '@cellix/service-payment-base';
import { ServicePaymentMock } from '@cellix/service-payment-mock';
import { ServicePaymentCybersource } from '@cellix/service-payment-cybersource';
import { ServiceCognitiveSearch } from '@sthrift/service-cognitive-search';

const { NODE_ENV } = process.env;
const isDevelopment = NODE_ENV === 'development';

Cellix.initializeInfrastructureServices<ApiContextSpec, ApplicationServices>(
	(serviceRegistry) => {
		
		serviceRegistry
			.registerInfrastructureService(
				new ServiceMongoose(
					MongooseConfig.mongooseConnectionString,
					MongooseConfig.mongooseConnectOptions,
				),
			)
			.registerInfrastructureService(new ServiceBlobStorage())
			.registerInfrastructureService(
				new ServiceTokenValidation(TokenValidationConfig.portalTokens),
			)
			.registerInfrastructureService(
				isDevelopment ? new ServiceMessagingMock() : new ServiceMessagingTwilio(),
			)
			.registerInfrastructureService(
				isDevelopment ? new ServicePaymentMock() : new ServicePaymentCybersource()
			)
			.registerInfrastructureService(new ServiceCognitiveSearch());
	},
)
	.setContext((serviceRegistry) => {
		const dataSourcesFactory = MongooseConfig.mongooseContextBuilder(
			serviceRegistry.getInfrastructureService<ServiceMongoose>(
				ServiceMongoose,
			),
		);

		const messagingService = isDevelopment
			? serviceRegistry.getInfrastructureService<MessagingService>(ServiceMessagingMock)
			: serviceRegistry.getInfrastructureService<MessagingService>(ServiceMessagingTwilio);
    
    const paymentService = isDevelopment
      ? serviceRegistry.getInfrastructureService<PaymentService>(ServicePaymentMock)
      : serviceRegistry.getInfrastructureService<PaymentService>(ServicePaymentCybersource);

		const { domainDataSource } = dataSourcesFactory.withSystemPassport();
		const searchService =
			serviceRegistry.getInfrastructureService<ServiceCognitiveSearch>(
				ServiceCognitiveSearch,
			);
		RegisterEventHandlers(domainDataSource, searchService);

		return {
			dataSourcesFactory,
			tokenValidationService:
				serviceRegistry.getInfrastructureService<ServiceTokenValidation>(
					ServiceTokenValidation,
				),
			paymentService,
			messagingService,
			searchService,
		};
	})
	.initializeApplicationServices((context) =>
		buildApplicationServicesFactory(context),
	)
	.registerAzureFunctionHttpHandler(
		'graphql',
		{
			route: 'graphql/{*segments}',
			methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'],
		},
		graphHandlerCreator,
	)
	.registerAzureFunctionHttpHandler(
		'rest',
		{ route: '{communityId}/{role}/{memberId}/{*rest}' },
		restHandlerCreator,
	)
	.startUp();
