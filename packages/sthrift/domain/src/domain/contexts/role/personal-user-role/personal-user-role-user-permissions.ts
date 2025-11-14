import { DomainSeedwork } from '@cellix/domain-seedwork';
import type { UserDomainPermissions } from '../../user/user.domain-permissions.ts';

export interface PersonalUserRoleUserPermissionsProps
	extends Omit<
			UserDomainPermissions,
			'isEditingOwnAccount' | 'isSystemAccount'
		>,
		DomainSeedwork.ValueObjectProps {}
export interface PersonalUserRoleUserPermissionsEntityReference
	extends Readonly<PersonalUserRoleUserPermissionsProps> {}

export class PersonalUserRoleUserPermissions
	extends DomainSeedwork.ValueObject<PersonalUserRoleUserPermissionsProps>
	implements PersonalUserRoleUserPermissionsEntityReference
{
	get canCreateUser(): boolean {
		return this.props.canCreateUser;
	}

	get canBlockUsers(): boolean {
		return this.props.canBlockUsers;
	}

	get canUnblockUsers(): boolean {
		return this.props.canUnblockUsers;
	}
}
