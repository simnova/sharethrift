import './service-config/otel-starter.ts';

import { Cellix } from './cellix.ts';
import type { ApiContextSpec } from '@sthrift/context-spec';

import {
	type ApplicationServices,
	buildApplicationServicesFactory,
} from '@sthrift/application-services';
import { RegisterEventHandlers } from '@sthrift/event-handler';

import { ServiceMongoose } from '@sthrift/service-mongoose';
import * as MongooseConfig from './service-config/mongoose/index.ts';

import { ServiceBlobStorage } from '@sthrift/service-blob-storage';

import { ServiceTokenValidation } from '@sthrift/service-token-validation';
import * as TokenValidationConfig from './service-config/token-validation/index.ts';

import type { MessagingService } from '@cellix/messaging';
import { ServiceTwilio } from '@sthrift/messaging-service-twilio';
import { MockMessagingService } from '@sthrift/messaging-service-mock';

import { graphHandlerCreator } from '@sthrift/graphql';
import { restHandlerCreator } from '@sthrift/rest';
import { ServiceCybersource } from '@sthrift/service-cybersource';

// biome-ignore lint/complexity/useLiteralKeys: Required by TypeScript noPropertyAccessFromIndexSignature
const USE_MOCK_MESSAGING = process.env['MESSAGING_USE_MOCK'] === 'true';

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
				USE_MOCK_MESSAGING ? new MockMessagingService() : new ServiceTwilio(),
			)
			.registerInfrastructureService(new ServiceCybersource());
	},
)
	.setContext((serviceRegistry) => {
		const dataSourcesFactory = MongooseConfig.mongooseContextBuilder(
			serviceRegistry.getInfrastructureService<ServiceMongoose>(
				ServiceMongoose,
			),
		);

		const messagingService = USE_MOCK_MESSAGING
			? serviceRegistry.getInfrastructureService<MessagingService>(MockMessagingService)
			: serviceRegistry.getInfrastructureService<MessagingService>(ServiceTwilio);

		const { domainDataSource } = dataSourcesFactory.withSystemPassport();
		RegisterEventHandlers(domainDataSource);

		return {
			dataSourcesFactory,
			tokenValidationService:
				serviceRegistry.getInfrastructureService<ServiceTokenValidation>(
					ServiceTokenValidation,
				),
			paymentService:
				serviceRegistry.getInfrastructureService<ServiceCybersource>(
					ServiceCybersource,
				),
			messagingService,
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
