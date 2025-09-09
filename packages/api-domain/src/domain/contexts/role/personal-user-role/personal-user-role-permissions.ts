import { DomainSeedwork } from '@cellix/domain-seedwork';

export interface PersonalUserRoleListingPermissionsProps {
	canCreateItemListing: boolean;
	canUpdateItemListing: boolean;
	canDeleteItemListing: boolean;
	canViewItemListing: boolean;
	canPublishItemListing: boolean;
	canUnpublishItemListing: boolean;
}

export interface PersonalUserRoleConversationPermissionsProps {
	canCreateConversation: boolean;
	canManageConversation: boolean;
	canViewConversation: boolean;
}
export interface PersonalUserRoleReservationRequestPermissionsProps {
	canCreateReservationRequest: boolean;
	canManageReservationRequest: boolean;
	canViewReservationRequest: boolean;
}

export interface PersonalUserRolePermissionsProps
	extends DomainSeedwork.ValueObjectProps {
	readonly listingPermissions: PersonalUserRoleListingPermissionsProps;
	readonly conversationPermissions: PersonalUserRoleConversationPermissionsProps;
	readonly reservationRequestPermissions: PersonalUserRoleReservationRequestPermissionsProps;
}

export interface PersonalUserRolePermissionsEntityReference
	extends Readonly<
		Omit<
			PersonalUserRolePermissionsProps,
			| 'listingPermissions'
			| 'conversationPermissions | reservationRequestPermissions'
		>
	> {
	readonly listingPermissions: PersonalUserRoleListingPermissionsProps;
	readonly conversationPermissions: PersonalUserRoleConversationPermissionsProps;
	readonly reservationRequestPermissions: PersonalUserRoleReservationRequestPermissionsProps;
}

export class PersonalUserRolePermissions
	extends DomainSeedwork.ValueObject<PersonalUserRolePermissionsProps>
	implements PersonalUserRolePermissionsEntityReference
{
	get listingPermissions(): PersonalUserRoleListingPermissionsProps {
		return this.props.listingPermissions;
	}

	get conversationPermissions(): PersonalUserRoleConversationPermissionsProps {
		return this.props.conversationPermissions;
	}

	get reservationRequestPermissions(): PersonalUserRoleReservationRequestPermissionsProps {
		return this.props.reservationRequestPermissions;
	}
}
