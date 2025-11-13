import { DomainSeedwork } from '@cellix/domain-seedwork';

export interface AdminRoleConversationPermissionsProps
	extends DomainSeedwork.ValueObjectProps {
	canViewAllConversations: boolean;
	canEditConversations: boolean;
	canDeleteConversations: boolean;
	canCloseConversations: boolean;
	canModerateConversations: boolean;
}

export interface AdminRoleConversationPermissionsEntityReference
	extends Readonly<AdminRoleConversationPermissionsProps> {}

export class AdminRoleConversationPermissions
	extends DomainSeedwork.ValueObject<AdminRoleConversationPermissionsProps>
	implements AdminRoleConversationPermissionsEntityReference
{
	get canViewAllConversations(): boolean {
		return this.props.canViewAllConversations;
	}
	set canViewAllConversations(value: boolean) {
		this.props.canViewAllConversations = value;
	}

	get canEditConversations(): boolean {
		return this.props.canEditConversations;
	}
	set canEditConversations(value: boolean) {
		this.props.canEditConversations = value;
	}

	get canDeleteConversations(): boolean {
		return this.props.canDeleteConversations;
	}
	set canDeleteConversations(value: boolean) {
		this.props.canDeleteConversations = value;
	}

	get canCloseConversations(): boolean {
		return this.props.canCloseConversations;
	}
	set canCloseConversations(value: boolean) {
		this.props.canCloseConversations = value;
	}

	get canModerateConversations(): boolean {
		return this.props.canModerateConversations;
	}
	set canModerateConversations(value: boolean) {
		this.props.canModerateConversations = value;
	}
}
