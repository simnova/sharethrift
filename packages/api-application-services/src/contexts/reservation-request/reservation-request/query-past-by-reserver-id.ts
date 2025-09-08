import type { Domain } from '@sthrift/api-domain';
import type { DataSources } from '@sthrift/api-persistence';

export interface ReservationRequestQueryPastByReserverIdCommand {
    reserverId: string;
    fields?: string[];
};

export const queryPastByReserverId = (
    dataSources: DataSources,
) => {
    return async (
        command: ReservationRequestQueryPastByReserverIdCommand,
    ): Promise<Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[]> => {
        return await dataSources.readonlyDataSource.ReservationRequest.ReservationRequest.ReservationRequestReadRepo.getPastByReserverIdWithListingWithSharer(
            command.reserverId,
            { fields: command.fields }
        )
    }
}