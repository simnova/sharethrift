import { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import type { EventBusSeededwork } from '@cellix/event-bus-seedwork-node';
import type { DomainDataSource } from '@ocom/api-domain';
import { ReservationRequestRepository } from './reservation-request.repository.ts';
import { ReservationRequestDomainAdapter } from './reservation-request.domain-adapter.ts';

export const getReservationRequestUnitOfWork = (
	initializedService: MongooseSeedwork.MongooseContextFactory,
	inProcEventBusInstance: EventBusSeededwork.EventBusInstance,
	nodeEventBusInstance: EventBusSeededwork.NodeEventBusInstance,
) => {
	// [NN] [ESLINT] disabling the ESLint rule here to ensure that the initializedService is checked for null or undefined
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	if (!initializedService?.service) {
		throw new Error('MongooseSeedwork.MongooseContextFactory is required');
	}

	const repository = new ReservationRequestRepository(initializedService);
	const domainAdapter = new ReservationRequestDomainAdapter(initializedService);

	return new MongooseSeedwork.MongoUnitOfWork(
		inProcEventBusInstance,
		nodeEventBusInstance,
		null as any, // model - will be set when Mongoose models are properly connected
		domainAdapter,
		ReservationRequestRepository,
	);
};