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

		// Admin can moderate conversations if they have listing moderation permissions
		const canModerateConversations =
			rolePermissions?.listingPermissions?.canModerateListings ?? false;

		// Check if admin is a participant in this conversation (sharer or reserver)
		const adminIsParticipant =
			this.root.sharer?.id === this.admin.id ||
			this.root.reserver?.id === this.admin.id;

		const permissions: ConversationDomainPermissions = {
			// Admins can create conversations if they have user management permissions
			canCreateConversation:
				rolePermissions?.userPermissions?.canEditUsers ?? false,
			// Admins can manage conversations if they have moderation permissions OR are a participant
			canManageConversation: canModerateConversations || adminIsParticipant,
			// Admins can view all conversations for moderation purposes
			canViewConversation:
				rolePermissions?.userPermissions?.canViewAllUsers ?? false,
		};

		return func(permissions);
	}
}
