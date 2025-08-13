import { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import type { Domain } from '@ocom/api-domain';
import type { Models } from '@ocom/api-data-sources-mongoose-models';
import {
	InProcEventBusInstance,
	NodeEventBusInstance,
} from '@cellix/event-bus-seedwork-node';
import { ReservationRequestConverter } from './reservation-request.domain-adapter.ts';
import { ReservationRequestRepository } from './reservation-request.repository.ts';

export const getReservationRequestUnitOfWork = (
	reservationRequestModel: Models.ReservationRequestModelType,
): Domain.Contexts.ReservationRequestUnitOfWork => {
	return new MongooseSeedwork.MongoUnitOfWork(
		InProcEventBusInstance,
		NodeEventBusInstance,
		reservationRequestModel,
		new ReservationRequestConverter(),
		ReservationRequestRepository,
	);
};
