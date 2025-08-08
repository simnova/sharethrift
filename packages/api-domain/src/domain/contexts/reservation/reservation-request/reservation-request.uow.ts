import type { DomainSeedwork } from '@cellix/domain-seedwork';
import type { ReservationPassport } from '../reservation.passport.ts';
import type { ReservationRequest, ReservationRequestProps } from './reservation-request.aggregate.ts';
import type { ReservationRequestRepository } from './reservation-request.repository.ts';

/**
 * Represents the Unit of Work interface for the ReservationRequest domain.
 * 
 * This interface extends the generic `DomainSeedwork.UnitOfWork` and provides
 * type bindings for ReservationPassport authentication, ReservationRequest properties, 
 * ReservationRequest entity, and ReservationRequest repository.
 *
 * @template ReservationPassport - The authentication context used for operations.
 * @template ReservationRequestProps - The properties that define a ReservationRequest.
 * @template ReservationRequest - The ReservationRequest AggregateRoot type.
 * @template ReservationRequestRepository - The repository interface for ReservationRequest aggregates.
 */
export interface ReservationRequestUnitOfWork
	extends DomainSeedwork.UnitOfWork<
		ReservationPassport,
		ReservationRequestProps,
		ReservationRequest<ReservationRequestProps>,
		ReservationRequestRepository
	> {}
