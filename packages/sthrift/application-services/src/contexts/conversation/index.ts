import type { DataSources } from '@sthrift/persistence';
import {
	Conversation as ConversationApi,
	type ConversationApplicationService,
} from './conversation/index.ts';

export interface ConversationContextApplicationService {
	Conversation: ConversationApplicationService;
}

export const Conversation = (
	dataSources: DataSources,
): ConversationContextApplicationService => {
	return {
		Conversation: ConversationApi(dataSources),
	};
};
