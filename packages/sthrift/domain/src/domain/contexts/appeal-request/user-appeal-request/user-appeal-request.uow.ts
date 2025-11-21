import type { DomainSeedwork } from '@cellix/domain-seedwork';
import type { Passport } from '../../passport.ts';
import type { UserAppealRequest } from './user-appeal-request.ts';
import type { UserAppealRequestRepository } from './user-appeal-request.repository.ts';
import type { UserAppealRequestProps } from './user-appeal-request.entity.ts';

// UnitOfWork interface for UserAppealRequest
export interface UserAppealRequestUnitOfWork<PropType extends UserAppealRequestProps>
	extends DomainSeedwork.UnitOfWork<
			Passport,
			PropType,
			UserAppealRequest<PropType>,
			UserAppealRequestRepository<PropType>
		>,
		DomainSeedwork.InitializedUnitOfWork<
			Passport,
			PropType,
			UserAppealRequest<PropType>,
			UserAppealRequestRepository<PropType>
		> {}
