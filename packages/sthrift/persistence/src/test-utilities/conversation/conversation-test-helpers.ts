import type { Models } from '@sthrift/data-sources-mongoose-models';
import { createValidObjectId, makeMockUser, makeMockListing } from '../mock-data-helpers.ts';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';

/**
 * Create a mock conversation for testing
 */
export function makeMockConversation(
	overrides: Partial<Models.Conversation.Conversation> = {},
): Models.Conversation.Conversation {
	const conversationId = overrides.id || 'conv-1';
	const defaultConv = {
		_id: new MongooseSeedwork.ObjectId(createValidObjectId(conversationId as string)),
		id: conversationId,
		sharer: makeMockUser('user-1'),
		reserver: makeMockUser('user-2'),
		listing: makeMockListing('listing-1'),
		messagingConversationId: 'twilio-123',
		createdAt: new Date('2020-01-01'),
		updatedAt: new Date('2020-01-02'),
		schemaVersion: '1.0.0',
	};
	return {
		...defaultConv,
		...overrides,
	} as unknown as Models.Conversation.Conversation;
}