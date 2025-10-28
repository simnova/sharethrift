import type { DomainSeedwork } from '@cellix/domain-seedwork';
import type { Passport } from '../../passport.ts';
import type { UserAppealRequest } from './user-appeal-request.ts';
import type { UserAppealRequestRepository } from './user-appeal-request.repository.ts';
import type { UserAppealRequestProps } from './user-appeal-request.entity.ts';

/**
 * Represents the Unit of Work interface for the UserAppealRequest domain.
 *
 * This interface extends the generic `DomainSeedwork.UnitOfWork` and provides
 * type bindings for Passport authentication, UserAppealRequest properties,
 * UserAppealRequest entity, and UserAppealRequest repository.
 *
 * @template Passport - The authentication context used for operations.
 * @template UserAppealRequestProps - The properties that define a UserAppealRequest.
 * @template UserAppealRequest - The UserAppealRequest AggregateRoot type.
 * @template UserAppealRequestRepository - The repository interface for UserAppealRequest aggregates.
 */
export interface UserAppealRequestUnitOfWork
	extends DomainSeedwork.UnitOfWork<
			Passport,
			UserAppealRequestProps,
			UserAppealRequest<UserAppealRequestProps>,
			UserAppealRequestRepository<UserAppealRequestProps>
		>,
		DomainSeedwork.InitializedUnitOfWork<
			Passport,
			UserAppealRequestProps,
			UserAppealRequest<UserAppealRequestProps>,
			UserAppealRequestRepository<UserAppealRequestProps>
		> {}
