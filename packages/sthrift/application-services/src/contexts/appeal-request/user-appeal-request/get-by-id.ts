import type { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';

export interface GetUserAppealRequestByIdCommand {
	id: string;
}

export const getById = (dataSources: DataSources) => {
	return async (
		command: GetUserAppealRequestByIdCommand,
	): Promise<Domain.Contexts.AppealRequest.UserAppealRequest.UserAppealRequestEntityReference | null> => {
		return await dataSources.readonlyDataSource.AppealRequest.UserAppealRequest.UserAppealRequestReadRepo.getById(
			command.id,
		);
	};
};
