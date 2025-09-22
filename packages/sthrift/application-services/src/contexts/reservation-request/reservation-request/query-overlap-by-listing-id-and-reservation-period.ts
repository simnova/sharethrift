import type { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';

export interface ReservationRequestQueryOverlapByListingIdAndReservationPeriodCommand {
    listingId: string;
    reservationPeriodStart: Date;
    reservationPeriodEnd: Date;
    fields?: string[];
};

export const queryOverlapByListingIdAndReservationPeriod = (
    dataSources: DataSources,
) => {
    return async (
        command: ReservationRequestQueryOverlapByListingIdAndReservationPeriodCommand,
    ): Promise<Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[]> => {
        return await dataSources.readonlyDataSource.ReservationRequest.ReservationRequest.ReservationRequestReadRepo.getOverlapActiveReservationRequestsForListing(
            command.listingId,
            command.reservationPeriodStart,
            command.reservationPeriodEnd,
            { fields: command.fields }
        )
    }
}