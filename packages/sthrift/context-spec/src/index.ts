import type { DataSourcesFactory } from '@sthrift/persistence';
import type { TokenValidation } from '@cellix/service-token-validation';
import type { PaymentService } from '@cellix/service-payment-base';
import type { MessagingService } from '@cellix/service-messaging-base';

export interface ApiContextSpec {
	//mongooseService:Exclude<ServiceMongoose, ServiceBase>;
	dataSourcesFactory: DataSourcesFactory; // NOT an infrastructure service
	tokenValidationService: TokenValidation;
	paymentService: PaymentService;
	messagingService: MessagingService;
}
