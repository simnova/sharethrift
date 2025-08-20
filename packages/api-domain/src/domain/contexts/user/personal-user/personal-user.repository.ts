import type { PersonalUser, PersonalUserProps } from './personal-user.ts';
import type { DomainSeedwork } from '@cellix/domain-seedwork';

export interface PersonalUserRepository<props extends PersonalUserProps>
	extends DomainSeedwork.Repository<PersonalUser<props>> {
	getNewInstance(name: string): Promise<PersonalUser<props>>;// add more params as needed
	getById(id: string): Promise<PersonalUser<props>>;
	getAll(): Promise<PersonalUser<props>[]>;
}
