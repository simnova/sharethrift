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

import type { PaymentService } from '@cellix/payment-service';
import { PaymentServiceMock } from '@sthrift/payment-service-mock';
import { PaymentServiceCybersource } from '@sthrift/payment-service-cybersource';

import type { SearchService } from '@cellix/search-service';
import { InMemoryCognitiveSearch } from '@sthrift/search-service-mock';
// TODO: Import Azure Cognitive Search implementation when available
// import { AzureCognitiveSearchService } from '@sthrift/search-service-azure';

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
				isDevelopment ? new PaymentServiceMock() : new PaymentServiceCybersource(),
			)
			.registerInfrastructureService(
				isDevelopment
					? new InMemoryCognitiveSearch()
					: new InMemoryCognitiveSearch(), // TODO: Replace with AzureCognitiveSearchService() when available
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
			? serviceRegistry.getInfrastructureService<MessagingService>(ServiceMessagingMock)
			: serviceRegistry.getInfrastructureService<MessagingService>(ServiceMessagingTwilio);

		const paymentService = isDevelopment
			? serviceRegistry.getInfrastructureService<PaymentService>(PaymentServiceMock)
			: serviceRegistry.getInfrastructureService<PaymentService>(PaymentServiceCybersource);

		const searchService = isDevelopment
			? serviceRegistry.getInfrastructureService<SearchService>(InMemoryCognitiveSearch)
			: serviceRegistry.getInfrastructureService<SearchService>(InMemoryCognitiveSearch); // TODO: Replace with AzureCognitiveSearchService when available

		const { domainDataSource } = dataSourcesFactory.withSystemPassport();
		RegisterEventHandlers(domainDataSource, searchService);

		return {
			dataSourcesFactory,
			tokenValidationService:
				serviceRegistry.getInfrastructureService<ServiceTokenValidation>(
					ServiceTokenValidation,
				),
			paymentService,
			searchService,
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
