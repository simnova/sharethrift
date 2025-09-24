import type { DomainSeedwork } from '@cellix/domain-seedwork';
import type {
	PersonalUserRolePermissionsEntityReference,
	PersonalUserRolePermissionsProps,
} from './personal-user-role-permissions.ts';

export interface PersonalUserRoleProps
	extends DomainSeedwork.DomainEntityProps {
	roleName: string;
	isDefault: boolean;
	permissions: PersonalUserRolePermissionsProps;
	readonly roleType: string;
	readonly createdAt: Date;
	readonly updatedAt: Date;
	readonly schemaVersion: string;
}

export interface PersonalUserRoleEntityReference
	extends Readonly<Omit<PersonalUserRoleProps, 'permissions'>> {
	get permissions(): PersonalUserRolePermissionsEntityReference;
}
