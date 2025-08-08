import type { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import type { InProcEventBusInstance, NodeEventBusInstance } from '@cellix/event-bus-seedwork-node';
import type { DomainDataSource } from '@ocom/api-domain';
import { ReservationContextPersistence } from './reservation/index.ts';

export const Persistence = (
	mongooseContextFactory: MongooseSeedwork.MongooseContextFactory,
	inProcEventBusInstance: typeof InProcEventBusInstance,
	nodeEventBusInstance: typeof NodeEventBusInstance,
): DomainDataSource => {
	// [NN] [ESLINT] disabling the ESLint rule here to ensure that the mongooseContextFactory is checked for null or undefined
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	if (!mongooseContextFactory?.service) {
		throw new Error('MongooseSeedwork.MongooseContextFactory is required');
	}

	const reservationContext = ReservationContextPersistence(
		mongooseContextFactory,
		inProcEventBusInstance,
		nodeEventBusInstance
	);

	const dataSource: DomainDataSource = {
		domainContexts: {
			reservation: reservationContext,
		},
	};
	return dataSource;
};
