import { DomainSeedwork } from '@cellix/domain-seedwork';
import type { Passport } from '../../passport.ts';
import type { PersonalUserRolePermissions } from './personal-user-role-permissions.ts';
import * as ValueObjects from './personal-user-role.value-objects.ts';

export interface PersonalUserRoleProps
	extends DomainSeedwork.DomainEntityProps {
	roleName: string;
	isDefault: boolean;
	permissions: PersonalUserRolePermissions;
	readonly roleType: string;
	readonly createdAt: Date;
	readonly updatedAt: Date;
	readonly schemaVersion: string;
}

export interface PersonalUserRoleEntityReference
	extends Readonly<Omit<PersonalUserRoleProps, 'permissions'>> {
	get permissions(): PersonalUserRolePermissions;
}

export class PersonalUserRole<P extends PersonalUserRoleProps>
	extends DomainSeedwork.AggregateRoot<P, Passport>
	implements PersonalUserRoleEntityReference
{
	protected isNew: boolean = false;

	public static getNewInstance<P extends PersonalUserRoleProps>(
		newProps: P,
		passport: Passport,
		roleName: string,
		isDefault: boolean,
	): PersonalUserRole<P> {
		const role = new PersonalUserRole(newProps, passport);
		role.isNew = true;
		role.roleName = roleName;
		role.isDefault = isDefault;
		role.isNew = false;
		return role;
	}

	get roleName() {
		return this.props.roleName;
	}
	set roleName(roleName: string) {
		this.props.roleName = new ValueObjects.RoleName(roleName).valueOf();
	}

	get isDefault() {
		return this.props.isDefault;
	}
	set isDefault(isDefault: boolean) {
		this.props.isDefault = isDefault;
	}

	get permissions() {
		return this.props.permissions;
	}

	get roleType() {
		return this.props.roleType;
	}
	get createdAt() {
		return this.props.createdAt;
	}
	get updatedAt() {
		return this.props.updatedAt;
	}
	get schemaVersion() {
		return this.props.schemaVersion;
	}
}
