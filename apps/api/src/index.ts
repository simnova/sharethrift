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

import type { MessagingService } from '@cellix/messaging-service';
import { ServiceMessagingTwilio } from '@sthrift/messaging-service-twilio';
import { ServiceMessagingMock } from '@sthrift/messaging-service-mock';

import { graphHandlerCreator } from '@sthrift/graphql';
import { restHandlerCreator } from '@sthrift/rest';

import { conversationCleanupHandlerCreator } from './handlers/conversation-cleanup-handler.ts';

import type { PaymentService } from '@cellix/payment-service';
import { PaymentServiceMock } from '@sthrift/payment-service-mock';
import { PaymentServiceCybersource } from '@sthrift/payment-service-cybersource';

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
				isDevelopment
					? new ServiceMessagingMock()
					: new ServiceMessagingTwilio(),
			)
			.registerInfrastructureService(
				isDevelopment
					? new PaymentServiceMock()
					: new PaymentServiceCybersource(),
			);
	},
)
	.setContext((serviceRegistry) => {
		const dataSourcesFactory = MongooseConfig.mongooseContextBuilder(
			serviceRegistry.getInfrastructureService<ServiceMongoose>(
				ServiceMongoose,
			),
		);

		const messagingService = isDevelopment
			? serviceRegistry.getInfrastructureService<MessagingService>(
					ServiceMessagingMock,
				)
			: serviceRegistry.getInfrastructureService<MessagingService>(
					ServiceMessagingTwilio,
				);

		const paymentService = isDevelopment
			? serviceRegistry.getInfrastructureService<PaymentService>(
					PaymentServiceMock,
				)
			: serviceRegistry.getInfrastructureService<PaymentService>(
					PaymentServiceCybersource,
				);

		const { domainDataSource } = dataSourcesFactory.withSystemPassport();
		RegisterEventHandlers(domainDataSource);

		return {
			dataSourcesFactory,
			tokenValidationService:
				serviceRegistry.getInfrastructureService<ServiceTokenValidation>(
					ServiceTokenValidation,
				),
			paymentService,
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
	.registerAzureFunctionTimerHandler(
		'conversationCleanup',
		'0 0 2 * * *',
		conversationCleanupHandlerCreator,
	)
	.startUp();
