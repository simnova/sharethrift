import { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import { EventBusSeedwork } from '@cellix/event-bus-seedwork-node';
import {
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
	_inProcEventBusInstance: EventBusSeedwork.InProcEventBusInstance,
	_nodeEventBusInstance: EventBusSeedwork.NodeEventBusInstance,
) => {
	if (!mongooseContextFactory?.service) {
		throw new Error('MongooseContextFactory service is required for ReservationRequest UoW');
	}

	const mongoContext = mongooseContextFactory.getContext();
	const reservationRequestModel = mongoContext.ReservationRequestModel;

	if (!reservationRequestModel) {
		throw new Error('ReservationRequestModel is not available in Mongoose context');
	}

	const repository: ReservationRequestRepository = new ReservationRequestRepositoryImpl();

	// TODO: Implement proper MongoUnitOfWork integration
	const uow: ReservationRequestUnitOfWork = {
		reservationRequestRepository: repository,
		// Add other required UoW methods as needed
	} as ReservationRequestUnitOfWork;

	return uow;
};