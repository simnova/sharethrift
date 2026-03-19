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
	return (
		command: GetAllUsersCommand,
	): Promise<PersonalUserPageResult> => {
		return datasources.readonlyDataSource.User.PersonalUser.PersonalUserReadRepo.getAllUsers(
			{
				page: command.page,
				pageSize: command.pageSize,
				...(command.searchText && { searchText: command.searchText }),
				...(command.statusFilters && { statusFilters: command.statusFilters }),
				...(command.sorter && {
					sorter: {
						field: command.sorter.field,
						order:
							command.sorter.order === 'ascend' ||
							command.sorter.order === 'descend'
								? command.sorter.order
								: 'ascend',
					},
				}),
			},
		);
	};
};