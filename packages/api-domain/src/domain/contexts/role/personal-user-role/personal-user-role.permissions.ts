import { DomainSeedwork } from '@cellix/domain-seedwork';

export interface PersonalUserListingPermissionsProps {
	canCreateItemListing: boolean;
	canUpdateItemListing: boolean;
	canDeleteItemListing: boolean;
	canViewItemListing: boolean;
	canPublishItemListing: boolean;
	canUnpublishItemListing: boolean;
}

export interface PersonalUserConversationPermissionsProps {
	canCreateConversation: boolean;
	canManageConversation: boolean;
	canViewConversation: boolean;
}

export interface PersonalUserPermissionsProps
	extends DomainSeedwork.ValueObjectProps {
	readonly listing: PersonalUserListingPermissionsProps;
	readonly conversation: PersonalUserConversationPermissionsProps;
}

export interface PersonalUserPermissionsEntityReference
	extends Readonly<
		Omit<PersonalUserPermissionsProps, 'listing' | 'conversation'>
	> {
	readonly listing: PersonalUserListingPermissionsProps;
	readonly conversation: PersonalUserConversationPermissionsProps;
}

export class PersonalUserPermissions
	extends DomainSeedwork.ValueObject<PersonalUserPermissionsProps>
	implements PersonalUserPermissionsEntityReference
{
	get listing(): PersonalUserListingPermissionsProps {
		return this.props.listing;
	}

	get conversation(): PersonalUserConversationPermissionsProps {
		return this.props.conversation;
	}
}
