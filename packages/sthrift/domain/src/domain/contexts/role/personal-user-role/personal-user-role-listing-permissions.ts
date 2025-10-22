import { DomainSeedwork } from '@cellix/domain-seedwork';

export interface PersonalUserRoleListingPermissionsProps
	extends DomainSeedwork.ValueObjectProps {
	canCreateItemListing: boolean;
	canUpdateItemListing: boolean;
	canDeleteItemListing: boolean;
	canViewItemListing: boolean;
	canPublishItemListing: boolean;
	canUnpublishItemListing: boolean;
	canExpireItemListing: boolean;
}

export interface PersonalUserRoleListingPermissionsEntityReference
	extends Readonly<PersonalUserRoleListingPermissionsProps> {}

export class PersonalUserRoleListingPermissions
	extends DomainSeedwork.ValueObject<PersonalUserRoleListingPermissionsProps>
	implements PersonalUserRoleListingPermissionsEntityReference
{
	get canCreateItemListing(): boolean {
		return this.props.canCreateItemListing;
	}
	set canCreateItemListing(value: boolean) {
		this.props.canCreateItemListing = value;
	}

	get canUpdateItemListing(): boolean {
		return this.props.canUpdateItemListing;
	}
	set canUpdateItemListing(value: boolean) {
		this.props.canUpdateItemListing = value;
	}

	get canDeleteItemListing(): boolean {
		return this.props.canDeleteItemListing;
	}
	set canDeleteItemListing(value: boolean) {
		this.props.canDeleteItemListing = value;
	}

	get canViewItemListing(): boolean {
		return this.props.canViewItemListing;
	}
	set canViewItemListing(value: boolean) {
		this.props.canViewItemListing = value;
	}

	get canPublishItemListing(): boolean {
		return this.props.canPublishItemListing;
	}
	set canPublishItemListing(value: boolean) {
		this.props.canPublishItemListing = value;
	}

	get canUnpublishItemListing(): boolean {
		return this.props.canUnpublishItemListing;
	}
	set canUnpublishItemListing(value: boolean) {
		this.props.canUnpublishItemListing = value;
	}

	get canExpireItemListing(): boolean {
		return this.props.canExpireItemListing;
	}
	set canExpireItemListing(value: boolean) {
		this.props.canExpireItemListing = value;
	}
}
