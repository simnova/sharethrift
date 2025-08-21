import type { DomainSeedwork } from '@cellix/domain-seedwork';
import type { Passport } from '../passport.ts';
import type { ListingRequest, ListingRequestProps } from './request.aggregate.ts';
import type { ListingRequestRepository } from './request.repository.ts';

export interface ListingRequestUnitOfWork
	extends DomainSeedwork.UnitOfWork<
		Passport,
		ListingRequestProps,
		ListingRequest<ListingRequestProps>,
		ListingRequestRepository<ListingRequestProps>
	> {
	readonly listingRequestRepository: ListingRequestRepository<ListingRequestProps>;
}