import './service-config/otel-starter.ts';

import { Cellix } from './cellix.ts';
import type { ApiContextSpec } from '@sthrift/api-context-spec';
import { type ApplicationServices, buildApplicationServicesFactory } from '@sthrift/api-application-services';
import { RegisterEventHandlers } from '@sthrift/api-event-handler';

import { ServiceMongoose } from '@sthrift/service-mongoose';
import * as MongooseConfig from './service-config/mongoose/index.ts';

import { ServiceBlobStorage } from '@sthrift/service-blob-storage';

import { ServiceTokenValidation } from '@sthrift/service-token-validation';
import * as TokenValidationConfig from './service-config/token-validation/index.ts';

import { ServiceTwilio } from '@sthrift/service-twilio';
import { ServiceCybersource } from '@sthrift/service-cybersource';

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
            ).registerInfrastructureService(new ServiceTwilio())
            .registerInfrastructureService(new ServiceCybersource());
    })
    .setContext((serviceRegistry) => {
        const dataSourcesFactory = MongooseConfig.mongooseContextBuilder(
            serviceRegistry.getInfrastructureService<ServiceMongoose>(ServiceMongoose),
        );

        const { domainDataSource} = dataSourcesFactory.withSystemPassport();
        RegisterEventHandlers(domainDataSource);

        return {
            dataSourcesFactory,
            tokenValidationService: serviceRegistry.getInfrastructureService<ServiceTokenValidation>(ServiceTokenValidation),
            paymentService: serviceRegistry.getInfrastructureService<ServiceCybersource>(ServiceCybersource),
        };
    })
    .initializeApplicationServices((context) => buildApplicationServicesFactory(context))
    .registerAzureFunctionHttpHandler(
        'graphql',
        { route: 'graphql/{*segments}', methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'] },
        graphHandlerCreator,
    )
    .registerAzureFunctionHttpHandler(
        'rest',
        { route: '{communityId}/{role}/{memberId}/{*rest}' },
        restHandlerCreator,
    )
    .startUp();
