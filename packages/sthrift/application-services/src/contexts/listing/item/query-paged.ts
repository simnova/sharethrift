import type { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';

export interface ItemListingQueryPagedCommand {
	page: number;
	pageSize: number;
	searchText?: string;
	statusFilters?: string[];
	sharerId?: string;
	sorter?: { field: string; order: 'ascend' | 'descend' };
}

export const queryPaged = (dataSources: DataSources) => {
	return async (
		command: ItemListingQueryPagedCommand,
	): Promise<{
		items: Domain.Contexts.Listing.ItemListing.ItemListingEntityReference[];
		total: number;
		page: number;
		pageSize: number;
	}> => {
		const { page, pageSize, searchText, statusFilters, sharerId, sorter } =
			command;
		const args: {
			page: number;
			pageSize: number;
			searchText?: string;
			statusFilters?: string[];
			sharerId?: string;
			sorter?: { field: string; order: 'ascend' | 'descend' };
		} = { page, pageSize };
		if (searchText !== undefined) {
			args.searchText = searchText;
		}
		if (statusFilters !== undefined) {
			args.statusFilters = statusFilters;
		}
		if (sharerId !== undefined) {
			args.sharerId = sharerId;
		}
		if (sorter !== undefined) {
			args.sorter = sorter;
		}

		return await dataSources.readonlyDataSource.Listing.ItemListing.ItemListingReadRepo.getPaged(
			args,
		);
	};
};
