import type { ConversationPassport } from '../../../../contexts/conversation/conversation.passport.ts';
import type { ConversationVisa } from '../../../../contexts/conversation/conversation.visa.ts';
import type { ConversationEntityReference } from '../../../../contexts/conversation/conversation/conversation.entity.ts';
import { PersonalUserPassportBase } from '../personal-user.passport-base.ts';
import { PersonalUserConversationVisa } from './personal-user.converstaion.visa.ts';

export class PersonalUserConversationPassport
	extends PersonalUserPassportBase
	implements ConversationPassport
{
	forConversation(root: ConversationEntityReference): ConversationVisa {
		return new PersonalUserConversationVisa(root, this._user);
	}
}
