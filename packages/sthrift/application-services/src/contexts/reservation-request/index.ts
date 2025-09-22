import type { DataSources } from '@sthrift/persistence';
import { ReservationRequest as ReservationRequestApi, type ReservationRequestApplicationService } from './reservation-request/index.ts';

export interface ReservationRequestContextApplicationService {
    ReservationRequest: ReservationRequestApplicationService;
}

export const ReservationRequest = (
    dataSources: DataSources
): ReservationRequestContextApplicationService => {
    return {
        ReservationRequest: ReservationRequestApi(dataSources),
    }
}