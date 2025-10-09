import { Domain, type DomainDataSource } from '@sthrift/domain';
import type { ModelsContext } from '../models-context.ts';
import { DomainDataSourceImplementation } from './domain/index.ts';
import {
	type ReadonlyDataSource,
	ReadonlyDataSourceImplementation,
} from './readonly/index.ts';
import type { ServiceBlobStorage } from '@sthrift/service-blob-storage';
import { BlobDataSourceImplementation, type BlobDataSource } from './blob-storage/index.ts';

export type DataSources = {
	domainDataSource: DomainDataSource;
	readonlyDataSource: ReadonlyDataSource;
	blobDataSource: BlobDataSource;
};

export type DataSourcesFactory = {
	withPassport: (passport: Domain.Passport) => DataSources;
	withSystemPassport: () => DataSources;
};

export const DataSourcesFactoryImpl = (
	models: ModelsContext,
    blobStorageService: ServiceBlobStorage
): DataSourcesFactory => {
	const withPassport = (passport: Domain.Passport): DataSources => {
		return {
				domainDataSource: DomainDataSourceImplementation(models, passport),
				readonlyDataSource: ReadonlyDataSourceImplementation(models, passport),
				blobDataSource: BlobDataSourceImplementation(passport, blobStorageService),
			};
	};

	const withSystemPassport = (): DataSources => {
		const systemPassport = Domain.PassportFactory.forSystem({
			// canManageMembers: true,
			// canManageEndUserRolesAndPermissions: true,
		});
		return {
			domainDataSource: DomainDataSourceImplementation(models, systemPassport),
			readonlyDataSource: ReadonlyDataSourceImplementation(models, systemPassport),
			blobDataSource: BlobDataSourceImplementation(systemPassport, blobStorageService),
		};
	};

	return {
		withPassport: withPassport,
		withSystemPassport: withSystemPassport,
	};
};
