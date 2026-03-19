import type { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';

export interface GetAllListingAppealRequestsCommand {
	page: number;
	pageSize: number;
	stateFilters?: string[];
	sorter?: { field: string; order: string };
}

export interface ListingAppealRequestPageResult {
	items: Domain.Contexts.AppealRequest.ListingAppealRequest.ListingAppealRequestEntityReference[];
	total: number;
	page: number;
	pageSize: number;
}

export const getAll = (dataSources: DataSources) => {
	return async (
		command: GetAllListingAppealRequestsCommand,
	): Promise<ListingAppealRequestPageResult> => {
		return await dataSources.readonlyDataSource.AppealRequest.ListingAppealRequest.ListingAppealRequestReadRepo.getAll(
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
