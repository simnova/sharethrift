import type { DataSourcesFactory } from '@sthrift/api-persistence';
import type { TokenValidation } from '@sthrift/service-token-validation';
export interface ApiContextSpec {
	//mongooseService:Exclude<ServiceMongoose, ServiceBase>;
	dataSourcesFactory: DataSourcesFactory; // NOT an infrastructure service
	tokenValidationService: TokenValidation;
}
