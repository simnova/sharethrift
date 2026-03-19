import type { ConversationEntityReference } from '../../../../contexts/conversation/conversation/index.ts';
import type { ConversationVisa } from '../../../../contexts/conversation/conversation.visa.ts';
import type { ConversationDomainPermissions } from '../../../../contexts/conversation/conversation.domain-permissions.ts';
import type { AdminUserEntityReference } from '../../../../contexts/user/admin-user/index.ts';

export class AdminUserConversationVisa<root extends ConversationEntityReference>
	implements ConversationVisa
{
	private readonly root: root;
	private readonly admin: AdminUserEntityReference;

	constructor(root: root, admin: AdminUserEntityReference) {
		this.root = root;
		this.admin = admin;
	}

	determineIf(
		func: (permissions: Readonly<ConversationDomainPermissions>) => boolean,
	): boolean {
		// AdminUser permissions based on their role
		const rolePermissions = this.admin.role?.permissions;

		const permissions: ConversationDomainPermissions = {
			// Admins can create conversations if they have conversation edit permissions
			canCreateConversation:
				rolePermissions?.conversationPermissions?.canEditConversations ?? false,
			// Admins can manage conversations if they have moderation permissions
			canManageConversation:
				rolePermissions?.conversationPermissions?.canModerateConversations ??
				false,
			// Admins can view all conversations if they have the view permission
			canViewConversation:
				rolePermissions?.conversationPermissions?.canViewAllConversations ??
				false,
		};

		return func(permissions);
	}
}
