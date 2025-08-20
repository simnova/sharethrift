import type { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import { getReservationRequestUnitOfWork } from './reservation-request.uow.ts';
import { Models } from '@sthrift/api-data-sources-mongoose-models';
import type { Domain } from '@sthrift/api-domain';
import type { DomainSeedwork } from '@cellix/domain-seedwork';

export const ReservationRequestPersistence = (
	initializedService: MongooseSeedwork.MongooseContextFactory,
) => {
	return {
		getReservationRequestUnitOfWork: (
			inProcEventBusInstance: DomainSeedwork.EventBus,
			nodeEventBusInstance: DomainSeedwork.EventBus,
		): Domain.Contexts.ReservationRequestUnitOfWork => {
			// Get the model using the factory pattern
			const model = Models.ReservationRequest.ReservationRequestModelFactory(initializedService);
			
			return getReservationRequestUnitOfWork(
				model,
				inProcEventBusInstance,
				nodeEventBusInstance,
			);
		},
	};
};