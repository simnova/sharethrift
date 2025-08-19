import type { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import type { DomainDataSource } from '@sthrift/api-domain';
import { DomainSeedwork } from '@cellix/domain-seedwork';
import { getReservationRequestDomainAdapter } from '../reservation-requests/index.js';

export const DomainDataSourceImplementation = (
	initializedService: MongooseSeedwork.MongooseContextFactory,
): DomainDataSource => {
	// Create event bus instances for domain operations
	const inProcEventBus = DomainSeedwork.InProcEventBusInstance;
	const nodeEventBus = DomainSeedwork.NodeEventBusInstance;
	
	// Create domain adapters for all bounded contexts
	const reservationRequestDomainAdapter = getReservationRequestDomainAdapter(
		initializedService,
		inProcEventBus,
		nodeEventBus
	);

	return {
		reservationRequestDomainAdapter
	};
};
