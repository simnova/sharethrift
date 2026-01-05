import type { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';
import { type ReservationRequestQueryActiveByReserverIdCommand, queryActiveByReserverId } from './query-active-by-reserver-id.ts';
import { type ReservationRequestQueryPastByReserverIdCommand, queryPastByReserverId } from './query-past-by-reserver-id.ts';
import { type ReservationRequestQueryActiveByReserverIdAndListingIdCommand, queryActiveByReserverIdAndListingId } from './query-active-by-reserver-id-and-listing-id.ts';
import { type ReservationRequestQueryByIdCommand, queryById } from './query-by-id.ts';
import { type ReservationRequestCreateCommand, create } from './create.ts';
import { type ReservationRequestQueryOverlapByListingIdAndReservationPeriodCommand, queryOverlapByListingIdAndReservationPeriod } from './query-overlap-by-listing-id-and-reservation-period.ts';
import { type ReservationRequestQueryActiveByListingIdCommand, queryActiveByListingId } from './query-active-by-listing-id.ts';
import { type ListingRequestPage, type ReservationRequestQueryListingRequestsBySharerIdCommand, queryListingRequestsBySharerId } from './query-listing-requests-by-sharer-id.ts';

export interface ReservationRequestApplicationService {
    queryById: (command: ReservationRequestQueryByIdCommand) => Promise<Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference | null>,
    queryActiveByReserverId: (command: ReservationRequestQueryActiveByReserverIdCommand) => Promise<Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[]>,
    queryPastByReserverId: (command: ReservationRequestQueryPastByReserverIdCommand) => Promise<Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[]>,
    queryActiveByReserverIdAndListingId: (command: ReservationRequestQueryActiveByReserverIdAndListingIdCommand) => Promise<Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference | null>,
    queryOverlapByListingIdAndReservationPeriod: (command: ReservationRequestQueryOverlapByListingIdAndReservationPeriodCommand) => Promise<Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[]>,
    queryActiveByListingId: (command: ReservationRequestQueryActiveByListingIdCommand) => Promise<Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[]>,
	queryListingRequestsBySharerId: (command: ReservationRequestQueryListingRequestsBySharerIdCommand) => Promise<ListingRequestPage>,
    create: (command: ReservationRequestCreateCommand) => Promise<Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference>,
}

export const ReservationRequest = (
    dataSources: DataSources
): ReservationRequestApplicationService => {
    return {
        queryById: queryById(dataSources),
        queryActiveByReserverId: queryActiveByReserverId(dataSources),
        queryPastByReserverId: queryPastByReserverId(dataSources),
        queryActiveByReserverIdAndListingId: queryActiveByReserverIdAndListingId(dataSources),
        queryOverlapByListingIdAndReservationPeriod: queryOverlapByListingIdAndReservationPeriod(dataSources),
        queryActiveByListingId: queryActiveByListingId(dataSources),
		queryListingRequestsBySharerId: queryListingRequestsBySharerId(dataSources),
        create: create(dataSources),
    }
}