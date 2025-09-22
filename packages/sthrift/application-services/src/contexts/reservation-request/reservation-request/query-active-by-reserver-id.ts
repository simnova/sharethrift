import type { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';

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