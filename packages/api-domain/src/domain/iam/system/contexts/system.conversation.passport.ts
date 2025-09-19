import type { ConversationEntityReference } from '../../../contexts/conversation/conversation/conversation.entity.ts';
import type { ConversationPassport } from '../../../contexts/conversation/conversation.passport.ts';
import { SystemPassportBase } from '../system.passport-base.ts';
import type { ConversationVisa } from '../../../contexts/conversation/conversation.visa.ts';
import type { ConversationDomainPermissions } from '../../../contexts/conversation/conversation.domain-permissions.ts';
export class SystemConversationPassport
	extends SystemPassportBase
	implements ConversationPassport
{
	forConversation(_root: ConversationEntityReference): ConversationVisa {
		const permissions = this.permissions as ConversationDomainPermissions;
		return { determineIf: (func) => func(permissions) };
	}
}
