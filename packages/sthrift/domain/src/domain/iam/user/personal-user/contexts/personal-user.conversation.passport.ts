import type { ConversationEntityReference } from '../../../../contexts/conversation/conversation/index.ts';
import type { ConversationPassport } from '../../../../contexts/conversation/conversation.passport.ts';
import type { ConversationVisa } from '../../../../contexts/conversation/conversation.visa.ts';
import { PersonalUserPassportBase } from '../personal-user.passport-base.ts';
import { PersonalUserConversationVisa } from './personal-user.conversation.visa.ts';

export class PersonalUserConversationPassport
	extends PersonalUserPassportBase
	implements ConversationPassport
{
	forConversation(root: ConversationEntityReference): ConversationVisa {
		return new PersonalUserConversationVisa(root, this._user);
	}
}