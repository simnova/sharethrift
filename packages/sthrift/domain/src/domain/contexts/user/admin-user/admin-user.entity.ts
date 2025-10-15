import type { DomainSeedwork } from '@cellix/domain-seedwork';
import type {
	AdminUserAccountEntityReference,
	AdminUserAccountProps,
} from './admin-user-account.entity.ts';
import type { AdminRoleEntityReference } from '../../role/admin-role/admin-role.entity.ts';

export interface AdminUserProps extends DomainSeedwork.DomainEntityProps {
	userType: string;
	adminLevel: string;
	isBlocked: boolean;
	role: Readonly<AdminRoleEntityReference>;
	loadRole: () => Promise<Readonly<AdminRoleEntityReference>>;

	readonly account: AdminUserAccountProps;

	readonly schemaVersion: string;
	readonly createdAt: Date;
	readonly updatedAt: Date;
}

export interface AdminUserEntityReference
	extends Readonly<Omit<AdminUserProps, 'account'>> {
	readonly account: AdminUserAccountEntityReference;
}
