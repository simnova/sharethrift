import type { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';

export interface ReservationRequestQueryActiveByListingIdCommand {
    listingId: string;
    fields?: string[];
}

export const queryActiveByListingId = (
    dataSources: DataSources,
) => {
    return async (
        command: ReservationRequestQueryActiveByListingIdCommand,
    ): Promise<Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[]> => {
        return await dataSources.readonlyDataSource.ReservationRequest.ReservationRequest.ReservationRequestReadRepo.getActiveByListingId(
            command.listingId,
            { fields: command.fields }
        )
    }
}