import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import type { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';
import { expect, vi } from 'vitest';
import { type ConversationSendMessageCommand, sendMessage } from './send-message.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/send-message.feature'),
);

// ============================================================================
// Test Helpers - Reusable builders and utilities
// ============================================================================

/** Build a mock conversation with default values and optional overrides */
function buildConversation(
	overrides?: Partial<Domain.Contexts.Conversation.Conversation.ConversationEntityReference>,
) {
	return {
		id: 'conv-123',
		messagingConversationId: 'messaging-conv-123',
		sharer: { id: 'author-123' },
		reserver: { id: 'reserver-456' },
		...overrides,
	};
}

/** Build a command with default values and optional overrides */
function buildCommand(
	overrides?: Partial<ConversationSendMessageCommand>,
): ConversationSendMessageCommand {
	return {
		conversationId: 'conv-123',
		content: 'Hello',
		authorId: 'author-123',
		...overrides,
	};
}

/** Create mock read repository */
function createMockReadRepo() {
	return { getById: vi.fn() };
}

/** Create mock messaging repository */
function createMockMessagingRepo() {
	return { sendMessage: vi.fn() };
}

/** Create mock data sources with default structure */
function createMockDataSources(
	mockReadRepo: ReturnType<typeof createMockReadRepo>,
	mockMessagingRepo: ReturnType<typeof createMockMessagingRepo>,
): DataSources {
	return {
		domainDataSource: {} as DataSources['domainDataSource'],
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
	} as DataSources;
}

/** Build a mock message response */
function buildMockMessage(overrides?: Partial<{ id: string; content: string; authorId: string }>) {
	return {
		id: 'msg-123',
		messagingMessageId: 'messaging-msg-123',
		authorId: { valueOf: () => overrides?.authorId ?? 'author-123' },
		content: overrides?.content ?? 'Hello, I would like to reserve this item.',
		createdAt: new Date(),
		...overrides,
	};
}

