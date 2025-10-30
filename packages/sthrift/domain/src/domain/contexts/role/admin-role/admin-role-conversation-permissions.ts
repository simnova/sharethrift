import { DomainSeedwork } from '@cellix/domain-seedwork';

export interface AdminRoleConversationPermissionsProps
	extends DomainSeedwork.ValueObjectProps {
	canModerateConversations: boolean;
}

export interface AdminRoleConversationPermissionsEntityReference
	extends Readonly<AdminRoleConversationPermissionsProps> {}

export class AdminRoleConversationPermissions
	extends DomainSeedwork.ValueObject<AdminRoleConversationPermissionsProps>
	implements AdminRoleConversationPermissionsEntityReference
{
	get canModerateConversations(): boolean {
		return this.props.canModerateConversations;
	}
	set canModerateConversations(value: boolean) {
		this.props.canModerateConversations = value;
	}
}
