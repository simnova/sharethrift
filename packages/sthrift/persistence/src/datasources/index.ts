import { Domain, type DomainDataSource } from '@sthrift/domain';
import type { MessagingService } from '@cellix/messaging';
import type { ModelsContext } from '../models-context.ts';
import { DomainDataSourceImplementation } from './domain/index.ts';
import {
	type ReadonlyDataSource,
	ReadonlyDataSourceImplementation,
} from './readonly/index.ts';
import {
	type MessagingDataSource,
	MessagingDataSourceImplementation,
} from './messaging/index.ts';

export type DataSources = {
	domainDataSource: DomainDataSource;
	readonlyDataSource: ReadonlyDataSource;
	messagingDataSource?: MessagingDataSource;
};

export type DataSourcesFactory = {
	withPassport: (passport: Domain.Passport, messagingService: MessagingService) => DataSources;
	withSystemPassport: () => DataSources;
};

export const DataSourcesFactoryImpl = (
	models: ModelsContext,
): DataSourcesFactory => {
	const withPassport = (passport: Domain.Passport, messagingService: MessagingService): DataSources => {
		return {
			domainDataSource: DomainDataSourceImplementation(models, passport),
			readonlyDataSource: ReadonlyDataSourceImplementation(models, passport),
			messagingDataSource: MessagingDataSourceImplementation(messagingService, passport),
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
		};
	};

	return {
		withPassport: withPassport,
		withSystemPassport: withSystemPassport,
	};
};
