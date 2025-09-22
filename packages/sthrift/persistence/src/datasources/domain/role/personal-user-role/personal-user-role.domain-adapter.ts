import { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import type { Models } from '@sthrift/data-sources-mongoose-models';
import { Domain } from '@sthrift/domain';

export class PersonalUserRoleConverter extends MongooseSeedwork.MongoTypeConverter<
	Models.Role.PersonalUserRole,
	PersonalUserRoleDomainAdapter,
	Domain.Passport,
	Domain.Contexts.Role.PersonalUserRole.PersonalUserRole<PersonalUserRoleDomainAdapter>
> {
	constructor() {
		super(
			PersonalUserRoleDomainAdapter,
			Domain.Contexts.Role.PersonalUserRole.PersonalUserRole,
		);
	}
}

export class PersonalUserRoleDomainAdapter
	extends MongooseSeedwork.MongooseDomainAdapter<Models.Role.PersonalUserRole>
	implements Domain.Contexts.Role.PersonalUserRole.PersonalUserRoleProps
{
	get roleName(): string {
		return this.doc.roleName;
	}
	set roleName(roleName: string) {
		this.doc.roleName = roleName;
	}

	get isDefault(): boolean {
		return this.doc.isDefault;
	}
	set isDefault(value: boolean) {
		this.doc.isDefault = value;
	}

	get permissions(): Domain.Contexts.Role.PersonalUserRole.PersonalUserRolePermissionsProps {
		if (!this.doc.permissions) {
			this.doc.set(
				'permissions',
				{} as Models.Role.PersonalUserRolePermissions,
			);
		}
		return new PersonalUserRolePermissionsDomainAdapter(this.doc.permissions);
	}

	get roleType(): string {
		return this.doc.roleType;
	}
}

export class PersonalUserRolePermissionsDomainAdapter
	implements
		Domain.Contexts.Role.PersonalUserRole.PersonalUserRolePermissionsProps
{
	public readonly props: Models.Role.PersonalUserRolePermissions;
	constructor(props: Models.Role.PersonalUserRolePermissions) {
		this.props = props;
	}

	get reservationRequestPermissions(): Domain.Contexts.Role.PersonalUserRole.PersonalUserRoleReservationRequestPermissionsProps {
		if (!this.props.reservationRequestPermissions) {
			this.props.set('reservationRequestPermissions', {});
		}
		return new PersonalUserRoleReservationRequestPermissionsDomainAdapter(
			this.props.reservationRequestPermissions,
		);
	}

	get listingPermissions(): Domain.Contexts.Role.PersonalUserRole.PersonalUserRoleListingPermissionsProps {
		if (!this.props.listingPermissions) {
			this.props.set('listingPermissions', {});
		}
		return new PersonalUserRoleListingPermissionsDomainAdapter(
			this.props.listingPermissions,
		);
	}

	get conversationPermissions(): Domain.Contexts.Role.PersonalUserRole.PersonalUserRoleConversationPermissionsProps {
		if (!this.props.conversationPermissions) {
			this.props.set('conversationPermissions', {});
		}
		return new PersonalUserRoleConversationPermissionsDomainAdapter(
			this.props.conversationPermissions,
		);
	}
}
export class PersonalUserRoleReservationRequestPermissionsDomainAdapter
	implements
		Domain.Contexts.Role.PersonalUserRole.PersonalUserRoleReservationRequestPermissionsProps
{
	public readonly props: Models.Role.PersonalUserRoleReservationRequestPermissions;
	constructor(
		props: Models.Role.PersonalUserRoleReservationRequestPermissions,
	) {
		this.props = props;
	}

	get canCreateReservationRequest(): boolean {
		return this.props.canCreateReservationRequest;
	}
	set canCreateReservationRequest(value: boolean) {
		this.props.canCreateReservationRequest = value;
	}
	get canManageReservationRequest(): boolean {
		return this.props.canManageReservationRequest;
	}
	set canManageReservationRequest(value: boolean) {
		this.props.canManageReservationRequest = value;
	}
	get canViewReservationRequest(): boolean {
		return this.props.canViewReservationRequest;
	}
	set canViewReservationRequest(value: boolean) {
		this.props.canViewReservationRequest = value;
	}
}

export class PersonalUserRoleListingPermissionsDomainAdapter
	implements
		Domain.Contexts.Role.PersonalUserRole.PersonalUserRoleListingPermissionsProps
{
	public readonly props: Models.Role.PersonalUserRoleListingPermissions;
	constructor(props: Models.Role.PersonalUserRoleListingPermissions) {
		this.props = props;
	}
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
}

export class PersonalUserRoleConversationPermissionsDomainAdapter
	implements
		Domain.Contexts.Role.PersonalUserRole.PersonalUserRoleConversationPermissionsProps
{
	public readonly props: Models.Role.PersonalUserRoleConversationPermissions;
	constructor(props: Models.Role.PersonalUserRoleConversationPermissions) {
		this.props = props;
	}
	get canCreateConversation(): boolean {
		return this.props.canCreateConversation;
	}
	set canCreateConversation(value: boolean) {
		this.props.canCreateConversation = value;
	}
	get canManageConversation(): boolean {
		return this.props.canManageConversation;
	}
	set canManageConversation(value: boolean) {
		this.props.canManageConversation = value;
	}
	get canViewConversation(): boolean {
		return this.props.canViewConversation;
	}
	set canViewConversation(value: boolean) {
		this.props.canViewConversation = value;
	}
}
