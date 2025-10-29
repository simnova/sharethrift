import { DomainSeedwork } from '@cellix/domain-seedwork';

export interface AdminRoleListingPermissionsProps
	extends DomainSeedwork.ValueObjectProps {
	canModerateListings: boolean;
}

export interface AdminRoleListingPermissionsEntityReference
	extends Readonly<AdminRoleListingPermissionsProps> {}

export class AdminRoleListingPermissions
	extends DomainSeedwork.ValueObject<AdminRoleListingPermissionsProps>
	implements AdminRoleListingPermissionsEntityReference
{
	get canModerateListings(): boolean {
		return this.props.canModerateListings;
	}
	set canModerateListings(value: boolean) {
		this.props.canModerateListings = value;
	}
}
