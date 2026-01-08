import type { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';

export interface ReservationRequestQueryListingRequestsBySharerIdCommand {
	sharerId: string;
	fields?: string[];
}

// Temporary implementation backed by mock data in persistence read repository
export const queryListingRequestsBySharerId = (dataSources: DataSources) => {
	return async (
		command: ReservationRequestQueryListingRequestsBySharerIdCommand,
	): Promise<
		Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[]
	> => {
		return await dataSources.readonlyDataSource.ReservationRequest.ReservationRequest.ReservationRequestReadRepo.getListingRequestsBySharerId(
			command.sharerId,
			{ fields: command.fields },
		);
	};
};
