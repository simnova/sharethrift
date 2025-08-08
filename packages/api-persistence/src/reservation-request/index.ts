import type { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import type { EventBusSeededwork } from '@cellix/event-bus-seedwork-node';
import { getReservationRequestUnitOfWork } from './reservation-request.uow.ts';

export const ReservationRequestPersistence = (
	initializedService: MongooseSeedwork.MongooseContextFactory,
) => {
	return {
		getReservationRequestUnitOfWork: (
			inProcEventBusInstance: EventBusSeededwork.EventBusInstance,
			nodeEventBusInstance: EventBusSeededwork.NodeEventBusInstance,
		) => {
			return getReservationRequestUnitOfWork(
				initializedService,
				inProcEventBusInstance,
				nodeEventBusInstance,
			);
		},
	};
};