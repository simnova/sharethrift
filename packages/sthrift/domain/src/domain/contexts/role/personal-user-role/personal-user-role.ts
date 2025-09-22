import { DomainSeedwork } from '@cellix/domain-seedwork';
import type { Passport } from '../../passport.ts';
import { PersonalUserRolePermissions } from './personal-user-role-permissions.ts';
import * as ValueObjects from './personal-user-role.value-objects.ts';
import type {
	PersonalUserRoleEntityReference,
	PersonalUserRoleProps,
} from './personal-user-role.entity.ts';

export class PersonalUserRole<props extends PersonalUserRoleProps>
	extends DomainSeedwork.AggregateRoot<props, Passport>
	implements PersonalUserRoleEntityReference
{
	protected isNew: boolean = false;

	public static getNewInstance<props extends PersonalUserRoleProps>(
		newProps: props,
		passport: Passport,
		roleName: string,
		isDefault: boolean,
	): PersonalUserRole<props> {
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
		return new PersonalUserRolePermissions(this.props.permissions);
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
