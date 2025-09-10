import { DomainSeedwork } from '@cellix/domain-seedwork';
// import type { CommunityVisa } from '../../community.visa'; // Uncomment if you have a visa concept

export interface PersonalUserRoleConversationPermissionsProps
	extends DomainSeedwork.ValueObjectProps {
	canCreateConversation: boolean;
	canManageConversation: boolean;
	canViewConversation: boolean;
}
export interface PersonalUserRoleConversationPermissionsEntityReference
	extends Readonly<PersonalUserRoleConversationPermissionsProps> {}

export class PersonalUserRoleConversationPermissions
	extends DomainSeedwork.ValueObject<PersonalUserRoleConversationPermissionsProps>
	implements PersonalUserRoleConversationPermissionsEntityReference
{
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
