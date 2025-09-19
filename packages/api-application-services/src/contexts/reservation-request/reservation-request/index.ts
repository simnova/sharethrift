import type { Domain } from '@sthrift/api-domain';
import type { DataSources } from '@sthrift/api-persistence';
import { type ReservationRequestQueryActiveByReserverIdCommand, queryActiveByReserverId } from './query-active-by-reserver-id.ts';
import { type ReservationRequestQueryPastByReserverIdCommand, queryPastByReserverId } from './query-past-by-reserver-id.ts';
import { type ReservationRequestQueryActiveByReserverIdAndListingIdCommand, queryActiveByReserverIdAndListingId } from './query-active-by-reserver-id-and-listing-id.ts';
import { type ReservationRequestQueryByIdCommand, queryById } from './query-by-id.ts';
import { type ReservationRequestCreateCommand, create } from './create.ts';
import { type ReservationRequestQueryOverlapByListingIdAndReservationPeriodCommand, queryOverlapByListingIdAndReservationPeriod } from './query-overlap-by-listing-id-and-reservation-period.ts';
import { type ReservationRequestQueryActiveByListingIdCommand, queryActiveByListingId } from './query-active-by-listing-id.ts';

export interface ReservationRequestApplicationService {
    queryById: (command: ReservationRequestQueryByIdCommand) => Promise<Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference | null>,
    queryActiveByReserverId: (command: ReservationRequestQueryActiveByReserverIdCommand) => Promise<Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[]>,
    queryPastByReserverId: (command: ReservationRequestQueryPastByReserverIdCommand) => Promise<Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[]>,
    queryActiveByReserverIdAndListingId: (command: ReservationRequestQueryActiveByReserverIdAndListingIdCommand) => Promise<Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference | null>,
    queryOverlapByListingIdAndReservationPeriod: (command: ReservationRequestQueryOverlapByListingIdAndReservationPeriodCommand) => Promise<Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[]>,
    queryActiveByListingId: (command: ReservationRequestQueryActiveByListingIdCommand) => Promise<Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[]>,
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
        create: create(dataSources),
    }
}