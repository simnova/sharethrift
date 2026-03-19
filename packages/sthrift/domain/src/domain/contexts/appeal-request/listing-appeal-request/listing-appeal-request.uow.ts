import type { DomainSeedwork } from '@cellix/domain-seedwork';
import type { Passport } from '../../passport.ts';
import type { ListingAppealRequest } from './listing-appeal-request.ts';
import type { ListingAppealRequestRepository } from './listing-appeal-request.repository.ts';
import type { ListingAppealRequestProps } from './listing-appeal-request.entity.ts';

// UnitOfWork interface for ListingAppealRequest
export interface ListingAppealRequestUnitOfWork
	extends DomainSeedwork.UnitOfWork<
			Passport,
			ListingAppealRequestProps,
			ListingAppealRequest<ListingAppealRequestProps>,
			ListingAppealRequestRepository<ListingAppealRequestProps>
		>,
		DomainSeedwork.InitializedUnitOfWork<
			Passport,
			ListingAppealRequestProps,
			ListingAppealRequest<ListingAppealRequestProps>,
			ListingAppealRequestRepository<ListingAppealRequestProps>
		> {}
