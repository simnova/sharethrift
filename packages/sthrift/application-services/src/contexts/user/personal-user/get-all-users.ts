import type { DataSources } from '@sthrift/persistence';
import type { Domain } from '@sthrift/domain';

export interface GetAllUsersCommand {
	page: number;
	pageSize: number;
	searchText?: string | undefined;
	statusFilters?: string[] | undefined;
	sorter?: { field: string; order: string } | undefined;
}

export interface PersonalUserPageResult {
	items: Domain.Contexts.User.PersonalUser.PersonalUserEntityReference[];
	total: number;
	page: number;
	pageSize: number;
}

export const getAllUsers = (datasources: DataSources) => {
	return async (
		command: GetAllUsersCommand,
	): Promise<PersonalUserPageResult> => {
		const skip = (command.page - 1) * command.pageSize;
		const limit = command.pageSize;
		
		// Use the read repository for queries
		const users = await datasources.readonlyDataSource.User.PersonalUser.PersonalUserReadRepo.getAll({
			limit,
			skip,
			// TODO: Add search/filter logic here based on command.searchText and command.statusFilters
		});
		
		// TODO: Implement search and filtering logic
		// TODO: Get total count for pagination (this just returns the page count, not total)
		
		return {
			items: users,
			total: users.length, // TODO: Get actual total count from database
			page: command.page,
			pageSize: command.pageSize,
		};
	};
};