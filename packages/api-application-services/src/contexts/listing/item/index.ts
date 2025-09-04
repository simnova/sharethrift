import type { Domain } from '@sthrift/api-domain';
import type { DataSources } from '@sthrift/api-persistence';
import { type ItemListingCreateCommand, create } from './create.ts';
import { type ItemListingQueryByIdCommand, queryById } from './query-by-id.ts';
import {
	type ItemListingQueryByPersonalUserCommand,
	queryByPersonalUser,
} from './query-by-personal-user.ts';

export interface ItemListingApplicationService {
	create: (
		command: ItemListingCreateCommand,
	) => Promise<Domain.Contexts.Listing.ItemListing.ItemListingEntityReference>;
	queryById: (
		command: ItemListingQueryByIdCommand,
	) => Promise<Domain.Contexts.Listing.ItemListing.ItemListingEntityReference | null>;
	queryByPersonalUser: (
		command: ItemListingQueryByPersonalUserCommand,
	) => Promise<
		Domain.Contexts.Listing.ItemListing.ItemListingEntityReference[]
	>;
}

export const ItemListing = (
	dataSources: DataSources,
): ItemListingApplicationService => {
	return {
		create: create(dataSources),
		queryById: queryById(dataSources),
		queryByPersonalUser: queryByPersonalUser(dataSources),
	};
};
