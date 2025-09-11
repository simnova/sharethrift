import type { Domain } from '@sthrift/api-domain';
import type { DataSources } from '@sthrift/api-persistence';

export interface ReservationRequestQueryActiveByReserverIdAndListingIdCommand {
    reserverId: string;
    listingId: string;
    fields?: string[];
};

export const queryActiveByReserverIdAndListingId = (
    dataSources: DataSources,
) => {
    return async (
        command: ReservationRequestQueryActiveByReserverIdAndListingIdCommand,
    ): Promise<Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference | null> => {
        return await dataSources.readonlyDataSource.ReservationRequest.ReservationRequest.ReservationRequestReadRepo.getActiveByReserverIdAndListingId(
            command.reserverId,
            command.listingId,
            { fields: command.fields }
        )
    }
}