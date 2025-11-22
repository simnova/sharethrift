import type { DomainSeedwork } from '@cellix/domain-seedwork';
import type {
	AdminRolePermissionsEntityReference,
	AdminRolePermissionsProps,
} from './admin-role-permissions.ts';

export interface AdminRoleProps extends DomainSeedwork.DomainEntityProps {
	roleName: string;
	isDefault: boolean;
	permissions: AdminRolePermissionsProps;
	readonly roleType: string;
	readonly createdAt: Date;
	readonly updatedAt: Date;
	readonly schemaVersion: string;
}

export interface AdminRoleEntityReference
	extends Readonly<Omit<AdminRoleProps, 'permissions'>> {
	get permissions(): AdminRolePermissionsEntityReference;
}
