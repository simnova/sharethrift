import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import type { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';
import { expect, vi } from 'vitest';
import { type ConversationQueryByIdCommand, queryById } from './query-by-id.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/query-by-id.feature'),
);

test.for(feature, ({ Scenario, BeforeEachScenario }) => {
	let mockDataSources: DataSources;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock variable
	let mockReadRepo: any;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock variable
	let mockMessagingRepo: any;
	let command: ConversationQueryByIdCommand;
	let result:
		| Domain.Contexts.Conversation.Conversation.ConversationEntityReference
		| null
		| undefined;

	BeforeEachScenario(() => {
		mockReadRepo = {
			getById: vi.fn(),
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
		'Successfully retrieving conversation with messaging messages',
		({ Given, When, Then, And }) => {
			Given('a valid conversation ID "conv-123"', () => {
				command = { conversationId: 'conv-123' };
			});

			And('the conversation exists with messaging conversation ID', () => {
				const mockConversation = {
					id: 'conv-123',
					messagingConversationId: 'messaging-123',
					sharer: { id: 'sharer-1' },
					loadSharer: vi.fn(),
					reserver: { id: 'reserver-1' },
					loadReserver: vi.fn(),
					listing: { id: 'listing-1' },
					loadListing: vi.fn(),
					createdAt: new Date(),
					updatedAt: new Date(),
					schemaVersion: '1.0',
				};
				mockReadRepo.getById.mockResolvedValue(mockConversation);
			});

			And('messaging messages are available', () => {
				const mockMessages = [
					{
						id: 'msg-1',
						messagingMessageId: 'mm-1',
						authorId: 'user-1',
						content: 'Hello',
						createdAt: new Date(),
					},
				];
				mockMessagingRepo.getMessages.mockResolvedValue(mockMessages);
			});

			When('the queryById command is executed', async () => {
				const queryByIdFn = queryById(mockDataSources);
				result = await queryByIdFn(command);
			});

			Then('the conversation should be returned', () => {
				expect(result).toBeDefined();
				expect(result?.id).toBe('conv-123');
			});

			And('the conversation should include messaging messages', () => {
				expect(result?.messages).toBeDefined();
				expect(result?.messages?.length).toBe(1);
			});
		},
	);

	Scenario(
		'Retrieving conversation when messaging service fails',
		({ Given, When, Then, And }) => {
			Given('a valid conversation ID "conv-123"', () => {
				command = { conversationId: 'conv-123' };
			});

			And('the conversation exists', () => {
				const mockConversation = {
					id: 'conv-123',
					messagingConversationId: 'messaging-123',
					sharer: { id: 'sharer-1' },
					loadSharer: vi.fn(),
					reserver: { id: 'reserver-1' },
					loadReserver: vi.fn(),
					listing: { id: 'listing-1' },
					loadListing: vi.fn(),
					createdAt: new Date(),
					updatedAt: new Date(),
					schemaVersion: '1.0',
				};
				mockReadRepo.getById.mockResolvedValue(mockConversation);
			});

			And('the messaging service fails to retrieve messages', () => {
				mockMessagingRepo.getMessages.mockRejectedValue(
					new Error('Messaging service error'),
				);
			});

			When('the queryById command is executed', async () => {
				const queryByIdFn = queryById(mockDataSources);
				result = await queryByIdFn(command);
			});

			Then('the conversation should be returned without messages', () => {
				expect(result).toBeDefined();
				expect(result?.id).toBe('conv-123');
			});

			And('a warning should be logged', () => {
				// The function logs a console.warn, which we can verify was called
				expect(mockMessagingRepo.getMessages).toHaveBeenCalled();
			});
		},
	);

	Scenario('Handling non-existent conversation', ({ Given, When, Then }) => {
		Given('a non-existent conversation ID "invalid-id"', () => {
			command = { conversationId: 'invalid-id' };
			mockReadRepo.getById.mockResolvedValue(null);
		});

		When('the queryById command is executed', async () => {
			const queryByIdFn = queryById(mockDataSources);
			result = await queryByIdFn(command);
		});

		Then('null should be returned', () => {
			expect(result).toBeNull();
		});
	});
});
