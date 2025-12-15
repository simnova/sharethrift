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
			// Admins can create conversations if they have user management permissions
			canCreateConversation:
				rolePermissions?.userPermissions?.canEditUsers ?? false,
			// Admins can manage conversations if they have moderation permissions
			canManageConversation:
				rolePermissions?.listingPermissions?.canModerateListings ?? false,
			// Admins can view all conversations for moderation purposes
			canViewConversation:
				rolePermissions?.userPermissions?.canViewAllUsers ?? false,
			// Admins can send messages if they have moderation permissions
			canSendMessage:
				rolePermissions?.listingPermissions?.canModerateListings ?? false,
		};

		return func(permissions);
	}
}
