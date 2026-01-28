import type { DomainSeedwork } from '@cellix/domain-seedwork';
import type { Passport } from '../../../passport.ts';
import type { AdminRoleRepository } from './admin-role.repository.ts';
import type { AdminRole } from './admin-role.ts';
import type { AdminRoleProps } from './admin-role.entity.ts';

export interface AdminRoleUnitOfWork
	extends DomainSeedwork.UnitOfWork<
			Passport,
			AdminRoleProps,
			AdminRole<AdminRoleProps>,
			AdminRoleRepository<AdminRoleProps>
		>,
		DomainSeedwork.InitializedUnitOfWork<
			Passport,
			AdminRoleProps,
			AdminRole<AdminRoleProps>,
			AdminRoleRepository<AdminRoleProps>
		> {}
