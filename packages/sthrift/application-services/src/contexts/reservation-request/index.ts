import type { DataSources } from '@sthrift/persistence';
import { deleteExpiredReservationRequests } from './reservation-request/delete-expired.ts';
import {
	ReservationRequest as ReservationRequestApi,
	type ReservationRequestApplicationService,
} from './reservation-request/index.ts';

export interface ReservationRequestContextApplicationService {
	ReservationRequest: ReservationRequestApplicationService & {
		deleteExpiredReservationRequests: () => Promise<number>;
	};
}

export const ReservationRequest = (
	dataSources: DataSources,
): ReservationRequestContextApplicationService => {
	return {
		ReservationRequest: {
			...ReservationRequestApi(dataSources),
			deleteExpiredReservationRequests:
				deleteExpiredReservationRequests(dataSources),
		},
	};
};
