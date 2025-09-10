import type { Domain } from '@sthrift/api-domain';
import type { DataSources } from '@sthrift/api-persistence';

export interface ReservationRequestQueryActiveByReserverIdCommand {
    reserverId: string;
    fields?: string[];
};

export const queryActiveByReserverId = (
    dataSources: DataSources,
) => {
    return async (
        command: ReservationRequestQueryActiveByReserverIdCommand,
    ): Promise<Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[]> => {
        return await dataSources.readonlyDataSource.ReservationRequest.ReservationRequest.ReservationRequestReadRepo.getActiveByReserverIdWithListingWithSharer(
            command.reserverId,
            { fields: command.fields }
        )
    }
}