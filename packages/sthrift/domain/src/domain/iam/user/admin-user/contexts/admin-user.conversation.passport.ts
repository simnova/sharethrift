import type { ConversationPassport } from '../../../../contexts/conversation/conversation.passport.ts';
import type { ConversationVisa } from '../../../../contexts/conversation/conversation.visa.ts';
import { AdminUserPassportBase } from '../admin-user.passport-base.ts';
import { AdminUserConversationVisa } from './admin-user.conversation.visa.ts';
import type { ConversationEntityReference } from '../../../../contexts/conversation/conversation/conversation.entity.ts';

export class AdminUserConversationPassport
	extends AdminUserPassportBase
	implements ConversationPassport
{
	forConversation(root: ConversationEntityReference): ConversationVisa {
		return new AdminUserConversationVisa(root, this._user);
	}
}
