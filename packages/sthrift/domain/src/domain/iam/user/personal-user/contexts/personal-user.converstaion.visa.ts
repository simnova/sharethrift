import type { ConversationEntityReference } from '../../../../contexts/conversation/conversation/conversation.entity.ts';
import type { ConversationDomainPermissions } from '../../../../contexts/conversation/conversation.domain-permissions.ts';
import type { ConversationVisa } from '../../../../contexts/conversation/conversation.visa.ts';
import type { PersonalUserEntityReference } from '../../../../contexts/user/personal-user/personal-user.entity.ts';
export class PersonalUserConversationVisa<
	root extends ConversationEntityReference,
> implements ConversationVisa
{
	private readonly root: root;
	private readonly user: PersonalUserEntityReference;
	constructor(root: root, user: PersonalUserEntityReference) {
		this.root = root;
		this.user = user;
	}

	determineIf(
		func: (permissions: Readonly<ConversationDomainPermissions>) => boolean,
	): boolean {
		const updatedPermissions: ConversationDomainPermissions = {
			canCreateConversation: true, // all users can create conversations
			canManageConversation: false, // no one can manage conversations for now
			canViewConversation:
				this.root.reserver.id === this.user.id ||
				this.root.sharer.id === this.user.id, // only participants can view
		};

		return func(updatedPermissions);
	}
}
