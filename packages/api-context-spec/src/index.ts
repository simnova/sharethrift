import type { DataSources } from '@sthrift/api-persistence';
import type { TokenValidation } from '@sthrift/service-token-validation';
export interface ApiContextSpec {
	//mongooseService:Exclude<ServiceMongoose, ServiceBase>;
	dataSources: DataSources; // NOT an infrastructure service
	tokenValidationService: TokenValidation;
}
