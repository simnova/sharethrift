import type { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import type { InProcEventBusInstance, NodeEventBusInstance } from '@cellix/event-bus-seedwork-node';
import type {
	ReservationRequestUnitOfWork,
	ReservationRequestRepository,
} from '@ocom/api-domain';
import { ReservationRequestRepositoryImpl } from './reservation-request.repository.ts';

/**
 * Creates a Unit of Work factory function for ReservationRequest operations.
 * 
 * @param mongooseContextFactory - Factory for creating Mongoose context
 * @param inProcEventBusInstance - In-process event bus for domain events
 * @param nodeEventBusInstance - Node event bus for integration events
 * @returns Factory function that creates ReservationRequest Unit of Work instances
 */
export const getReservationRequestUnitOfWork = (
	mongooseContextFactory: MongooseSeedwork.MongooseContextFactory,
	_inProcEventBusInstance: typeof InProcEventBusInstance,
	_nodeEventBusInstance: typeof NodeEventBusInstance,
) => {
	if (!mongooseContextFactory?.service) {
		throw new Error('MongooseContextFactory service is required for ReservationRequest UoW');
	}

	// TODO: Get the actual mongoose context once models are properly integrated
	// const mongoContext = mongooseContextFactory.getContext();
	// const reservationRequestModel = mongoContext.ReservationRequestModel;

	const repository: ReservationRequestRepository = new ReservationRequestRepositoryImpl();

	// TODO: Implement proper Unit of Work with transaction support
	const uow: ReservationRequestUnitOfWork = {
		reservationRequestRepository: repository,
		withTransaction: async (_passport, func) => {
			// For now, just execute the function directly
			// In a full implementation, this would wrap in a database transaction
			await func(repository);
		},
	} as ReservationRequestUnitOfWork;

	return uow;
};