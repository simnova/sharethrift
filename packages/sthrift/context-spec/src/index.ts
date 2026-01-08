import type { DataSourcesFactory } from '@sthrift/persistence';
import type { TokenValidation } from '@sthrift/service-token-validation';
import type { PaymentService } from '@cellix/payment-service';
import type { MessagingService } from '@cellix/messaging-service';
import type { Domain } from '@sthrift/domain';

/**
 * Configuration for expired listing deletion processing
 */
export interface ListingDeletionConfig {
	/**
	 * Number of months after which archived listings become eligible for permanent deletion
	 * @default 6
	 */
	archivalMonths: number;

	/**
	 * Maximum number of listings to process per batch execution
	 * @default 100
	 */
	batchSize: number;

	/**
	 * Name of the blob container where listing images are stored
	 * @default 'listing-images'
	 */
	blobContainerName: string;
}

export interface ApiContextSpec {
	//mongooseService:Exclude<ServiceMongoose, ServiceBase>;
	dataSourcesFactory: DataSourcesFactory; // NOT an infrastructure service
	tokenValidationService: TokenValidation;
	paymentService: PaymentService;
	messagingService: MessagingService;
	blobStorageService: Domain.Services['BlobStorage'];
	listingDeletionConfig: ListingDeletionConfig;
}
