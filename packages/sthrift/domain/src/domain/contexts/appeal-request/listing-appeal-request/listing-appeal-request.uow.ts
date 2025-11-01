import type { DomainSeedwork } from '@cellix/domain-seedwork';
import type { Passport } from '../../passport.ts';
import type { ListingAppealRequest } from './listing-appeal-request.ts';
import type { ListingAppealRequestRepository } from './listing-appeal-request.repository.ts';
import type { ListingAppealRequestProps } from './listing-appeal-request.entity.ts';

/**
 * Represents the Unit of Work interface for the ListingAppealRequest domain.
 *
 * This interface extends the generic `DomainSeedwork.UnitOfWork` and provides
 * type bindings for Passport authentication, ListingAppealRequest properties,
 * ListingAppealRequest entity, and ListingAppealRequest repository.
 *
 * @template Passport - The authentication context used for operations.
 * @template ListingAppealRequestProps - The properties that define a ListingAppealRequest.
 * @template ListingAppealRequest - The ListingAppealRequest AggregateRoot type.
 * @template ListingAppealRequestRepository - The repository interface for ListingAppealRequest aggregates.
 */
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
