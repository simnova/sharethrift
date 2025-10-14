import type { DomainSeedwork } from '@cellix/domain-seedwork';
import type { Passport } from '../../passport.js';
import type { PersonalUser } from './personal-user.js';
import type { PersonalUserRepository } from './personal-user.repository.js';
import type { PersonalUserProps } from './personal-user.entity.js';

export interface PersonalUserUnitOfWork
	extends DomainSeedwork.UnitOfWork<
			Passport,
			PersonalUserProps,
			PersonalUser<PersonalUserProps>,
			PersonalUserRepository<PersonalUserProps>
		>,
		DomainSeedwork.InitializedUnitOfWork<
			Passport,
			PersonalUserProps,
			PersonalUser<PersonalUserProps>,
			PersonalUserRepository<PersonalUserProps>
		> {}
