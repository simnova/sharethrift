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

import type { TransactionalEmailService } from '@sthrift/transactional-email-service';
import { ServiceTransactionalEmailSendGrid } from '@sthrift/transactional-email-service-sendgrid';
import { ServiceTransactionalEmailMock } from '@sthrift/transactional-email-service-mock';

import { graphHandlerCreator } from '@sthrift/graphql';
import { restHandlerCreator } from '@sthrift/rest';
import { ServiceCybersource } from '@sthrift/service-cybersource';

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
				// Use SendGrid if API key is available, otherwise use mock
				// biome-ignore lint/complexity/useLiteralKeys: TypeScript requires bracket notation for process.env
				process.env['SENDGRID_API_KEY'] ? new ServiceTransactionalEmailSendGrid() : new ServiceTransactionalEmailMock(),
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

		const messagingService = isDevelopment
			? serviceRegistry.getInfrastructureService<MessagingService>(ServiceMessagingMock)
			: serviceRegistry.getInfrastructureService<MessagingService>(ServiceMessagingTwilio);

		// biome-ignore lint/complexity/useLiteralKeys: TypeScript requires bracket notation for process.env
		const emailService = process.env['SENDGRID_API_KEY']
			? serviceRegistry.getInfrastructureService<TransactionalEmailService>(ServiceTransactionalEmailSendGrid)
			: serviceRegistry.getInfrastructureService<TransactionalEmailService>(ServiceTransactionalEmailMock);

		const { domainDataSource } = dataSourcesFactory.withSystemPassport();
		RegisterEventHandlers(domainDataSource, emailService);

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
			emailService,
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
