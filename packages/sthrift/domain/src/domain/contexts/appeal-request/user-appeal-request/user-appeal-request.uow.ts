import type { DomainSeedwork } from '@cellix/domain-seedwork';
import type { Passport } from '../../passport.ts';
import type { UserAppealRequest } from './user-appeal-request.ts';
import type { UserAppealRequestRepository } from './user-appeal-request.repository.ts';
import type { UserAppealRequestProps } from './user-appeal-request.entity.ts';

// UnitOfWork interface for UserAppealRequest
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
