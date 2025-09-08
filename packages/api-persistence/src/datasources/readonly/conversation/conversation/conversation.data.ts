import type { Models } from '@sthrift/api-data-sources-mongoose-models';
import {
	type MongoDataSource,
	MongoDataSourceImpl,
} from '../../mongo-data-source.ts';

export interface ConversationDataSource
	extends MongoDataSource<Models.Conversation.Conversation> {}
export class ConversationDataSourceImpl
	extends MongoDataSourceImpl<Models.Conversation.Conversation>
	implements ConversationDataSource {}
