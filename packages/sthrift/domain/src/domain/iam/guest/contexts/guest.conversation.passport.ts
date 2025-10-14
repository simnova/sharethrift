import type { ConversationEntityReference } from '../../../contexts/conversation/conversation/index.js';
import type { ConversationPassport } from './../../../contexts/conversation/conversation.passport.js';
import type { ConversationVisa } from '../../../contexts/conversation/conversation.visa.js';
import { GuestPassportBase } from '../guest.passport-base.js';

export class GuestConversationPassport
	extends GuestPassportBase
	implements ConversationPassport
{
	forConversation(_root: ConversationEntityReference): ConversationVisa {
		return { determineIf: () => false };
	}
}
