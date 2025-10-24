import { Domain, type DomainDataSource } from '@sthrift/domain';
import type { IMessagingService } from '@cellix/messaging';
import type { ModelsContext } from '../models-context.ts';
import { DomainDataSourceImplementation } from './domain/index.ts';
import {
	type ReadonlyDataSource,
	ReadonlyDataSourceImplementation,
} from './readonly/index.ts';
import {
	type TwilioDataSource,
	TwilioDataSourceImplementation,
} from './twilio/index.ts';

export type DataSources = {
	domainDataSource: DomainDataSource;
	readonlyDataSource: ReadonlyDataSource;
	twilioDataSource?: TwilioDataSource;
};

export type DataSourcesFactory = {
	withPassport: (passport: Domain.Passport, messagingService?: IMessagingService) => DataSources;
	withSystemPassport: (messagingService?: IMessagingService) => DataSources;
};

export const DataSourcesFactoryImpl = (
	models: ModelsContext,
): DataSourcesFactory => {
	const withPassport = (passport: Domain.Passport, messagingService?: IMessagingService): DataSources => {
		const dataSources: DataSources = {
			domainDataSource: DomainDataSourceImplementation(models, passport),
			readonlyDataSource: ReadonlyDataSourceImplementation(models, passport),
		};

		// Only include twilioDataSource if messagingService is provided
		if (messagingService) {
			dataSources.twilioDataSource = TwilioDataSourceImplementation(messagingService, passport);
		}

		return dataSources;
	};

	const withSystemPassport = (messagingService?: IMessagingService): DataSources => {
		const systemPassport = Domain.PassportFactory.forSystem({
			// canManageMembers: true,
			// canManageEndUserRolesAndPermissions: true,
		});

		const dataSources: DataSources = {
			domainDataSource: DomainDataSourceImplementation(models, systemPassport),
			readonlyDataSource: ReadonlyDataSourceImplementation(models, systemPassport),
		};

		// Only include twilioDataSource if messagingService is provided
		if (messagingService) {
			dataSources.twilioDataSource = TwilioDataSourceImplementation(messagingService, systemPassport);
		}

		return dataSources;
	};

	return {
		withPassport: withPassport,
		withSystemPassport: withSystemPassport,
	};
};
