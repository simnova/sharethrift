import './service-config/otel-starter.ts';

import { Cellix, type UninitializedServiceRegistry } from './cellix.ts';
import type { ApiContextSpec } from '@ocom/api-context-spec';

import { ServiceMongoose } from '@ocom/service-mongoose';
import * as MongooseConfig from './service-config/mongoose/index.ts';

import { ServiceBlobStorage } from '@ocom/service-blob-storage';

import { ServiceTokenValidation } from '@ocom/service-token-validation';
import * as TokenValidationConfig from './service-config/token-validation/index.ts';

import { graphHandlerCreator } from '@ocom/api-graphql';
import { restHandlerCreator } from '@ocom/api-rest';
import type { Domain } from '@ocom/api-domain';

Cellix.initializeServices<ApiContextSpec>(
	(serviceRegistry: UninitializedServiceRegistry<ApiContextSpec>) => {
		serviceRegistry.registerService(
			new ServiceMongoose(
				MongooseConfig.mongooseConnectionString,
				MongooseConfig.mongooseConnectOptions,
			),
		);
		serviceRegistry.registerService(new ServiceBlobStorage());
		serviceRegistry.registerService(
			new ServiceTokenValidation(TokenValidationConfig.portalTokens),
		);
	},
)
	.setContext((serviceRegistry) => {
		return {
			domainDataSource: MongooseConfig.mongooseContextBuilder(
				serviceRegistry.getService<ServiceMongoose>(ServiceMongoose),
				{
					BlobStorage:
						serviceRegistry.getService<ServiceBlobStorage>(ServiceBlobStorage),
				},
			),
			domainDataSourceFromJwt: (
				validatedJwt: Domain.Types.VerifiedJwt | null,
			) =>
				MongooseConfig.mongooseContextBuilderWithJwt(
					serviceRegistry.getService<ServiceMongoose>(ServiceMongoose),
					{
						BlobStorage:
							serviceRegistry.getService<ServiceBlobStorage>(
								ServiceBlobStorage,
							),
					},
					validatedJwt,
				),
			tokenValidationService:
				serviceRegistry.getService<ServiceTokenValidation>(
					ServiceTokenValidation,
				),
		};
	})
	.then((cellix) => {
		cellix
			.registerAzureFunctionHandler(
				'graphql',
				{ route: 'graphql' },
				graphHandlerCreator,
			)
			.registerAzureFunctionHandler(
				'rest',
				{ route: 'rest' },
				restHandlerCreator,
			);
	})
	.catch((error: unknown) => {
		console.error('Error initializing Cellix:', error);
		process.exit(1);
	});
