import type { ConversationEntityReference } from '../../../contexts/conversation/conversation/conversation.ts';
import type { ConversationPassport } from '../../../contexts/conversation/conversation.passport.ts';
import { SystemPassportBase } from '../system.passport-base.ts';
import type { ConversationVisa } from '../../../contexts/conversation/conversation.visa.ts';

export class SystemConversationPassport
	extends SystemPassportBase
	implements ConversationPassport
{
	forConversation(_root: ConversationEntityReference): ConversationVisa {
		return { determineIf: () => true };
	}
}
