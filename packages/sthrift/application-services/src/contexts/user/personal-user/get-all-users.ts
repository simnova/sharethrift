import type { DataSources } from '@sthrift/persistence';
import type { Domain } from '@sthrift/domain';

export interface GetAllUsersCommand {
	page: number;
	pageSize: number;
	searchText?: string;
	statusFilters?: string[];
	sorter?: { field: string; order: string };
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
		// Use the read repository for queries
		const users = await datasources.readonlyDataSource.User.PersonalUser.getAll({
			limit: command.pageSize,
			skip: (command.page - 1) * command.pageSize,
			// Add search/filter logic here based on command.searchText and command.statusFilters
		});
		
		// TODO: Implement search and filtering logic
		// TODO: Get total count for pagination
		
		return {
			items: users,
			total: users.length, // TODO: Get actual total count
			page: command.page,
			pageSize: command.pageSize,
		};
	};
};