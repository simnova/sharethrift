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
	get canBlockUsers(): boolean {
		return this.props.canBlockUsers;
	}

	get canUnblockUsers(): boolean {
		return this.props.canUnblockUsers;
	}

	get canBlockListings(): boolean {
		return this.props.canBlockListings;
	}

	get canUnblockListings(): boolean {
		return this.props.canUnblockListings;
	}

	get canRemoveListings(): boolean {
		return this.props.canRemoveListings;
	}

	get canViewListingReports(): boolean {
		return this.props.canViewListingReports;
	}

	get canViewUserReports(): boolean {
		return this.props.canViewUserReports;
	}

	get canManageUserRoles(): boolean {
		return this.props.canManageUserRoles;
	}
}
