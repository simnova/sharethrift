import type { DomainSeedwork } from '@cellix/domain-seedwork';
import type { Passport } from '../../passport.ts';
import type { AdminUser } from './admin-user.aggregate.ts';
import type { AdminUserRepository } from './admin-user.repository.ts';
import type { AdminUserProps } from './admin-user.entity.ts';

export interface AdminUserUnitOfWork
	extends DomainSeedwork.UnitOfWork<
			Passport,
			AdminUserProps,
			AdminUser<AdminUserProps>,
			AdminUserRepository<AdminUserProps>
		>,
		DomainSeedwork.InitializedUnitOfWork<
			Passport,
			AdminUserProps,
			AdminUser<AdminUserProps>,
			AdminUserRepository<AdminUserProps>
		> {}
