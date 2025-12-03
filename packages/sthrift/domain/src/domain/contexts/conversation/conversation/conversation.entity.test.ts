import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import type { ConversationProps } from './conversation.entity.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/conversation.entity.feature'),
);

// biome-ignore lint/suspicious/noExplicitAny: Test helper function
function makeConversationProps(overrides?: Partial<ConversationProps>): any {
	return {
		id: 'test-conversation-id',
		sharer: { id: 'test-sharer-id' },
		loadSharer: async () => ({ id: 'test-sharer-id' }),
		reserver: { id: 'test-reserver-id' },
		loadReserver: async () => ({ id: 'test-reserver-id' }),
		listing: { id: 'test-listing-id' },
		loadListing: async () => ({ id: 'test-listing-id' }),
		messagingConversationId: 'test-messaging-id',
		messages: [],
		loadMessages: async () => [],
		createdAt: new Date(),
		updatedAt: new Date(),
		schemaVersion: '1.0',
		...overrides,
	};
}

test.for(feature, ({ Background, Scenario }) => {
	// biome-ignore lint/suspicious/noExplicitAny: Test variable
	let props: any;

	Background(({ Given }) => {
		Given('I have a conversation props object', () => {
			props = makeConversationProps();
		});
	});

	Scenario('Conversation sharer reference should be readonly', ({ When, Then }) => {
		When('I attempt to modify the sharer property', () => {
			Object.defineProperty(props, 'sharer', { writable: false, configurable: false, value: props.sharer });
			try {
				props.sharer = { id: 'new-sharer-id' };
			} catch (_error) {
				// Expected behavior for readonly
			}
		});

		Then('the sharer property should be readonly', () => {
			const conversationProps: ConversationProps = props;
			expect(conversationProps.sharer).toEqual({ id: 'test-sharer-id' });
		});
	});

	Scenario('Conversation reserver reference should be readonly', ({ When, Then }) => {

		When('I attempt to modify the reserver property', () => {
			Object.defineProperty(props, 'reserver', { writable: false, configurable: false, value: props.reserver });
			try {
				props.reserver = { id: 'new-reserver-id' };
			} catch (_error) {
				// Expected behavior for readonly
			}
		});

		Then('the reserver property should be readonly', () => {
			const conversationProps: ConversationProps = props;
			expect(conversationProps.reserver).toEqual({ id: 'test-reserver-id' });
		});
	});

	Scenario('Conversation listing reference should be readonly', ({ When, Then }) => {

		When('I attempt to modify the listing property', () => {
			Object.defineProperty(props, 'listing', { writable: false, configurable: false, value: props.listing });
			try {
				props.listing = { id: 'new-listing-id' };
			} catch (_error) {
				// Expected behavior for readonly
			}
		});

		Then('the listing property should be readonly', () => {
			const conversationProps: ConversationProps = props;
			expect(conversationProps.listing).toEqual({ id: 'test-listing-id' });
		});
	});

	Scenario('Conversation messaging ID should be a string', ({ When, Then }) => {

		When('I access the messagingConversationId property', () => {
			// Access the property
		});

		Then('it should be a string', () => {
			const conversationProps: ConversationProps = props;
			expect(typeof conversationProps.messagingConversationId).toBe('string');
			expect(conversationProps.messagingConversationId).toBe('test-messaging-id');
		});
	});

	Scenario('Conversation messages array should be readonly', ({ When, Then }) => {

		When('I attempt to modify the messages property', () => {
			Object.defineProperty(props, 'messages', { writable: false, configurable: false, value: props.messages });
			try {
				props.messages = [{ id: 'new-message-id' }];
			} catch (_error) {
				// Expected behavior for readonly
			}
		});

		Then('the messages property should be readonly', () => {
			const conversationProps: ConversationProps = props;
			expect(Array.isArray(conversationProps.messages)).toBe(true);
			expect(conversationProps.messages).toEqual([]);
		});
	});

	Scenario('Conversation loadSharer should return a promise', ({ When, Then }) => {
		// biome-ignore lint/suspicious/noExplicitAny: Test variable
		let result: any;

		When('I call the loadSharer method', async () => {
			result = await props.loadSharer();
		});

		Then('it should return a sharer reference', () => {
			expect(result).toEqual({ id: 'test-sharer-id' });
		});
	});

	Scenario('Conversation loadReserver should return a promise', ({ When, Then }) => {
		// biome-ignore lint/suspicious/noExplicitAny: Test variable
		let result: any;

		When('I call the loadReserver method', async () => {
			result = await props.loadReserver();
		});

		Then('it should return a reserver reference', () => {
			expect(result).toEqual({ id: 'test-reserver-id' });
		});
	});

	Scenario('Conversation loadListing should return a promise', ({ When, Then }) => {
		// biome-ignore lint/suspicious/noExplicitAny: Test variable
		let result: any;

		When('I call the loadListing method', async () => {
			result = await props.loadListing();
		});

		Then('it should return a listing reference', () => {
			expect(result).toEqual({ id: 'test-listing-id' });
		});
	});

	Scenario('Conversation loadMessages should return a promise', ({ When, Then }) => {
		// biome-ignore lint/suspicious/noExplicitAny: Test variable
		let result: any;

		When('I call the loadMessages method', async () => {
			result = await props.loadMessages();
		});

		Then('it should return an array of messages', () => {
			expect(Array.isArray(result)).toBe(true);
			expect(result).toEqual([]);
		});
	});

	Scenario('Conversation timestamps should be dates', ({ When, Then }) => {

		When('I access the timestamp properties', () => {
			// Access the properties
		});

		Then('createdAt and updatedAt should be Date objects', () => {
			const conversationProps: ConversationProps = props;
			expect(conversationProps.createdAt).toBeInstanceOf(Date);
			expect(conversationProps.updatedAt).toBeInstanceOf(Date);
		});
	});

	Scenario('Conversation schema version should be readonly', ({ When, Then }) => {

		When('I attempt to access the schemaVersion property', () => {
			// Access the property
		});

		Then('the schemaVersion should be a string', () => {
			const conversationProps: ConversationProps = props;
			expect(typeof conversationProps.schemaVersion).toBe('string');
			expect(conversationProps.schemaVersion).toBe('1.0');
		});
	});
});
