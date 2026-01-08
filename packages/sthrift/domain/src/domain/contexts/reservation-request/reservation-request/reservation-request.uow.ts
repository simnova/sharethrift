import type { DomainSeedwork } from '@cellix/domain-seedwork';
import type { Passport } from '../../passport.ts';
import type { ReservationRequestProps } from './reservation-request.entity.ts';
import type { ReservationRequestRepository } from './reservation-request.repository.ts';
import type { ReservationRequest } from './reservation-request.ts';

export interface ReservationRequestUnitOfWork
	extends DomainSeedwork.UnitOfWork<
			Passport,
			ReservationRequestProps,
			ReservationRequest<ReservationRequestProps>,
			ReservationRequestRepository<ReservationRequestProps>
		>,
		DomainSeedwork.InitializedUnitOfWork<
			Passport,
			ReservationRequestProps,
			ReservationRequest<ReservationRequestProps>,
			ReservationRequestRepository<ReservationRequestProps>
		> {}
