import type { DomainSeedwork } from '@cellix/domain-seedwork';
import type { Passport } from '../passport.ts';
import type { ReservationRequest, ReservationRequestProps } from './reservation-request.aggregate.ts';
import type { ReservationRequestRepository } from './reservation-request.repository.ts';

export interface ReservationRequestUnitOfWork
	extends DomainSeedwork.UnitOfWork<
		Passport,
		ReservationRequestProps,
		ReservationRequest<ReservationRequestProps>,
		ReservationRequestRepository<ReservationRequestProps>
	> {}
