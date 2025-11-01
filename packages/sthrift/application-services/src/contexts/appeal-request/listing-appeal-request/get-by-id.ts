import type { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';

export interface GetListingAppealRequestByIdCommand {
	id: string;
}

export const getById = (dataSources: DataSources) => {
	return async (
		command: GetListingAppealRequestByIdCommand,
	): Promise<Domain.Contexts.AppealRequest.ListingAppealRequest.ListingAppealRequestEntityReference | null> => {
		return await dataSources.readonlyDataSource.AppealRequest.ListingAppealRequest.ListingAppealRequestReadRepo.getById(
			command.id,
		);
	};
};
