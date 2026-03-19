import type { ConversationEntityReference } from '../../../../contexts/conversation/conversation/index.ts';
import type { ConversationVisa } from '../../../../contexts/conversation/conversation.visa.ts';
import type { ConversationDomainPermissions } from '../../../../contexts/conversation/conversation.domain-permissions.ts';
import type { PersonalUserEntityReference } from '../../../../contexts/user/personal-user/index.ts';

export class PersonalUserConversationVisa<root extends ConversationEntityReference>
	implements ConversationVisa
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
		// Personal users can manage conversations they are participants in (either sharer or reserver)
		const isParticipant = this.root.sharer.id === this.user.id || this.root.reserver.id === this.user.id;
		
		const permissions: ConversationDomainPermissions = {
			canCreateConversation: true, // All personal users can create conversations
			canManageConversation: isParticipant,
			canViewConversation: isParticipant,
		};

		return func(permissions);
	}
}