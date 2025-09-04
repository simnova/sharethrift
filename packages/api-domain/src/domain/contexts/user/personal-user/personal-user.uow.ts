import type { DomainSeedwork } from '@cellix/domain-seedwork';
import type { Passport } from '../../passport.ts';
import type { PersonalUser, PersonalUserProps } from './personal-user.ts';
import type { PersonalUserRepository } from './personal-user.repository.ts';

export interface PersonalUserUnitOfWork
	extends DomainSeedwork.UnitOfWork<
		Passport,
		PersonalUserProps,
		PersonalUser<PersonalUserProps>,
		PersonalUserRepository<PersonalUserProps>
	> {}
