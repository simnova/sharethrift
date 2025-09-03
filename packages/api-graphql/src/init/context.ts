import type { BaseContext } from '@apollo/server';
import type { ApplicationServices } from '@sthrift/api-application-services';

export interface GraphContext extends BaseContext {
    applicationServices: ApplicationServices;
    paymentService: unknown; // Type for the payment service
    dataSourcesFactory: unknown; // Type for the data sources factory
}