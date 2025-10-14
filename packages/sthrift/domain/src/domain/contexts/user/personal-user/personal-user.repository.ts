import type { PersonalUserProps } from './personal-user.entity.ts';
import type { PersonalUser } from './personal-user.ts';
import type { DomainSeedwork } from '@cellix/domain-seedwork';

export interface PersonalUserRepository<props extends PersonalUserProps>
	extends DomainSeedwork.Repository<PersonalUser<props>> {
	getNewInstance(
		email: string,
		firstName: string,
		lastName: string,
	): Promise<PersonalUser<props>>; // add more params as needed
	getById(id: string): Promise<PersonalUser<props>>;
}
