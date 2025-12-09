import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import type { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';
import { expect, vi } from 'vitest';
import {
	type ConversationQueryByUserCommand,
	queryByUser,
} from './query-by-user.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/query-by-user.feature'),
);

test.for(feature, ({ Scenario, BeforeEachScenario }) => {
	let mockDataSources: DataSources;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock variable
	let mockReadRepo: any;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock variable
	let mockMessagingRepo: any;
	let command: ConversationQueryByUserCommand;
	let result:
		| Domain.Contexts.Conversation.Conversation.ConversationEntityReference[]
		| undefined;

	BeforeEachScenario(() => {
		mockReadRepo = {
			getByUser: vi.fn(),
		};

		mockMessagingRepo = {
			getMessages: vi.fn(),
		};

		mockDataSources = {
			readonlyDataSource: {
				Conversation: {
					Conversation: {
						ConversationReadRepo: mockReadRepo,
					},
				},
			},
			messagingDataSource: {
				Conversation: {
					Conversation: {
						MessagingConversationRepo: mockMessagingRepo,
					},
				},
			},
		// biome-ignore lint/suspicious/noExplicitAny: Test mock type assertion
		} as any;

		result = undefined;
	});

	Scenario(
		"Successfully retrieving user's conversations with messages",
		({ Given, When, Then, And }) => {
			Given('a valid user ID "user-123"', () => {
				command = { userId: 'user-123' };
			});

			And('the user has 2 conversations', () => {
				const mockConversations = [
					{
						id: 'conv-1',
						messagingConversationId: 'msg-conv-1',
						sharer: { id: 'sharer-1' },
						loadSharer: vi.fn(),
						reserver: { id: 'reserver-1' },
						loadReserver: vi.fn(),
						listing: { id: 'listing-1' },
						loadListing: vi.fn(),
						createdAt: new Date(),
						updatedAt: new Date(),
						schemaVersion: '1.0',
					},
					{
						id: 'conv-2',
						messagingConversationId: 'msg-conv-2',
						sharer: { id: 'sharer-2' },
						loadSharer: vi.fn(),
						reserver: { id: 'reserver-2' },
						loadReserver: vi.fn(),
						listing: { id: 'listing-2' },
						loadListing: vi.fn(),
						createdAt: new Date(),
						updatedAt: new Date(),
						schemaVersion: '1.0',
					},
				];
				mockReadRepo.getByUser.mockResolvedValue(mockConversations);
			});

			And('messaging messages are available for all conversations', () => {
				mockMessagingRepo.getMessages.mockResolvedValue([
					{
						id: 'msg-1',
						messagingMessageId: 'mm-1',
						authorId: 'user-1',
						content: 'Hello',
						createdAt: new Date(),
					},
				]);
			});

			When('the queryByUser command is executed', async () => {
				const queryByUserFn = queryByUser(mockDataSources);
				result = await queryByUserFn(command);
			});

			Then('all conversations should be returned', () => {
				expect(result).toBeDefined();
				expect(result?.length).toBe(2);
			});

			And('each conversation should include messaging messages', () => {
				if (!result || result.length < 2) return;
    // biome-ignore lint/suspicious/noExplicitAny: Test mock access
				expect((result as any)[0].messages).toBeDefined();
    // biome-ignore lint/suspicious/noExplicitAny: Test mock access
				expect((result as any)[1].messages).toBeDefined();
			});
		},
	);

	Scenario(
		'Retrieving conversations when messaging service partially fails',
		({ Given, When, Then, And }) => {
			Given('a valid user ID "user-123"', () => {
				command = { userId: 'user-123' };
			});

			And('the user has 2 conversations', () => {
				const mockConversations = [
					{
						id: 'conv-1',
						messagingConversationId: 'msg-conv-1',
						sharer: { id: 'sharer-1' },
						loadSharer: vi.fn(),
						reserver: { id: 'reserver-1' },
						loadReserver: vi.fn(),
						listing: { id: 'listing-1' },
						loadListing: vi.fn(),
						createdAt: new Date(),
						updatedAt: new Date(),
						schemaVersion: '1.0',
					},
					{
						id: 'conv-2',
						messagingConversationId: 'msg-conv-2',
						sharer: { id: 'sharer-2' },
						loadSharer: vi.fn(),
						reserver: { id: 'reserver-2' },
						loadReserver: vi.fn(),
						listing: { id: 'listing-2' },
						loadListing: vi.fn(),
						createdAt: new Date(),
						updatedAt: new Date(),
						schemaVersion: '1.0',
					},
				];
				mockReadRepo.getByUser.mockResolvedValue(mockConversations);
			});

			And('messaging service fails for one conversation', () => {
				let callCount = 0;
				mockMessagingRepo.getMessages.mockImplementation(() => {
					callCount++;
					if (callCount === 1) {
						return Promise.resolve([
							{
								id: 'msg-1',
								messagingMessageId: 'mm-1',
								authorId: 'user-1',
								content: 'Hello',
								createdAt: new Date(),
							},
						]);
					}
					return Promise.reject(new Error('Messaging service error'));
				});
			});

			When('the queryByUser command is executed', async () => {
				const queryByUserFn = queryByUser(mockDataSources);
				result = await queryByUserFn(command);
			});

			Then('all conversations should be returned', () => {
				expect(result).toBeDefined();
				expect(result?.length).toBe(2);
			});

			And('the failed conversation should return without messages', () => {
    // biome-ignore lint/suspicious/noExplicitAny: Test mock access
				expect((result as any)[0].messages).toBeDefined();
    // biome-ignore lint/suspicious/noExplicitAny: Test mock access
				expect((result as any)[1].messages).toBeUndefined();
			});
		},
	);

	Scenario(
		'Handling user with no conversations',
		({ Given, When, Then, And }) => {
			Given('a valid user ID "user-456"', () => {
				command = { userId: 'user-456' };
			});

			And('the user has no conversations', () => {
				mockReadRepo.getByUser.mockResolvedValue([]);
			});

			When('the queryByUser command is executed', async () => {
				const queryByUserFn = queryByUser(mockDataSources);
				result = await queryByUserFn(command);
			});

			Then('an empty array should be returned', () => {
				expect(result).toBeDefined();
				expect(result?.length).toBe(0);
			});
		},
	);
});
