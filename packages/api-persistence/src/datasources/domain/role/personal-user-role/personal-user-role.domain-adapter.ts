import { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import type { Models } from '@sthrift/api-data-sources-mongoose-models';
import { Domain } from '@sthrift/api-domain';

export class PersonalUserRoleConverter extends MongooseSeedwork.MongoTypeConverter<
	PersonalUserRole,
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
			this.doc.set('permissions', {} as Models.Role.PersonalUserPermissions);
		}
		return new PersonalUserRolePermissionsDomainAdapter(
			this.doc.permissions as Models.Role.PersonalUserPermissions,
		);
	}

	get roleType(): string {
		return this.doc.roleType;
	}

	get createdAt(): Date {
		return this.doc.createdAt;
	}

	get updatedAt(): Date {
		return this.doc.updatedAt;
	}

	get schemaVersion(): string {
		return this.doc.schemaVersion;
	}
}

// Permissions adapter tree
export class PersonalUserRolePermissionsDomainAdapter
	implements
		Domain.Contexts.Role.PersonalUserRole.PersonalUserRolePermissionsProps
{
	public readonly props: Domain.Contexts.Role.PersonalUserRole.PersonalUserRolePermissions;
	constructor(
		props: Domain.Contexts.Role.PersonalUserRole.PersonalUserRolePermissions,
	) {
		this.props = props;
	}

	get reservationRequestPermissions(): Domain.Contexts.Role.PersonalUserRole.PersonalUserRoleReservationRequestPermissionsProps {
		return new PersonalUserRoleReservationRequestPermissionsDomainAdapter(
			this.props.reservationRequestPermissions,
		);
	}

	get listingPermissions(): Domain.Contexts.Role.PersonalUserRole.PersonalUserRoleListingPermissionsProps {
		return new PersonalUserRoleListingPermissionsDomainAdapter(
			this.props.listingPermissions,
		);
	}

	get conversationPermissions(): Domain.Contexts.Role.PersonalUserRole.PersonalUserRoleConversationPermissionsProps {
		return new PersonalUserRoleConversationPermissionsDomainAdapter(
			this.props.conversationPermissions,
		);
	}
}
export class PersonalUserRoleReservationRequestPermissionsDomainAdapter
	implements
		Domain.Contexts.Role.PersonalUserRole.PersonalUserRoleResversationRequestPermissionsProps
{
	public readonly props: Models.Role.PersonalUserReservationRequestPermissions;
	constructor(props: Models.Role.PersonalUserReservationRequestPermissions) {
		this.props = props;
	}
	get canCloseRequest(): boolean {
		return false;
	}
	get canCancelRequest(): boolean {
		return false;
	}
	get canAcceptRequest(): boolean {
		return false;
	}
	get canRejectRequest(): boolean {
		return false;
	}
	get canUpdateRequest(): boolean {
		return false;
	}
}

export class PersonalUserRoleListingPermissionsDomainAdapter
	implements
		Domain.Contexts.Role.PersonalUserRole.PersonalUserRoleListingPermissionsProps
{
	public readonly props: Models.Role.PersonalUserListingPermissions;
	constructor(props: Models.Role.PersonalUserListingPermissions) {
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
	public readonly props: Models.Role.PersonalUserConversationPermissions;
	constructor(props: Models.Role.PersonalUserConversationPermissions) {
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
