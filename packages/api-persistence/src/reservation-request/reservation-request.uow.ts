import { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import { ReservationRequestRepository } from './reservation-request.repository.ts';
import { ReservationRequestDomainAdapter } from './reservation-request.domain-adapter.ts';

export const getReservationRequestUnitOfWork = (
	initializedService: MongooseSeedwork.MongooseContextFactory,
	_inProcEventBusInstance: unknown,
	_nodeEventBusInstance: unknown,
) => {
	// [NN] [ESLINT] disabling the ESLint rule here to ensure that the initializedService is checked for null or undefined
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	if (!initializedService?.service) {
		throw new Error('MongooseSeedwork.MongooseContextFactory is required');
	}

	// For now, return a simple mock until we can properly implement the UoW pattern
	// The proper implementation would need the actual Mongoose models and proper adapter setup
	return {
		// Basic UoW interface
		commit: async () => { /* Implementation needed */ },
		rollback: async () => { /* Implementation needed */ },
		getRepository: () => new ReservationRequestRepository(initializedService),
		getDomainAdapter: () => new ReservationRequestDomainAdapter(/* needs proper document parameter */),
	};
};