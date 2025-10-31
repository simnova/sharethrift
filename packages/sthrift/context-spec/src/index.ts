import type { DataSourcesFactory } from '@sthrift/persistence';
import type { TokenValidation } from '@sthrift/service-token-validation';
import type { ServiceCybersource } from '@sthrift/service-cybersource';
import type { IMessagingService } from '@cellix/messaging';

export interface ApiContextSpec {
	//mongooseService:Exclude<ServiceMongoose, ServiceBase>;
	dataSourcesFactory: DataSourcesFactory; // NOT an infrastructure service
	tokenValidationService: TokenValidation;
	paymentService: ServiceCybersource;
	messagingService: IMessagingService;
}
