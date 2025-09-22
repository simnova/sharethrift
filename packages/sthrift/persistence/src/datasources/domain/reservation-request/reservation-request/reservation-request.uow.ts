import { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import type { Domain } from '@sthrift/api-domain';
import type { Model } from 'mongoose';
import { ReservationRequestConverter } from './reservation-request.domain-adapter.ts';
import { ReservationRequestRepository } from './reservation-request.repository.ts';
import type { Models } from '@sthrift/api-data-sources-mongoose-models';
import {
	InProcEventBusInstance,
	NodeEventBusInstance,
} from '@cellix/event-bus-seedwork-node';


export const getReservationRequestUnitOfWork = (
	reservationRequestModel: Model<Models.ReservationRequest.ReservationRequest>,
	passport: Domain.Passport
): Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestUnitOfWork => {
	const unitOfWork = new MongooseSeedwork.MongoUnitOfWork(
		InProcEventBusInstance,
		NodeEventBusInstance,
		reservationRequestModel,
		new ReservationRequestConverter(),
		ReservationRequestRepository,
	);

	return MongooseSeedwork.getInitializedUnitOfWork(unitOfWork, passport); // For when the seedwork is updated
};
