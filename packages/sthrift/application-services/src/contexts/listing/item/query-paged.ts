import type { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';

interface ItemListingQueryPagedCommand {
	page: number;
	pageSize: number;
	searchText?: string;
	statusFilters?: string[];
	sharerId?: string;
	sorter?: { field: string; order: 'ascend' | 'descend' };
	isAdmin?: boolean;
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
		// Build query args from command, only including defined values
		const args: {
			page: number;
			pageSize: number;
			searchText?: string;
			statusFilters?: string[];
			sharerId?: string;
			sorter?: { field: string; order: 'ascend' | 'descend' };
			isAdmin?: boolean;
		} = { 
			page: command.page, 
			pageSize: command.pageSize 
		};

		if (command.searchText) {
			args.searchText = command.searchText;
		}
		
		if (command.statusFilters) {
			args.statusFilters = command.statusFilters;
		}
		
		if (command.sharerId) {
			args.sharerId = command.sharerId;
		}
		if (command.sorter) {
			args.sorter = command.sorter;
		}
		if (command.isAdmin) {
			args.isAdmin = command.isAdmin;
		}

		return await dataSources.readonlyDataSource.Listing.ItemListing.ItemListingReadRepo.getPaged(args);
	};
};
