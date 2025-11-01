import type { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';

export interface GetAllUserAppealRequestsCommand {
	page: number;
	pageSize: number;
	stateFilters?: string[];
	sorter?: { field: string; order: string };
}

export interface UserAppealRequestPageResult {
	items: Domain.Contexts.AppealRequest.UserAppealRequest.UserAppealRequestEntityReference[];
	total: number;
	page: number;
	pageSize: number;
}

export const getAll = (dataSources: DataSources) => {
	return async (
		command: GetAllUserAppealRequestsCommand,
	): Promise<UserAppealRequestPageResult> => {
		return await dataSources.readonlyDataSource.AppealRequest.UserAppealRequest.UserAppealRequestReadRepo.getAll(
			{
				page: command.page,
				pageSize: command.pageSize,
				...(command.stateFilters && { stateFilters: command.stateFilters }),
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
