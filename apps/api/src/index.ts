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
import { ServiceTwilioReal } from '@sthrift/service-twilio';
import { ServiceTwilioMock } from '@sthrift/mock-service-twilio';

import { graphHandlerCreator } from '@sthrift/graphql';
import { restHandlerCreator } from '@sthrift/rest';
import { ServiceCybersource } from '@sthrift/service-cybersource';

function createMessagingService(): IMessagingService {
	// biome-ignore lint/complexity/useLiteralKeys: Required by TypeScript noPropertyAccessFromIndexSignature
	const useMock = process.env['TWILIO_USE_MOCK'] === 'true';

	if (useMock) {
		// biome-ignore lint/complexity/useLiteralKeys: Required by TypeScript noPropertyAccessFromIndexSignature
		const mockUrl = process.env['TWILIO_MOCK_URL'] ?? 'http://localhost:10000';
		console.log(`Registering ServiceTwilioMock with URL: ${mockUrl}`);
		return new ServiceTwilioMock(mockUrl);
	}

	// biome-ignore lint/complexity/useLiteralKeys: Required by TypeScript noPropertyAccessFromIndexSignature
	const accountSid = process.env['TWILIO_ACCOUNT_SID'];
	// biome-ignore lint/complexity/useLiteralKeys: Required by TypeScript noPropertyAccessFromIndexSignature
	const authToken = process.env['TWILIO_AUTH_TOKEN'];

	if (!accountSid || !authToken) {
		throw new Error(
			'TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN must be set when TWILIO_USE_MOCK is not true'
		);
	}

	console.log('Registering ServiceTwilioReal');
	return new ServiceTwilioReal(accountSid, authToken);
}

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
			.registerInfrastructureService(createMessagingService())
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
			messagingService:
				serviceRegistry.getInfrastructureService<IMessagingService>(
					ServiceTwilioMock,
				) ?? serviceRegistry.getInfrastructureService<IMessagingService>(
					ServiceTwilioReal,
				),
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
