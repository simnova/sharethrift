import type { DomainSeedwork } from '@cellix/domain-seedwork';
import type { Passport } from '../../passport.js';
import type { PersonalUserRoleRepository } from './personal-user-role.repository.js';
import type { PersonalUserRole } from './personal-user-role.js';
import type { PersonalUserRoleProps } from './personal-user-role.entity.js';

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
