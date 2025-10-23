import { Domain, type DomainDataSource } from '@sthrift/domain';
import type { ModelsContext } from '../models-context.ts';
import { DomainDataSourceImplementation } from './domain/index.ts';
import {
	type ReadonlyDataSource,
	ReadonlyDataSourceImplementation,
} from './readonly/index.ts';

export type DataSources = {
	domainDataSource: DomainDataSource;
	readonlyDataSource: ReadonlyDataSource;
};

export type DataSourcesFactory = {
	withPassport: (passport: Domain.Passport) => DataSources;
	withSystemPassport: () => DataSources;
};

export const DataSourcesFactoryImpl = (
	models: ModelsContext,
): DataSourcesFactory => {
	const withPassport = (passport: Domain.Passport): DataSources => {
		return {
			domainDataSource: DomainDataSourceImplementation(models, passport),
			readonlyDataSource: ReadonlyDataSourceImplementation(models, passport),
		};
	};

	const withSystemPassport = (): DataSources => {
		// TODO: SECURITY - Implement proper admin role-based permissions when admin role system is in place
		// The system passport should grant elevated permissions based on verified admin role
		// For now, using basic system permissions - expand these based on actual admin capabilities needed
		const systemPassport = Domain.PassportFactory.forSystem({
			// Listing domain permissions
			canCreateItemListing: true,
			canUpdateItemListing: true,
			canDeleteItemListing: true,
			canViewItemListing: true,
			canPublishItemListing: true,
			canUnpublishItemListing: true,
			// TODO: Add listing admin permissions when implemented
			// canBlockListings: true,
			// canUnblockListings: true,
			// canRemoveListings: true,
			// canViewListingReports: true,
			
			// TODO: Add user admin permissions when implemented
			// canCreateUser: true,
			// canBlockUsers: true,
			// canUnblockUsers: true,
			// canViewUserReports: true,
			
			// System flags
			isEditingOwnAccount: false,
			isSystemAccount: true,
		});
		return {
			domainDataSource: DomainDataSourceImplementation(models, systemPassport),
			readonlyDataSource: ReadonlyDataSourceImplementation(
				models,
				systemPassport,
			),
		};
	};

	return {
		withPassport: withPassport,
		withSystemPassport: withSystemPassport,
	};
};
