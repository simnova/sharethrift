import type { DomainSeedwork } from '@cellix/domain-seedwork';
import type {
	PersonalUserRole,
	PersonalUserRoleProps,
} from './personal-user-role.ts';

export interface PersonalUserRoleRepository<props extends PersonalUserRoleProps>
	extends DomainSeedwork.Repository<PersonalUserRole<props>> {
	getNewInstance(
		roleName: string,
		isDefault: boolean,
	): Promise<PersonalUserRole<props>>;
	getById(id: string): Promise<PersonalUserRole<props>>;
}
