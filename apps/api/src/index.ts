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

import type { IMessagingService } from '@cellix/messaging';
import { ServiceTwilio } from '@sthrift/service-twilio';
import { MockServiceTwilio } from '@sthrift/mock-service-twilio';

import { graphHandlerCreator } from '@sthrift/graphql';
import { restHandlerCreator } from '@sthrift/rest';
import { ServiceCybersource } from '@sthrift/service-cybersource';

Cellix.initializeInfrastructureServices<ApiContextSpec, ApplicationServices>(
	(serviceRegistry) => {
		// biome-ignore lint/complexity/useLiteralKeys: Required by TypeScript noPropertyAccessFromIndexSignature
		const useMockTwilio = process.env['TWILIO_USE_MOCK'] === 'true';
		
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
				useMockTwilio ? new MockServiceTwilio() : new ServiceTwilio(),
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

		const { domainDataSource } = dataSourcesFactory.withSystemPassport();
		RegisterEventHandlers(domainDataSource);
		
		// Get messaging service with fallback logic
		let messagingService: IMessagingService | undefined;
		// biome-ignore lint/complexity/useLiteralKeys: Required by TypeScript noPropertyAccessFromIndexSignature
		const useMockTwilio = process.env['TWILIO_USE_MOCK'] === 'true';
		
		if (useMockTwilio) {
			messagingService = serviceRegistry.getInfrastructureService<IMessagingService>(MockServiceTwilio);
		} else {
			messagingService = serviceRegistry.getInfrastructureService<IMessagingService>(ServiceTwilio);
		}
		
		if (!messagingService) {
			throw new Error('Messaging service not properly registered');
		}

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
