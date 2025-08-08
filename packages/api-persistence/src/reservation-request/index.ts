import type { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import type { NodeEventBusInstance, InProcEventBusInstance } from '@cellix/event-bus-seedwork-node';
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