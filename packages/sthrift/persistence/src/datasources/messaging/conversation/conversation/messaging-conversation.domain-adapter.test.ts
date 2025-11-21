import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import { Domain } from '@sthrift/domain';
import type { ConversationInstance, MessageInstance } from '@cellix/messaging-service';
import {
	toDomainConversationProps,
	toDomainMessage,
	toDomainMessages,
} from './messaging-conversation.domain-adapter.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/messaging-conversation.domain-adapter.feature'),
);

function makePersonalUserRef(id: string): Domain.Contexts.User.PersonalUser.PersonalUserEntityReference {
	return {
		id,
		createdAt: new Date(),
		updatedAt: new Date(),
		schemaVersion: '1.0.0',
	} as Domain.Contexts.User.PersonalUser.PersonalUserEntityReference;
}

function makeListingRef(id: string): Domain.Contexts.Listing.ItemListing.ItemListingEntityReference {
	return {
		id,
		createdAt: new Date(),
		updatedAt: new Date(),
		schemaVersion: '1.0.0',
	} as Domain.Contexts.Listing.ItemListing.ItemListingEntityReference;
}

test.for(feature, ({ Scenario, Background }) => {
	let messagingConversation: ConversationInstance;
	let messagingMessage: MessageInstance;
	let messagingMessages: MessageInstance[];
	let sharer: Domain.Contexts.User.PersonalUser.PersonalUserEntityReference;
	let reserver: Domain.Contexts.User.PersonalUser.PersonalUserEntityReference;
	let listing: Domain.Contexts.Listing.ItemListing.ItemListingEntityReference;
	let messages: Domain.Contexts.Conversation.Conversation.MessageEntityReference[];
	let authorIdMap: Map<string, Domain.Contexts.Conversation.Conversation.AuthorId>;
	// biome-ignore lint/suspicious/noExplicitAny: result can be different types depending on scenario
	let result: any;

	Background(({ Given }) => {
		Given('a messaging conversation model instance', () => {
			// Background setup - variables re-initialized in each scenario
		});
	});

	Scenario('Converting messaging conversation to domain conversation props', ({ When, Then, And }) => {
		When('toDomainConversationProps is called with messaging conversation data', () => {
			sharer = makePersonalUserRef('sharer-id');
			reserver = makePersonalUserRef('reserver-id');
			listing = makeListingRef('listing-id');
			messages = [];
			messagingConversation = {
				id: 'conv-123',
				displayName: 'Test Conversation',
				createdAt: new Date('2024-01-01'),
				updatedAt: new Date('2024-01-02'),
				state: 'active',
				metadata: {},
			};
			result = toDomainConversationProps(messagingConversation, sharer, reserver, listing, messages);
		});

		Then('it should return valid domain conversation props', () => {
			expect(result).toBeDefined();
			expect(result.id).toBe('conv-123');
		});

		And('the props should have all required fields', () => {
			expect(result.sharer).toBe(sharer);
			expect(result.reserver).toBe(reserver);
			expect(result.listing).toBe(listing);
			expect(result.messages).toBe(messages);
		});

		And('the messaging conversation ID should be extracted correctly', () => {
			expect(result.messagingConversationId).toBe('conv-123');
		});

		And('async loader functions should work', async () => {
			expect(await result.loadSharer()).toBe(sharer);
			expect(await result.loadReserver()).toBe(reserver);
			expect(await result.loadListing()).toBe(listing);
			expect(await result.loadMessages()).toBe(messages);
		});
	});

	Scenario('Converting messaging conversation with original SID in metadata', ({ When, Then, And }) => {
		When('toDomainConversationProps is called with metadata containing originalSid', () => {
			sharer = makePersonalUserRef('sharer-id');
			reserver = makePersonalUserRef('reserver-id');
			listing = makeListingRef('listing-id');
			messages = [];
			messagingConversation = {
				id: 'conv-123',
				displayName: 'Test Conversation',
				createdAt: new Date('2024-01-01'),
				updatedAt: new Date('2024-01-02'),
				state: 'active',
				metadata: { originalSid: 'original-sid-456' },
			};
			result = toDomainConversationProps(messagingConversation, sharer, reserver, listing, messages);
		});

		Then('the messagingConversationId should use the originalSid value', () => {
			expect(result.messagingConversationId).toBe('original-sid-456');
		});

		And('it should not use the conversation id', () => {
			expect(result.messagingConversationId).not.toBe('conv-123');
		});
	});

	Scenario('Converting messaging conversation without metadata', ({ When, Then, And }) => {
		When('toDomainConversationProps is called without metadata', () => {
			sharer = makePersonalUserRef('sharer-id');
			reserver = makePersonalUserRef('reserver-id');
			listing = makeListingRef('listing-id');
			messages = [];
			messagingConversation = {
				id: 'conv-123',
				displayName: 'Test Conversation',
				state: 'active',
			};
			result = toDomainConversationProps(messagingConversation, sharer, reserver, listing, messages);
		});

		Then('the messagingConversationId should use the conversation id', () => {
			expect(result.messagingConversationId).toBe('conv-123');
		});

		And('default dates should be used for missing timestamps', () => {
			expect(result.createdAt).toBeInstanceOf(Date);
			expect(result.updatedAt).toBeInstanceOf(Date);
		});
	});

	Scenario('Converting a single message to domain message', ({ When, Then, And }) => {
		let authorId: Domain.Contexts.Conversation.Conversation.AuthorId;

		When('toDomainMessage is called with messaging message data', () => {
			messagingMessage = {
				id: 'msg-123',
				body: 'Test message',
				author: '507f1f77bcf86cd799439011',
				createdAt: new Date('2024-01-01'),
				metadata: { originalSid: 'msg-original-456' },
			};
			authorId = new Domain.Contexts.Conversation.Conversation.AuthorId('507f1f77bcf86cd799439011');
			result = toDomainMessage(messagingMessage, authorId);
		});

		Then('it should return a valid domain message entity reference', () => {
			expect(result).toBeInstanceOf(Domain.Contexts.Conversation.Conversation.Message);
			expect(result.id).toBe('msg-123');
		});

		And('the message should have the correct messaging message ID', () => {
			expect(result.messagingMessageId.valueOf()).toBe('msg-original-456');
		});

		And('the message should have the correct content', () => {
			expect(result.content.valueOf()).toBe('Test message');
		});

		And('the message should extract originalSid from metadata if present', () => {
			expect(result.messagingMessageId.valueOf()).toBe('msg-original-456');
		});
	});

	Scenario('Converting a single message without metadata', ({ When, Then, And }) => {
		let authorId: Domain.Contexts.Conversation.Conversation.AuthorId;

		When('toDomainMessage is called without metadata', () => {
			messagingMessage = {
				id: 'msg-123',
				body: 'Test message',
				author: '507f1f77bcf86cd799439011',
			};
			authorId = new Domain.Contexts.Conversation.Conversation.AuthorId('507f1f77bcf86cd799439011');
			result = toDomainMessage(messagingMessage, authorId);
		});

		Then('it should use the message id as messagingId', () => {
			expect(result.messagingMessageId.valueOf()).toBe('msg-123');
		});

		And('it should use default date for missing createdAt', () => {
			expect(result.createdAt).toBeInstanceOf(Date);
		});
	});

	Scenario('Converting multiple messages with author mapping', ({ When, Then, And }) => {
		When('toDomainMessages is called with messages and author ID map', () => {
			messagingMessages = [
				{ id: 'msg-1', body: 'Message 1', author: 'author-1', createdAt: new Date() },
				{ id: 'msg-2', body: 'Message 2', author: 'author-2', createdAt: new Date() },
			];
			authorIdMap = new Map();
			authorIdMap.set('author-1', new Domain.Contexts.Conversation.Conversation.AuthorId('507f1f77bcf86cd799439011'));
			authorIdMap.set('author-2', new Domain.Contexts.Conversation.Conversation.AuthorId('507f1f77bcf86cd799439022'));
			result = toDomainMessages(messagingMessages, authorIdMap);
		});

		Then('it should return an array of domain message entity references', () => {
			expect(result).toBeInstanceOf(Array);
			expect(result.length).toBe(2);
		});

		And('each message should have the correct author ID from the map', () => {
			expect(result[0].authorId.valueOf()).toBe('507f1f77bcf86cd799439011');
			expect(result[1].authorId.valueOf()).toBe('507f1f77bcf86cd799439022');
		});
	});

	Scenario('Converting multiple messages with missing authors', ({ When, Then, And }) => {
		When('toDomainMessages is called with messages missing author field', () => {
			messagingMessages = [
				{ id: 'msg-1', body: 'Message 1', createdAt: new Date() },
				{ id: 'msg-2', body: 'Message 2', createdAt: new Date() },
			];
			authorIdMap = new Map();
			result = toDomainMessages(messagingMessages, authorIdMap);
		});

		Then('it should use ANONYMOUS_AUTHOR_ID for those messages', () => {
			expect(result[0].authorId).toBeInstanceOf(Domain.Contexts.Conversation.Conversation.AuthorId);
			expect(result[0].authorId.valueOf()).toBe(Domain.Contexts.Conversation.Conversation.ANONYMOUS_AUTHOR_ID);
			expect(result[1].authorId).toBeInstanceOf(Domain.Contexts.Conversation.Conversation.AuthorId);
			expect(result[1].authorId.valueOf()).toBe(Domain.Contexts.Conversation.Conversation.ANONYMOUS_AUTHOR_ID);
		});

		And('the conversion should not fail', () => {
			expect(result).toBeInstanceOf(Array);
			expect(result.length).toBe(2);
		});
	});

	Scenario('Converting multiple messages with unknown authors', ({ When, Then, And }) => {
		When('toDomainMessages is called with authors not in the map', () => {
			messagingMessages = [
				{ id: 'msg-1', body: 'Message 1', author: 'unknown-author', createdAt: new Date() },
				{ id: 'msg-2', body: 'Message 2', author: 'known-author', createdAt: new Date() },
			];
			authorIdMap = new Map();
			authorIdMap.set('known-author', new Domain.Contexts.Conversation.Conversation.AuthorId('507f1f77bcf86cd799439033'));
			result = toDomainMessages(messagingMessages, authorIdMap);
		});

		Then('it should use ANONYMOUS_AUTHOR_ID for unknown authors', () => {
			expect(result).toBeInstanceOf(Array);
			expect(result.length).toBe(2);
			expect(result[0]).toBeInstanceOf(Domain.Contexts.Conversation.Conversation.Message);
			expect(result[0].authorId).toBeInstanceOf(Domain.Contexts.Conversation.Conversation.AuthorId);
			expect(result[0].authorId.valueOf()).toBe(Domain.Contexts.Conversation.Conversation.ANONYMOUS_AUTHOR_ID);
		});

		And('other messages with known authors should use mapped IDs', () => {
			expect(result[1]).toBeInstanceOf(Domain.Contexts.Conversation.Conversation.Message);
			expect(result[1].authorId).toBeInstanceOf(Domain.Contexts.Conversation.Conversation.AuthorId);
			expect(result[1].authorId.valueOf()).toBe('507f1f77bcf86cd799439033');
		});
	});
});
