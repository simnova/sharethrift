import { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import type { Domain } from '@sthrift/api-domain';
import type { Models } from '@sthrift/api-data-sources-mongoose-models';
import {
	InProcEventBusInstance,
	NodeEventBusInstance,
} from '@cellix/event-bus-seedwork-node';
import { ReservationRequestConverter } from './reservation-request.domain-adapter.ts';
import { ReservationRequestRepository } from './reservation-request.repository.ts';

export const getReservationRequestUnitOfWork = (
	reservationRequestModel: Models.ReservationRequestModelType,
): Domain.Contexts.ReservationRequestUnitOfWork => {
	const unitOfWork = new MongooseSeedwork.MongoUnitOfWork(
		InProcEventBusInstance,
		NodeEventBusInstance,
		reservationRequestModel,
		new ReservationRequestConverter(),
		ReservationRequestRepository,
	);
	return unitOfWork;
};
// should return gMongooseSeedwork.getInitializedUnitOfWork(unitOfWork, passport); when seedowrk is updated