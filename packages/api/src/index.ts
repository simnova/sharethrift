import './service-config/otel-starter.ts';

import { Cellix } from './cellix.ts';
import type { ApiContextSpec } from '@sthrift/api-context-spec';
import { type ApplicationServices, buildApplicationServicesFactory } from '@sthrift/api-application-services';

import { ServiceMongoose } from '@sthrift/service-mongoose';
import * as MongooseConfig from './service-config/mongoose/index.ts';

import { ServiceBlobStorage } from '@sthrift/service-blob-storage';

import { ServiceTokenValidation } from '@sthrift/service-token-validation';
import * as TokenValidationConfig from './service-config/token-validation/index.ts';

import { graphHandlerCreator } from '@sthrift/api-graphql';
import { restHandlerCreator } from '@sthrift/api-rest';


Cellix
    .initializeInfrastructureServices<ApiContextSpec, ApplicationServices>((serviceRegistry) => {
        serviceRegistry
            .registerInfrastructureService(
                new ServiceMongoose(
                    MongooseConfig.mongooseConnectionString,
                    MongooseConfig.mongooseConnectOptions,
                ),
            )
            .registerInfrastructureService(new ServiceBlobStorage())
            .registerInfrastructureService(
                new ServiceTokenValidation(
                    TokenValidationConfig.portalTokens,
                ),
            );
    })
	.setContext((serviceRegistry) => {
		return {
			dataSources: MongooseConfig.mongooseContextBuilder(
				serviceRegistry.getInfrastructureService<ServiceMongoose>(ServiceMongoose),
			),
			tokenValidationService: serviceRegistry.getInfrastructureService<ServiceTokenValidation>(ServiceTokenValidation),
		};
	})
    .initializeApplicationServices((context) => buildApplicationServicesFactory(context))
    .registerAzureFunctionHttpHandler(
        'graphql',
        { route: 'graphql' },
        graphHandlerCreator,
    )
    .registerAzureFunctionHttpHandler(
        'rest',
        { route: '{communityId}/{role}/{memberId}/{*rest}' },
        restHandlerCreator,
    )
    .startUp();
