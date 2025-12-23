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

		// Admin can moderate conversations using dedicated conversation permissions
		const canModerateConversations =
			rolePermissions?.conversationPermissions?.canModerateConversations ??
			false;

		// Check if admin is a participant in this conversation (sharer or reserver)
		const adminIsParticipant =
			this.root.sharer?.id === this.admin.id ||
			this.root.reserver?.id === this.admin.id;

		const permissions: ConversationDomainPermissions = {
			// Admins can create conversations if they have conversation edit permissions
			canCreateConversation:
				rolePermissions?.conversationPermissions?.canEditConversations ?? false,
			// Admins can manage conversations if they have moderation permissions OR are a participant
			canManageConversation: canModerateConversations || adminIsParticipant,
			// Admins can view all conversations if they have the view permission
			canViewConversation:
				rolePermissions?.conversationPermissions?.canViewAllConversations ??
				false,
		};

		return func(permissions);
	}
}
