import type { DomainSeedwork } from '@cellix/domain-seedwork';
import type { Passport } from '../../passport.js';
import type { ReservationRequest } from './reservation-request.js';
import type { ReservationRequestRepository } from './reservation-request.repository.js';
import type { ReservationRequestProps } from './reservation-request.entity.js';

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
