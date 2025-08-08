import { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import { EventBusSeedwork } from '@cellix/event-bus-seedwork-node';
import { getReservationRequestUnitOfWork } from './reservation-request/index.ts';

/**
 * Factory function for Reservation context persistence layer.
 * Creates Unit of Work factories for all aggregates in the Reservation bounded context.
 * 
 * @param mongooseContextFactory - Factory for creating Mongoose context
 * @param inProcEventBusInstance - In-process event bus for domain events
 * @param nodeEventBusInstance - Node event bus for integration events
 * @returns Object containing UoW factories for the Reservation context
 */
export const ReservationContextPersistence = (
	mongooseContextFactory: MongooseSeedwork.MongooseContextFactory,
	inProcEventBusInstance: EventBusSeedwork.InProcEventBusInstance,
	nodeEventBusInstance: EventBusSeedwork.NodeEventBusInstance,
) => {
	return {
		getReservationRequestUnitOfWork: () => getReservationRequestUnitOfWork(
			mongooseContextFactory,
			inProcEventBusInstance,
			nodeEventBusInstance
		),
	};
};