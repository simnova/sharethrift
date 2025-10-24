import { DomainSeedwork } from '@cellix/domain-seedwork';

import type {
	AdminRoleUserPermissionsProps,
	AdminRoleUserPermissionsEntityReference,
} from './admin-role-user-permissions.ts';
import { AdminRoleUserPermissions } from './admin-role-user-permissions.ts';

import type {
	AdminRoleContentPermissionsProps,
	AdminRoleContentPermissionsEntityReference,
} from './admin-role-content-permissions.ts';
import { AdminRoleContentPermissions } from './admin-role-content-permissions.ts';

import type {
	AdminRoleSystemPermissionsProps,
	AdminRoleSystemPermissionsEntityReference,
} from './admin-role-system-permissions.ts';
import { AdminRoleSystemPermissions } from './admin-role-system-permissions.ts';

export interface AdminRolePermissionsProps
	extends DomainSeedwork.ValueObjectProps {
	readonly userPermissions: AdminRoleUserPermissionsProps;
	readonly contentPermissions: AdminRoleContentPermissionsProps;
	readonly systemPermissions: AdminRoleSystemPermissionsProps;
}

export interface AdminRolePermissionsEntityReference
	extends Readonly<
		Omit<
			AdminRolePermissionsProps,
			'userPermissions' | 'contentPermissions' | 'systemPermissions'
		>
	> {
	readonly userPermissions: AdminRoleUserPermissionsEntityReference;
	readonly contentPermissions: AdminRoleContentPermissionsEntityReference;
	readonly systemPermissions: AdminRoleSystemPermissionsEntityReference;
}

export class AdminRolePermissions
	extends DomainSeedwork.ValueObject<AdminRolePermissionsProps>
	implements AdminRolePermissionsEntityReference
{
	get userPermissions(): AdminRoleUserPermissionsProps {
		return new AdminRoleUserPermissions(this.props.userPermissions);
	}

	get contentPermissions(): AdminRoleContentPermissionsProps {
		return new AdminRoleContentPermissions(this.props.contentPermissions);
	}

	get systemPermissions(): AdminRoleSystemPermissionsProps {
		return new AdminRoleSystemPermissions(this.props.systemPermissions);
	}
}
