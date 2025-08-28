import type { ConversationVisa } from './conversation.visa.ts';
import type { ConversationEntityReference } from './conversation/conversation.aggregate.ts';

export interface ConversationPassport {
	forConversation(root: ConversationEntityReference): ConversationVisa;
}