test.for(feature, ({ Scenario, BeforeEachScenario }) => {
	let mockDataSources: DataSources;
	let mockReadRepo: ReturnType<typeof createMockReadRepo>;
	let mockMessagingRepo: ReturnType<typeof createMockMessagingRepo>;
	let command: ConversationSendMessageCommand;
	let result:
		| Domain.Contexts.Conversation.Conversation.MessageEntityReference
		| undefined;
	let error: Error | undefined;

	/** Helper to execute sendMessage and capture result/error */
	async function whenSendMessage() {
		try {
			const sendMessageFn = sendMessage(mockDataSources);
			result = await sendMessageFn(command);
		} catch (err) {
			error = err as Error;
		}
	}

	/** Helper to set up a conversation that exists */
	function givenConversationExists(
		id = 'conv-123',
		overrides?: Partial<Domain.Contexts.Conversation.Conversation.ConversationEntityReference>,
	) {
		const convo = buildConversation({ id, ...overrides });
		mockReadRepo.getById.mockResolvedValue(convo);
		return convo;
	}

	BeforeEachScenario(() => {
		mockReadRepo = createMockReadRepo();
		mockMessagingRepo = createMockMessagingRepo();
		mockDataSources = createMockDataSources(mockReadRepo, mockMessagingRepo);
		result = undefined;
		error = undefined;
	});

	Scenario(
		'Successfully sending a message',
		({ Given, When, Then, And }) => {
			Given('a valid conversation exists with ID "conv-123"', () => {
				givenConversationExists('conv-123');
			});

			And('I am a participant in the conversation with author ID "author-123"', () => {
				command = buildCommand({
					conversationId: 'conv-123',
					content: 'Hello, I would like to reserve this item.',
					authorId: 'author-123',
				});
			});

			And('the message content is "Hello, I would like to reserve this item."', () => {
				// Already set in the previous step
			});

			When('I send the message', async () => {
				mockMessagingRepo.sendMessage.mockResolvedValue(buildMockMessage({
					content: 'Hello, I would like to reserve this item.',
				}));
				await whenSendMessage();
			});

			Then('the message should be sent successfully', () => {
				expect(error).toBeUndefined();
				expect(mockMessagingRepo.sendMessage).toHaveBeenCalledWith(
					expect.objectContaining({
						id: 'conv-123',
						messagingConversationId: 'messaging-conv-123',
					}),
					'Hello, I would like to reserve this item.',
					'author-123',
				);
			});

			And('the message should be returned with the content and author ID', () => {
				expect(result).toBeDefined();
				expect(result?.id).toBe('msg-123');
				expect(result?.content).toBe('Hello, I would like to reserve this item.');
			});
		},
	);

	Scenario('Sending a message with empty content', ({ Given, When, Then, And }) => {
		Given('a valid conversation exists with ID "conv-123"', () => {
			givenConversationExists('conv-123');
		});

		And('I am a participant in the conversation with author ID "author-123"', () => {
			command = buildCommand({
				conversationId: 'conv-123',
				content: '',
				authorId: 'author-123',
			});
		});

		And('the message content is empty', () => {
			// Already set in the previous step
		});

		When('I try to send the message', async () => {
			await whenSendMessage();
		});

		Then('an error should be thrown indicating message content cannot be empty', () => {
			expect(error).toBeDefined();
			expect(error?.message).toContain('Too short');
		});
	});

	Scenario('Sending a message that exceeds character limit', ({ Given, When, Then, And }) => {
		Given('a valid conversation exists with ID "conv-123"', () => {
			givenConversationExists('conv-123');
		});

		And('I am a participant in the conversation with author ID "author-123"', () => {
			command = buildCommand({
				conversationId: 'conv-123',
				content: 'a'.repeat(2001),
				authorId: 'author-123',
			});
		});

		And('the message content exceeds 2000 characters', () => {
			// Already set in the previous step
		});

		When('I try to send the message', async () => {
			await whenSendMessage();
		});

		Then('an error should be thrown indicating message exceeds maximum length', () => {
			expect(error).toBeDefined();
			expect(error?.message).toContain('Too long');
		});
	});

	Scenario('Sending a message to non-existent conversation', ({ Given, When, Then }) => {
		Given('a conversation does not exist with ID "non-existent-conv"', () => {
			mockReadRepo.getById.mockResolvedValue(null);
			command = buildCommand({
				conversationId: 'non-existent-conv',
				content: 'Hello',
				authorId: 'author-123',
			});
		});

		When('I try to send a message to that conversation', async () => {
			await whenSendMessage();
		});

		Then('an error should be thrown indicating conversation not found', () => {
			expect(error).toBeDefined();
			expect(error?.message).toContain('Conversation not found');
		});
	});

	Scenario('Sending a message when not a participant', ({ Given, When, Then, And }) => {
		Given('a valid conversation exists with ID "conv-123"', () => {
			// Conversation has different sharer/reserver than the author
			const mockConversation = buildConversation({
				id: 'conv-123',
			});
			// Override sharer/reserver to be different from the author
			(mockConversation as { sharer: { id: string } }).sharer = { id: 'sharer-789' };
			(mockConversation as { reserver: { id: string } }).reserver = { id: 'reserver-456' };
			mockReadRepo.getById.mockResolvedValue(mockConversation);
		});

		And('I am not a participant in the conversation', () => {
			// Author is not the sharer or reserver
			command = buildCommand({
				conversationId: 'conv-123',
				content: 'Hello',
				authorId: 'unauthorized-user-999',
			});
		});

		When('I try to send a message', async () => {
			await whenSendMessage();
		});

		Then('an error should be thrown indicating not authorized', () => {
			expect(error).toBeDefined();
			// Now validated at application layer, not downstream
			expect(error?.message).toContain('Author must be a participant');
		});
	});

	Scenario('Handling messaging service unavailable', ({ Given, When, Then, And }) => {
		Given('a valid conversation exists with ID "conv-123"', () => {
			givenConversationExists('conv-123');
		});

		And('I am a participant in the conversation with author ID "author-123"', () => {
			command = buildCommand({
				conversationId: 'conv-123',
				content: 'Hello',
				authorId: 'author-123',
			});
		});

		And('the messaging data source is unavailable', () => {
			mockDataSources.messagingDataSource = undefined;
		});

		When('I try to send a message', async () => {
			await whenSendMessage();
		});

		Then('an error should be thrown indicating messaging service unavailable', () => {
			expect(error).toBeDefined();
			expect(error?.message).toContain('Messaging data source is not available');
		});
	});

	Scenario('Handling messaging service send failure', ({ Given, When, Then, And }) => {
		Given('a valid conversation exists with ID "conv-123"', () => {
			givenConversationExists('conv-123');
		});

		And('I am a participant in the conversation with author ID "author-123"', () => {
			command = buildCommand({
				conversationId: 'conv-123',
				content: 'Hello',
				authorId: 'author-123',
			});
		});

		And('the messaging service fails to send the message', () => {
			mockMessagingRepo.sendMessage.mockRejectedValue(
				new Error('Service connection timeout'),
			);
		});

		When('I try to send a message', async () => {
			await whenSendMessage();
		});

		Then('an error should be thrown with the messaging service error details', () => {
			expect(error).toBeDefined();
			expect(error?.message).toContain('Service connection timeout');
		});
	});
});
