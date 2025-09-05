import type { Domain } from '@sthrift/api-domain';
import type { DataSources } from '@sthrift/api-persistence';
import { type ReservationRequestQueryByReserverIdCommand, queryByReserverId } from './query-by-reserver-id.ts';
import { type ReservationRequestQueryByIdCommand, queryById } from './query-by-id.ts';


export interface ReservationRequestApplicationService {
    queryById: (command: ReservationRequestQueryByIdCommand) => Promise<Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference | null>,
    queryByReserverId: (command: ReservationRequestQueryByReserverIdCommand) => Promise<Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[]>,
}

export const ReservationRequest = (
    dataSources: DataSources
): ReservationRequestApplicationService => {
    return {
        queryById: queryById(dataSources),
        queryByReserverId: queryByReserverId(dataSources),
    }
}