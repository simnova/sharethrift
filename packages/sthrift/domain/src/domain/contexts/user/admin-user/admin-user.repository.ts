import type { AdminUserProps } from './admin-user.entity.ts';
import type { AdminUser } from './admin-user.ts';
import type { DomainSeedwork } from '@cellix/domain-seedwork';

export interface AdminUserRepository<props extends AdminUserProps>
	extends DomainSeedwork.Repository<AdminUser<props>> {
	getNewInstance(
		email: string,
		username: string,
		firstName: string,
		lastName: string,
	): Promise<AdminUser<props>>;
	getById(id: string): Promise<AdminUser<props>>;
}
