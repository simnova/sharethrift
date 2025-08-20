import { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import type { Domain } from '@sthrift/api-domain';
import type { Model } from 'mongoose';
import { ReservationRequestConverter } from './reservation-request.domain-adapter.ts';
import { ReservationRequestRepository } from './reservation-request.repository.ts';
import type { Models } from '@sthrift/api-data-sources-mongoose-models';
import type { DomainSeedwork } from '@cellix/domain-seedwork';

export const getReservationRequestUnitOfWork = (
	reservationRequestModel: Model<Models.ReservationRequest.ReservationRequest>,
	inProcEventBusInstance: DomainSeedwork.EventBus,
	nodeEventBusInstance: DomainSeedwork.EventBus,
): Domain.Contexts.ReservationRequestUnitOfWork => {
	const unitOfWork = new MongooseSeedwork.MongoUnitOfWork(
		inProcEventBusInstance,
		nodeEventBusInstance,
		reservationRequestModel,
		new ReservationRequestConverter(),
		ReservationRequestRepository,
	);
	return unitOfWork;
};
// should return MongooseSeedwork.getInitializedUnitOfWork(unitOfWork, passport); when seedwork is updated