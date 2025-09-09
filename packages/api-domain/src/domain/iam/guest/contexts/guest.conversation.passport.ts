import type { ConversationEntityReference } from '../../../contexts/conversation/conversation/index.ts';
import type { ConversationPassport } from './../../../contexts/conversation/conversation.passport.ts';
import type { ConversationVisa } from '../../../contexts/conversation/conversation.visa.ts';
import { GuestPassportBase } from '../guest.passport-base.ts';

export class GuestConversationPassport
	extends GuestPassportBase
	implements ConversationPassport
{
	forConversation(_root: ConversationEntityReference): ConversationVisa {
		return { determineIf: () => false };
	}
}
