import type { ConversationEntityReference } from '../../../contexts/conversation/conversation/conversation.entity.js';
import type { ConversationPassport } from '../../../contexts/conversation/conversation.passport.js';
import { SystemPassportBase } from '../system.passport-base.js';
import type { ConversationVisa } from '../../../contexts/conversation/conversation.visa.js';
import type { ConversationDomainPermissions } from '../../../contexts/conversation/conversation.domain-permissions.js';
export class SystemConversationPassport
	extends SystemPassportBase
	implements ConversationPassport
{
	forConversation(_root: ConversationEntityReference): ConversationVisa {
		const permissions = this.permissions as ConversationDomainPermissions;
		return { determineIf: (func) => func(permissions) };
	}
}
