import type { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import { getReservationRequestUnitOfWork } from './reservation-request.uow.ts';
import { Models } from '@sthrift/api-data-sources-mongoose-models';

export const ReservationRequestPersistence = (
	initializedService: MongooseSeedwork.MongooseContextFactory,
) => {
	return {
		getReservationRequestUnitOfWork: (
			inProcEventBusInstance: unknown,
			nodeEventBusInstance: unknown,
		) => {
			return getReservationRequestUnitOfWork(
				Models.ReservationRequestModelType,
			);
		},
	};
};