import { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import { DomainSeedwork } from '@cellix/domain-seedwork';
import type { 
	ReservationRequest, 
	ReservationRequestUnitOfWork as ReservationRequestUnitOfWorkInterface,
	ReservationRequestProps,
	ReservationRequestPassport,
	ReservationRequestDomainAdapter as ReservationRequestDomainAdapterInterface
} from '@sthrift/api-domain';
import type { 
	ReservationRequestModel
} from '@sthrift/api-data-sources-mongoose-models';
import { ReservationRequestDomainAdapter } from './reservation-request.domain-adapter.js';
import { ReservationRequestRepository } from './reservation-request.repository.js';

/**
 * Unit of Work factory function for ReservationRequest context.
 * Creates instances that coordinate transactions and repository operations.
 */
export const getReservationRequestUnitOfWork = (
	mongooseContextFactory: MongooseSeedwork.MongooseContextFactory,
	inProcEventBus: DomainSeedwork.EventBus,
	nodeEventBus: DomainSeedwork.EventBus
): ReservationRequestUnitOfWorkInterface => {
	const model = mongooseContextFactory.service.model('ReservationRequest') as typeof ReservationRequestModel;
	const domainAdapter = new ReservationRequestDomainAdapter(model);
	const repository = new ReservationRequestRepository(domainAdapter);

	return new MongooseSeedwork.MongoUnitOfWork<
		ReservationRequestPassport,
		ReservationRequestProps,
		ReservationRequest,
		ReservationRequestRepository
	>(
		repository,
		inProcEventBus,
		nodeEventBus
	) as ReservationRequestUnitOfWorkInterface;
};

/**
 * Domain adapter factory function for ReservationRequest context.
 * Provides access to Unit of Work for coordinating domain operations.
 */
export const getReservationRequestDomainAdapter = (
	mongooseContextFactory: MongooseSeedwork.MongooseContextFactory,
	inProcEventBus: DomainSeedwork.EventBus,
	nodeEventBus: DomainSeedwork.EventBus
): ReservationRequestDomainAdapterInterface => {
	const reservationRequestUnitOfWork = getReservationRequestUnitOfWork(
		mongooseContextFactory,
		inProcEventBus,
		nodeEventBus
	);

	return {
		reservationRequestUnitOfWork
	};
};