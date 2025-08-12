import type { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import { getReservationRequestUnitOfWork } from './reservation-request.uow.ts';

export const ReservationRequestPersistence = (
	initializedService: MongooseSeedwork.MongooseContextFactory,
) => {
	return {
		getReservationRequestUnitOfWork: (
			inProcEventBusInstance: unknown,
			nodeEventBusInstance: unknown,
		) => {
			return getReservationRequestUnitOfWork(
				initializedService,
				inProcEventBusInstance,
				nodeEventBusInstance,
			);
		},
	};
};