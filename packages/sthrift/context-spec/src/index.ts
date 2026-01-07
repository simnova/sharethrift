import type { DataSourcesFactory } from '@sthrift/persistence';
import type { TokenValidation } from '@sthrift/service-token-validation';
import type { PaymentService } from '@cellix/payment-service';
import type { MessagingService } from '@cellix/messaging-service';
import type { Domain } from '@sthrift/domain';

export interface ApiContextSpec {
	//mongooseService:Exclude<ServiceMongoose, ServiceBase>;
	dataSourcesFactory: DataSourcesFactory; // NOT an infrastructure service
	tokenValidationService: TokenValidation;
	paymentService: PaymentService;
	messagingService: MessagingService;
	blobStorageService: Domain.Services['BlobStorage'];
}
