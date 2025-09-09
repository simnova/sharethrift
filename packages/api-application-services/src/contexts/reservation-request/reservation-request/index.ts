import type { Domain } from '@sthrift/api-domain';
import type { DataSources } from '@sthrift/api-persistence';
import { type ReservationRequestQueryActiveByReserverIdCommand, queryActiveByReserverId } from './query-active-by-reserver-id.ts';
import { type ReservationRequestQueryPastByReserverIdCommand, queryPastByReserverId } from './query-past-by-reserver-id.ts';
import { type ReservationRequestQueryByIdCommand, queryById } from './query-by-id.ts';


export interface ReservationRequestApplicationService {
    queryById: (command: ReservationRequestQueryByIdCommand) => Promise<Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference | null>,
    queryActiveByReserverId: (command: ReservationRequestQueryActiveByReserverIdCommand) => Promise<Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[]>,
    queryPastByReserverId: (command: ReservationRequestQueryPastByReserverIdCommand) => Promise<Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[]>,
}

export const ReservationRequest = (
    dataSources: DataSources
): ReservationRequestApplicationService => {
    return {
        queryById: queryById(dataSources),
        queryActiveByReserverId: queryActiveByReserverId(dataSources),
        queryPastByReserverId: queryPastByReserverId(dataSources),
    }
}