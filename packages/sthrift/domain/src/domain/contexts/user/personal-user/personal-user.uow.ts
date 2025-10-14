import type { DomainSeedwork } from '@cellix/domain-seedwork';
import type { Passport } from '../../passport.ts';
import type { PersonalUser } from './personal-user.ts';
import type { PersonalUserRepository } from './personal-user.repository.ts';
import type { PersonalUserProps } from './personal-user.entity.ts';

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
