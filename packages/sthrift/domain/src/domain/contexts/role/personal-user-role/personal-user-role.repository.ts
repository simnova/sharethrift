import type { DomainSeedwork } from '@cellix/domain-seedwork';
import type { PersonalUserRole } from './personal-user-role.js';
import type { PersonalUserRoleProps } from './personal-user-role.entity.js';

export interface PersonalUserRoleRepository<props extends PersonalUserRoleProps>
	extends DomainSeedwork.Repository<PersonalUserRole<props>> {
	getNewInstance(
		roleName: string,
		isDefault: boolean,
	): Promise<PersonalUserRole<props>>;
	getById(id: string): Promise<PersonalUserRole<props>>;
}
