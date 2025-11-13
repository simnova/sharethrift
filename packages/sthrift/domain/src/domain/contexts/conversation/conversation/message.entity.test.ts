import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import { Message, type MessageProps } from './message.entity.ts';
import * as ValueObjects from './message.value-objects.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/message.entity.feature'),
);

test.for(feature, ({ Scenario, Background, BeforeEachScenario }) => {
	let messageProps: MessageProps;
	let message: Message;
	let twilioMessageSid: ValueObjects.TwilioMessageSid;
	let authorId: ValueObjects.AuthorId;
	let content: ValueObjects.MessageContent;
	let createdAt: Date;

	BeforeEachScenario(() => {
		twilioMessageSid = new ValueObjects.TwilioMessageSid(
			'IM12345678901234567890123456789012',
		);
		authorId = new ValueObjects.AuthorId('507f1f77bcf86cd799439011');
		content = new ValueObjects.MessageContent('Hello, this is a test message');
		createdAt = new Date('2020-01-01T00:00:00Z');
		messageProps = {
			id: 'message-1',
			twilioMessageSid,
			messagingMessageId: new ValueObjects.MessagingMessageId('msg-123'),
			authorId,
			content,
			createdAt,
		};
		message = new Message(messageProps);
	});

	Background(({ Given }) => {
		Given(
			'a valid Message entity with twilioMessageSid, authorId, content, and createdAt',
			() => {
				message = new Message(messageProps);
			},
		);
	});

	Scenario('Getting readonly properties from a Message entity', ({ When, Then, And }) => {
		When('I access the twilioMessageSid property', () => {
			// No action needed, just checking property
		});
		Then('it should return the TwilioMessageSid value object', () => {
			expect(message.twilioMessageSid).toBeInstanceOf(ValueObjects.TwilioMessageSid);
			expect(message.twilioMessageSid.valueOf()).toBe('IM12345678901234567890123456789012');
		});
		And('when I access the authorId property', () => {
			// No action needed
		});
		Then('it should return the ObjectId', () => {
			expect(message.authorId).toBeInstanceOf(ValueObjects.AuthorId);
			expect(message.authorId).toBe(authorId);
		});
		And('when I access the content property', () => {
			// No action needed
		});
		Then('it should return the MessageContent value object', () => {
			expect(message.content).toBeInstanceOf(ValueObjects.MessageContent);
			expect(message.content.valueOf()).toBe('Hello, this is a test message');
		});
		And('when I access the createdAt property', () => {
			// No action needed
		});
		Then('it should return the Date', () => {
			expect(message.createdAt).toBeInstanceOf(Date);
			expect(message.createdAt.toISOString()).toBe('2020-01-01T00:00:00.000Z');
		});
	});

	Scenario(
		'Creating a Message entity with valid properties',
		({ Given, And, When, Then }) => {
			let newTwilioMessageSid: ValueObjects.TwilioMessageSid;
			let newAuthorId: ValueObjects.AuthorId;
			let newContent: ValueObjects.MessageContent;
			let newCreatedAt: Date;
			let newMessage: Message;

			Given('a TwilioMessageSid "IM12345678901234567890123456789012"', () => {
				newTwilioMessageSid = new ValueObjects.TwilioMessageSid(
					'IM12345678901234567890123456789012',
				);
			});
			And('an authorId ObjectId', () => {
				newAuthorId = new ValueObjects.AuthorId('507f1f77bcf86cd799439012');
			});
			And('MessageContent "Hello, this is a test message"', () => {
				newContent = new ValueObjects.MessageContent('Hello, this is a test message');
			});
			And('a createdAt timestamp', () => {
				newCreatedAt = new Date('2020-02-01T00:00:00Z');
			});
			When('I create a Message entity with these properties', () => {
				const props: MessageProps = {
					id: 'message-2',
					twilioMessageSid: newTwilioMessageSid,
					messagingMessageId: new ValueObjects.MessagingMessageId('msg-456'),
					authorId: newAuthorId,
					content: newContent,
					createdAt: newCreatedAt,
				};
				newMessage = new Message(props);
			});
			Then('the entity should be created successfully', () => {
				expect(newMessage).toBeInstanceOf(Message);
			});
			And('the twilioMessageSid should match the provided value', () => {
				expect(newMessage.twilioMessageSid.valueOf()).toBe('IM12345678901234567890123456789012');
			});
			And('the authorId should match the provided ObjectId', () => {
				expect(newMessage.authorId).toBe(newAuthorId);
			});
			And('the content should match the provided MessageContent', () => {
				expect(newMessage.content.valueOf()).toBe('Hello, this is a test message');
			});
			And('the createdAt should match the provided timestamp', () => {
				expect(newMessage.createdAt.toISOString()).toBe('2020-02-01T00:00:00.000Z');
			});
		},
	);
});
