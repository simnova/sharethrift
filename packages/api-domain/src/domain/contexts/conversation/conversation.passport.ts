import type { ConversationVisa } from './conversation.visa.ts';
import type { ConversationEntityReference } from './conversation/conversation.entity.ts';

export interface ConversationPassport {
	forConversation(root: ConversationEntityReference): ConversationVisa;
}
