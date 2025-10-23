import { Domain, type DomainDataSource } from '@sthrift/domain';
import type { ServiceTwilio } from '@sthrift/service-twilio';
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
	withPassport: (passport: Domain.Passport, twilioService?: ServiceTwilio) => DataSources;
	withSystemPassport: (twilioService?: ServiceTwilio) => DataSources;
};

export const DataSourcesFactoryImpl = (
	models: ModelsContext,
): DataSourcesFactory => {
	const withPassport = (passport: Domain.Passport, twilioService?: ServiceTwilio): DataSources => {
		const dataSources: DataSources = {
			domainDataSource: DomainDataSourceImplementation(models, passport),
			readonlyDataSource: ReadonlyDataSourceImplementation(models, passport),
		};

		// Only include twilioDataSource if twilioService is provided
		if (twilioService) {
			dataSources.twilioDataSource = TwilioDataSourceImplementation(twilioService, passport);
		}

		return dataSources;
	};

	const withSystemPassport = (twilioService?: ServiceTwilio): DataSources => {
		const systemPassport = Domain.PassportFactory.forSystem({
			// canManageMembers: true,
			// canManageEndUserRolesAndPermissions: true,
		});

		const dataSources: DataSources = {
			domainDataSource: DomainDataSourceImplementation(models, systemPassport),
			readonlyDataSource: ReadonlyDataSourceImplementation(models, systemPassport),
		};

		// Only include twilioDataSource if twilioService is provided
		if (twilioService) {
			dataSources.twilioDataSource = TwilioDataSourceImplementation(twilioService, systemPassport);
		}

		return dataSources;
	};

	return {
		withPassport: withPassport,
		withSystemPassport: withSystemPassport,
	};
};
