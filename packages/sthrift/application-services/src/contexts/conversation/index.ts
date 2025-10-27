import type { DataSources } from '@sthrift/persistence';
import type { IMessagingService } from '@cellix/messaging';
import {
	Conversation as ConversationApi,
	type ConversationApplicationService,
} from './conversation/index.ts';

export interface ConversationContextApplicationService {
	Conversation: ConversationApplicationService;
}

export const Conversation = (
	dataSources: DataSources,
	messagingService: IMessagingService,
): ConversationContextApplicationService => {
	return {
		Conversation: ConversationApi(dataSources, messagingService),
	};
};
