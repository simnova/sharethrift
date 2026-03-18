import { DomainSeedwork } from '@cellix/domain-seedwork';

export interface AdminRoleListingPermissionsProps
	extends DomainSeedwork.ValueObjectProps {
	canViewAllListings: boolean;
	canManageAllListings: boolean;
	canEditListings: boolean;
	canDeleteListings: boolean;
	canApproveListings: boolean;
	canRejectListings: boolean;
	canBlockListings: boolean;
	canUnblockListings: boolean;
	canModerateListings: boolean;
}

export interface AdminRoleListingPermissionsEntityReference
	extends Readonly<AdminRoleListingPermissionsProps> {}

export class AdminRoleListingPermissions
	extends DomainSeedwork.ValueObject<AdminRoleListingPermissionsProps>
	implements AdminRoleListingPermissionsEntityReference
{
	get canViewAllListings(): boolean {
		return this.props.canViewAllListings;
	}
	set canViewAllListings(value: boolean) {
		this.props.canViewAllListings = value;
	}

	get canManageAllListings(): boolean {
		return this.props.canManageAllListings;
	}
	set canManageAllListings(value: boolean) {
		this.props.canManageAllListings = value;
	}

	get canEditListings(): boolean {
		return this.props.canEditListings;
	}
	set canEditListings(value: boolean) {
		this.props.canEditListings = value;
	}

	get canDeleteListings(): boolean {
		return this.props.canDeleteListings;
	}
	set canDeleteListings(value: boolean) {
		this.props.canDeleteListings = value;
	}

	get canApproveListings(): boolean {
		return this.props.canApproveListings;
	}
	set canApproveListings(value: boolean) {
		this.props.canApproveListings = value;
	}

	get canRejectListings(): boolean {
		return this.props.canRejectListings;
	}
	set canRejectListings(value: boolean) {
		this.props.canRejectListings = value;
	}

	get canBlockListings(): boolean {
		return this.props.canBlockListings;
	}
	set canBlockListings(value: boolean) {
		this.props.canBlockListings = value;
	}

	get canUnblockListings(): boolean {
		return this.props.canUnblockListings;
	}
	set canUnblockListings(value: boolean) {
		this.props.canUnblockListings = value;
	}

	get canModerateListings(): boolean {
		return this.props.canModerateListings;
	}
	set canModerateListings(value: boolean) {
		this.props.canModerateListings = value;
	}
}
