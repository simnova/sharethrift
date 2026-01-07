import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import type { MessageInstance } from '@cellix/messaging-service';
import { Domain } from '@sthrift/domain';
import { expect } from 'vitest';
import { toDomainMessage } from './messaging-conversation.domain-adapter.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(
		__dirname,
		'features/messaging-conversation.domain-adapter.feature',
	),
);

test.for(feature, ({ Scenario, Background }) => {
	let messagingMessage: MessageInstance;
	let authorId: Domain.Contexts.Conversation.Conversation.AuthorId;
	let result: Domain.Contexts.Conversation.Conversation.MessageEntityReference;

	Background(({ Given }) => {
		Given('a messaging message model instance', () => {
			// Background setup - variables re-initialized in each scenario
		});
	});

	Scenario(
		'Converting a single message to domain message',
		({ When, Then, And }) => {
			When('toDomainMessage is called with messaging message data', () => {
				messagingMessage = {
					id: 'msg-123',
					body: 'Hello, world!',
					author: '507f1f77bcf86cd799439011',
					createdAt: new Date('2024-01-15T10:30:00Z'),
					metadata: {
						originalSid: 'original-msg-789',
					},
				} as MessageInstance;

				authorId = new Domain.Contexts.Conversation.Conversation.AuthorId(
					'507f1f77bcf86cd799439011',
				);
				result = toDomainMessage(messagingMessage, authorId);
			});

			Then('it should return a valid domain message entity reference', () => {
				expect(result).toBeDefined();
				expect(result).toBeInstanceOf(
					Domain.Contexts.Conversation.Conversation.Message,
				);
			});

			And('the message should have the correct messaging message ID', () => {
				expect(result.messagingMessageId.valueOf()).toBe('original-msg-789');
			});

			And('the message should have the correct content', () => {
				expect(result.contents.valueOf()).toEqual(['Hello, world!']);
			});

			And(
				'the message should extract originalSid from metadata if present',
				() => {
					expect(result.messagingMessageId.valueOf()).toBe('original-msg-789');
				},
			);
		},
	);

	Scenario(
		'Converting a single message without metadata',
		({ When, Then, And }) => {
			When('toDomainMessage is called without metadata', () => {
				messagingMessage = {
					id: 'msg-456',
					body: 'Another message',
					author: '507f1f77bcf86cd799439022',
				} as MessageInstance;

				authorId = new Domain.Contexts.Conversation.Conversation.AuthorId(
					'507f1f77bcf86cd799439022',
				);
				result = toDomainMessage(messagingMessage, authorId);
			});

			Then('it should use the message id as messagingId', () => {
				expect(result.messagingMessageId.valueOf()).toBe('msg-456');
			});

			And('it should use default date for missing createdAt', () => {
				expect(result.createdAt).toBeInstanceOf(Date);
			});
		},
	);
});
