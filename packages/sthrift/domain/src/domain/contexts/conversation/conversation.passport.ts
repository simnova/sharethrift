import type { ConversationVisa } from './conversation.visa.js';
import type { ConversationEntityReference } from './conversation/conversation.entity.js';

export interface ConversationPassport {
	forConversation(root: ConversationEntityReference): ConversationVisa;
}
