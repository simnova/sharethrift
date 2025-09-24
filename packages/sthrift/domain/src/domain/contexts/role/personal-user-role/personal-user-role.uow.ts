import type { DomainSeedwork } from '@cellix/domain-seedwork';
import type { Passport } from '../../passport.ts';
import type { PersonalUserRoleRepository } from './personal-user-role.repository.ts';
import type { PersonalUserRole } from './personal-user-role.ts';
import type { PersonalUserRoleProps } from './personal-user-role.entity.ts';

export interface PersonalUserRoleUnitOfWork
	extends DomainSeedwork.UnitOfWork<
			Passport,
			PersonalUserRoleProps,
			PersonalUserRole<PersonalUserRoleProps>,
			PersonalUserRoleRepository<PersonalUserRoleProps>
		>,
		DomainSeedwork.InitializedUnitOfWork<
			Passport,
			PersonalUserRoleProps,
			PersonalUserRole<PersonalUserRoleProps>,
			PersonalUserRoleRepository<PersonalUserRoleProps>
		> {}
