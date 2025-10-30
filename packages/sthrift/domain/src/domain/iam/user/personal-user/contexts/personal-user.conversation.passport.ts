import type { ConversationEntityReference } from '../../../../contexts/conversation/conversation/index.ts';
import type { ConversationPassport } from '../../../../contexts/conversation/conversation.passport.ts';
import type { ConversationVisa } from '../../../../contexts/conversation/conversation.visa.ts';
import type { ConversationDomainPermissions } from '../../../../contexts/conversation/conversation.domain-permissions.ts';
import { PersonalUserPassportBase } from '../personal-user.passport-base.ts';

export class PersonalUserConversationPassport
	extends PersonalUserPassportBase
	implements ConversationPassport
{
	forConversation(root: ConversationEntityReference): ConversationVisa {
		return {
			determineIf: (func: (permissions: Readonly<ConversationDomainPermissions>) => boolean): boolean => {
				// Personal users can manage conversations they are participants in (either sharer or reserver)
				const isParticipant = root.sharer.id === this._user.id || root.reserver.id === this._user.id;
				
				const permissions: ConversationDomainPermissions = {
					canCreateConversation: true, // All personal users can create conversations
					canManageConversation: isParticipant,
					canViewConversation: isParticipant,
				};

				return func(permissions);
			}
		};
	}
}