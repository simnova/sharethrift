import type { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';

export interface ReservationRequestQueryPastByReserverIdCommand {
	reserverId: string;
	fields?: string[];
}

export const queryPastByReserverId = (dataSources: DataSources) => {
	return async (
		command: ReservationRequestQueryPastByReserverIdCommand,
	): Promise<
		Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[]
	> => {
		return await dataSources.readonlyDataSource.ReservationRequest.ReservationRequest.ReservationRequestReadRepo.getPastByReserverIdWithListingWithSharer(
			command.reserverId,
			{ fields: command.fields },
		);
	};
};
