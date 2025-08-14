import type { DataSources } from '@ocom/api-persistence';
import type { DomainDataSource } from '@ocom/api-domain';
import type { TokenValidation } from '@ocom/service-token-validation';

export interface ApiContextSpec {
	//mongooseService:Exclude<ServiceMongoose, ServiceBase>;
	dataSources: DataSources; // NOT an infrastructure service
	domainDataSource: DomainDataSource;
	tokenValidationService: TokenValidation;
}
