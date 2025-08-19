import type { DomainSeedwork } from '@cellix/domain-seedwork';
import type { ReservationRequest, ReservationRequestPassport, ReservationRequestProps } from './reservation-request.aggregate.js';
import type { ReservationRequestRepository } from './reservation-request.repository.js';

/**
 * Unit of Work interface for ReservationRequest bounded context.
 * Coordinates transactions and manages repository access for reservation request operations.
 */
export interface ReservationRequestUnitOfWork 
	extends DomainSeedwork.UnitOfWork<ReservationRequestPassport, ReservationRequestProps, ReservationRequest, ReservationRequestRepository> {
	
	readonly reservationRequestRepository: ReservationRequestRepository;
}

/**
 * Domain adapter interface for ReservationRequest bounded context.
 * Provides access to Unit of Work for coordinating domain operations.
 */
export interface ReservationRequestDomainAdapter {
	readonly reservationRequestUnitOfWork: ReservationRequestUnitOfWork;
}