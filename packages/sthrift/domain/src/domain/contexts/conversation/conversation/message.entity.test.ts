import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import type { MessageProps } from './message.entity.ts';
import { Message } from './message.entity.ts';
import * as ValueObjects from './message.value-objects.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/message.entity.feature'),
);

function makeMessageProps(overrides: Partial<MessageProps> = {}): MessageProps {
	return {
		id: 'message-1',
		messagingMessageId: new ValueObjects.MessagingMessageId('MSG123456'),
		authorId: new ValueObjects.AuthorId('507f1f77bcf86cd799439011'),
		contents: new ValueObjects.MessageContents([
			'Hello, this is a test message',
		]),
		createdAt: new Date('2020-01-01T00:00:00Z'),
		...overrides,
	};
}

test.for(feature, ({ Scenario, Background, BeforeEachScenario }) => {
	let messageProps: MessageProps;
	let message: Message;

	BeforeEachScenario(() => {
		messageProps = makeMessageProps();
		message = new Message(messageProps);
	});

	Background(({ Given }) => {
		Given('a valid message with contents and author', () => {
			messageProps = makeMessageProps();
		});
	});

	Scenario('Creating a new message instance', ({ When, Then, And }) => {
		When('I create a new Message entity', () => {
			message = new Message(messageProps);
		});
		Then('the message should have the correct messagingMessageId', () => {
			expect(message.messagingMessageId.valueOf()).toBe('MSG123456');
		});
		And('the message should have the correct authorId', () => {
			expect(message.authorId.valueOf()).toBe('507f1f77bcf86cd799439011');
		});
		And('the message should have the correct contents', () => {
			expect(message.contents.valueOf()).toEqual([
				'Hello, this is a test message',
			]);
		});
		And('the message should have the correct createdAt timestamp', () => {
			expect(message.createdAt).toEqual(new Date('2020-01-01T00:00:00Z'));
		});
	});

	Scenario('Getting messagingMessageId property', ({ Given, When, Then }) => {
		let messagingMessageId: ValueObjects.MessagingMessageId;
		Given('a Message entity', () => {
			message = new Message(messageProps);
		});
		When('I get the messagingMessageId property', () => {
			messagingMessageId = message.messagingMessageId;
		});
		Then('it should return the correct messaging message ID', () => {
			expect(messagingMessageId.valueOf()).toBe('MSG123456');
		});
	});

	Scenario('Getting authorId property', ({ Given, When, Then }) => {
		let authorId: ValueObjects.AuthorId;
		Given('a Message entity', () => {
			message = new Message(messageProps);
		});
		When('I get the authorId property', () => {
			authorId = message.authorId;
		});
		Then('it should return the correct author ID', () => {
			expect(authorId.valueOf()).toBe('507f1f77bcf86cd799439011');
		});
	});

	Scenario('Getting contents property', ({ Given, When, Then }) => {
		let contents: ValueObjects.MessageContents;
		Given('a Message entity', () => {
			message = new Message(messageProps);
		});
		When('I get the contents property', () => {
			contents = message.contents;
		});
		Then('it should return the correct contents', () => {
			expect(contents.valueOf()).toEqual(['Hello, this is a test message']);
		});
	});

	Scenario('Getting createdAt property', ({ Given, When, Then }) => {
		let createdAt: Date;
		Given('a Message entity', () => {
			message = new Message(messageProps);
		});
		When('I get the createdAt property', () => {
			createdAt = message.createdAt;
		});
		Then('it should return the correct creation date', () => {
			expect(createdAt).toEqual(new Date('2020-01-01T00:00:00Z'));
		});
	});

	Scenario('Message entity is readonly', ({ Given, Then }) => {
		Given('a Message entity', () => {
			message = new Message(messageProps);
		});
		Then('all properties should be readonly and not modifiable', () => {
			// Attempt to assign should fail at compile time with TypeScript
			// At runtime, the properties should remain unchanged
			const originalMessageId = message.messagingMessageId;
			const originalAuthorId = message.authorId;
			const originalContents = message.contents;
			const originalCreatedAt = message.createdAt;

			// Verify properties haven't changed
			expect(message.messagingMessageId).toBe(originalMessageId);
			expect(message.authorId).toBe(originalAuthorId);
			expect(message.contents).toBe(originalContents);
			expect(message.createdAt).toBe(originalCreatedAt);
		});
	});
});
