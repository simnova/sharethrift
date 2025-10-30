import type { DomainSeedwork } from '@cellix/domain-seedwork';
import type { AdminRole } from './admin-role.ts';
import type { AdminRoleProps } from './admin-role.entity.ts';

export interface AdminRoleRepository<props extends AdminRoleProps>
	extends DomainSeedwork.Repository<AdminRole<props>> {
	getNewInstance(
		roleName: string,
		isDefault: boolean,
	): Promise<AdminRole<props>>;
	getById(id: string): Promise<AdminRole<props>>;
}
